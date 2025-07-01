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
import QRScanner from "@/components/qr-scanner";
import TabNavigation from "@/components/tab-navigation";

export default function ManagerDashboard() {
  const { user, token, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [manualQRCode, setManualQRCode] = useState('');
  const [isScanning, setIsScanning] = useState(true);

  const validateQRMutation = useMutation({
    mutationFn: async (code: string) => {
      const response = await apiRequest('POST', '/api/qr/validate', { code });
      return response.json();
    },
    onSuccess: (data) => {
      // Navigate to customer validation page
      setLocation(`/manager/validate/${encodeURIComponent(data.qrCode.code)}`);
    },
    onError: (error: any) => {
      toast({
        title: "QR Code validation failed",
        description: error.message || "Please try scanning again.",
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

  const handleQRScan = (result: string) => {
    setIsScanning(false);
    validateQRMutation.mutate(result);
    // Reset scanning after a delay
    setTimeout(() => setIsScanning(true), 2000);
  };

  const handleManualValidation = () => {
    if (!manualQRCode.trim()) {
      toast({
        title: "Invalid input",
        description: "Please enter a QR code.",
        variant: "destructive",
      });
      return;
    }
    
    validateQRMutation.mutate(manualQRCode.trim());
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) return null;

  return (
    <>
      <TabNavigation />
      {/* Header */}
      <div className="bg-[#2C3E50] text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Staff Portal</h2>
            <p className="text-gray-300 text-sm">Scan customer QR codes</p>
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

      {/* QR Scanner Interface */}
      <div className="p-6">
        <QRScanner onScan={handleQRScan} isActive={isScanning} />

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200 mt-6 mb-6">
          <CardContent className="p-4">
            <div className="flex items-start">
              <Info className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">How to scan</h4>
                <p className="text-sm text-blue-700">
                  Ask customer to show their QR code and position it within the frame above. 
                  The system will automatically detect and validate the code.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manual Entry Option */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-[#2C3E50] mb-3">Manual Entry</h3>
          <div className="flex space-x-3">
            <Input
              type="text"
              placeholder="Enter QR code manually"
              value={manualQRCode}
              onChange={(e) => setManualQRCode(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleManualValidation();
                }
              }}
            />
            <Button
              className="bg-[#2C3E50] hover:bg-gray-700 text-white"
              onClick={handleManualValidation}
              disabled={validateQRMutation.isPending}
            >
              {validateQRMutation.isPending ? "Validating..." : "Validate"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
