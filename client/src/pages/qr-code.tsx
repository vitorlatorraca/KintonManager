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
import TabNavigation from "@/components/tab-navigation";

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
      <>
        <TabNavigation />
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Skeleton className="h-10 w-10 rounded-full mr-3" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="text-center">
            <Skeleton className="h-20 w-full rounded-lg mb-6" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </>
    );
  }

  const activeCustomerCode = dashboardData?.activeCustomerCode;

  return (
    <>
      <TabNavigation />
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100 mr-3"
            onClick={() => setLocation('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <h2 className="text-xl font-bold text-[#2C3E50]">Your Customer Code</h2>
        </div>

        <div className="text-center">
          {activeCustomerCode ? (
            <>
              <Card className="border-2 border-dashed border-gray-300 mb-6">
                <CardContent className="p-8">
                  <div className="bg-[#2C3E50] text-white rounded-lg p-6 mb-4">
                    <Hash className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-4xl font-mono font-bold tracking-wider">
                      {activeCustomerCode.code}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Show this 6-digit code to staff
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-orange-50 border-orange-200 mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="h-4 w-4 text-orange-500 mr-2" />
                    <span className="text-orange-700 font-medium">
                      Expires in: <span className="font-mono">{timeRemaining}</span>
                    </span>
                  </div>
                  <p className="text-sm text-orange-600">
                    Tell staff your code to collect your stamp
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-2 border-dashed border-gray-300 mb-6">
              <CardContent className="p-8">
                <Hash className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-4">No customer code available</p>
                <Button
                  onClick={handleGenerateNew}
                  disabled={generateCodeMutation.isPending}
                  className="bg-[#2C3E50] hover:bg-gray-700 text-white"
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
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
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
      </div>
    </>
  );
}