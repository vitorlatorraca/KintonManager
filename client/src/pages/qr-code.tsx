import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, RefreshCw, Hash, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatTimeRemaining } from "@/lib/qr-utils";
import AppShell from "@/components/app-shell";
import HeroTitle from "@/components/hero-title";

export default function CustomerCodePage() {
  const { user, token } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  const generateCodeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/customer-code/generate', {});
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Customer Code generated!",
        description: "Show this code to staff to collect your stamp.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to generate customer code",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const { data: dashboardData, isLoading, refetch } = useQuery({
    queryKey: ['/api/user/dashboard'],
    queryFn: async () => {
      const response = await fetch('/api/user/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      return response.json();
    },
    enabled: !!token,
  });

  // Update timer
  useEffect(() => {
    if (!dashboardData?.activeCustomerCode?.expiresAt) return;

    const interval = setInterval(() => {
      const remaining = formatTimeRemaining(dashboardData.activeCustomerCode.expiresAt);
      setTimeRemaining(remaining);
      
      if (remaining === 'Expired') {
        clearInterval(interval);
        toast({
          title: "Customer Code expired",
          description: "Please generate a new customer code.",
          variant: "destructive",
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [dashboardData?.activeCustomerCode?.expiresAt, toast]);

  useEffect(() => {
    if (!user || !token || user.userType !== 'CUSTOMER') {
      setLocation('/');
    }
  }, [user, token, setLocation]);

  const handleGenerateNew = () => {
    generateCodeMutation.mutate();
    refetch();
  };

  if (isLoading) {
    return (
      <AppShell showNav={false}>
        <div className="max-w-2xl mx-auto space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </AppShell>
    );
  }

  const activeCustomerCode = dashboardData?.activeCustomerCode;

  return (
    <AppShell showNav={false}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="btn-ghost rounded-full"
            onClick={() => setLocation('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <HeroTitle className="text-3xl">Your Customer Code</HeroTitle>
        </div>

        {activeCustomerCode ? (
          <>
            <Card className="card-base">
              <CardContent className="p-8 text-center">
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-8 mb-6">
                  <Hash className="w-10 h-10 mx-auto mb-4 text-accent" />
                  <div className="text-5xl font-mono font-bold tracking-wider text-text-primary">
                    {activeCustomerCode.code}
                  </div>
                </div>
                <p className="text-sm text-text-muted">
                  Show this 6-digit code to staff to collect your stamp
                </p>
              </CardContent>
            </Card>

            <Card className="card-base border-warning/20 bg-warning/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-warning" />
                  <span className="text-warning font-medium">
                    Expires in: <span className="font-mono">{timeRemaining}</span>
                  </span>
                </div>
                <p className="text-sm text-text-muted text-center">
                  Tell staff your code to collect your stamp
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="card-base border-dashed">
            <CardContent className="p-12 text-center">
              <Hash className="w-16 h-16 mx-auto mb-4 text-text-muted" />
              <p className="text-text-muted mb-6">No customer code available</p>
              <Button
                onClick={handleGenerateNew}
                disabled={generateCodeMutation.isPending}
                className="btn-primary"
              >
                {generateCodeMutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Hash className="w-4 h-4 mr-2" />
                    Generate Customer Code
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="text-center">
          <Button
            onClick={handleGenerateNew}
            disabled={generateCodeMutation.isPending}
            variant="ghost"
            className="btn-ghost"
          >
            {generateCodeMutation.isPending ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate New Code
              </>
            )}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}