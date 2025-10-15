import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { LogOut, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
// Removed QR scanner - now using manual code entry
import TabNavigation from "@/components/tab-navigation";

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
    <>
      <TabNavigation />
      {/* Header */}
      <div className="bg-[#222d38] text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Staff Portal</h2>
            <p className="text-gray-300 text-sm">Validate customer codes</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-gray-600"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Customer Code Entry */}
      <div className="p-6">
        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200 mb-6">
          <CardContent className="p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">How to validate</h4>
                <p className="text-sm text-blue-700">
                  Ask the customer for their 6-digit code and enter it below to validate and add their stamp.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Entry */}
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-[#2C3E50] mb-3 text-center">Customer Code Entry</h3>
          <div className="flex space-x-3">
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              value={customerCode}
              onChange={(e) => setCustomerCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="flex-1 text-center text-2xl font-mono tracking-wider"
              maxLength={6}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCodeValidation();
                }
              }}
            />
            <Button
              className="bg-[#2C3E50] hover:bg-gray-700 text-white"
              onClick={handleCodeValidation}
              disabled={validateCodeMutation.isPending || customerCode.length !== 6}
            >
              {validateCodeMutation.isPending ? "Validating..." : "Validate"}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Enter the 6-digit code shown on the customer's phone
          </p>
        </div>
      </div>
    </>
  );
}
