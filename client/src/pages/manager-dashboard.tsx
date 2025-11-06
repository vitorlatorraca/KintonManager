import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { LogOut, Info, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import AppShell from "@/components/app-shell";
import HeroTitle from "@/components/hero-title";

export default function ManagerDashboard() {
  const { user, token, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [customerCode, setCustomerCode] = useState(''); 

  const validateCodeMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest('POST', '/api/customer-code/validate', { code });
      return response.json();
    },
    onSuccess: (data) => {
      // Navigate to customer validation page
      setLocation(`/manager/validate/${encodeURIComponent(data.customerCode.code)}`);
    },
    onError: (error: any) => {
      toast({
        title: "Customer code validation failed",
        description: error.message || "Please check the code and try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!user || !token) {
      setLocation('/manager');
      return;
    }

    if (user.userType !== 'MANAGER' && user.userType !== 'ADMIN') {
      setLocation('/');
      return;
    }
  }, [user, token, setLocation]);

  const handleCodeValidation = () => {
    if (!customerCode.trim()) {
      toast({
        title: "Invalid input",
        description: "Please enter a customer code.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate that it's a 6-digit number
    if (!/^\d{6}$/.test(customerCode.trim())) {
      toast({
        title: "Invalid code format",
        description: "Please enter a 6-digit numeric code.",
        variant: "destructive",
      });
      return;
    }
    
    validateCodeMutation.mutate(customerCode.trim());
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) return null;

  return (
    <AppShell showNav={false}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <HeroTitle className="text-3xl">Staff Portal</HeroTitle>
            <p className="text-text-muted mt-2">Validate customer codes</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="btn-ghost rounded-full"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>

        {/* Instructions */}
        <Card className="card-base border-info/20 bg-info/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Info className="h-5 w-5 text-info mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-text-primary mb-2">How to validate</h4>
                <p className="text-sm text-text-muted">
                  Ask the customer for their 6-digit code and enter it below to validate and add their stamp.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Entry */}
        <Card className="card-base">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-text-primary mb-2">Customer Code Entry</h3>
                <p className="text-sm text-text-muted">
                  Enter the 6-digit code shown on the customer's phone
                </p>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
                  <Input
                    type="text"
                    placeholder="000000"
                    value={customerCode}
                    onChange={(e) => setCustomerCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="input-base text-center text-3xl font-mono tracking-widest pl-12"
                    maxLength={6}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCodeValidation();
                      }
                    }}
                  />
                </div>
                <Button
                  className="btn-primary px-8"
                  onClick={handleCodeValidation}
                  disabled={validateCodeMutation.isPending || customerCode.length !== 6}
                >
                  {validateCodeMutation.isPending ? "Validating..." : "Validate"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
