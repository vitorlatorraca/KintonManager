import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, RefreshCw, QrCode as QrCodeIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { generateQRCodeDataURL, formatTimeRemaining } from "@/lib/qr-utils";
import TabNavigation from "@/components/tab-navigation";

export default function QRCodePage() {
  const { user, token } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  const generateQRMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/qr/generate', {});
      return response.json();
    },
    onSuccess: async (data) => {
      try {
        const dataURL = await generateQRCodeDataURL(data.code);
        setQrCodeDataURL(dataURL);
        toast({
          title: "QR Code generated!",
          description: "Show this to staff to collect your stamp.",
        });
      } catch (error) {
        toast({
          title: "Error generating QR code",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Failed to generate QR code",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const { data: qrData, isLoading, refetch } = useQuery({
    queryKey: ['/api/user/dashboard'],
    queryFn: async () => {
      const response = await fetch('/api/user/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch QR data');
      }
      return response.json();
    },
    enabled: !!token,
  });

  // Update timer
  useEffect(() => {
    if (!qrData?.activeQRCode?.expiresAt) return;

    const interval = setInterval(() => {
      const remaining = formatTimeRemaining(qrData.activeQRCode.expiresAt);
      setTimeRemaining(remaining);
      
      if (remaining === 'Expired') {
        clearInterval(interval);
        toast({
          title: "QR Code expired",
          description: "Please generate a new QR code.",
          variant: "destructive",
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [qrData?.activeQRCode?.expiresAt, toast]);

  // Generate QR code image when data is available
  useEffect(() => {
    if (qrData?.activeQRCode?.code && !qrCodeDataURL) {
      generateQRCodeDataURL(qrData.activeQRCode.code)
        .then(setQrCodeDataURL)
        .catch(console.error);
    }
  }, [qrData?.activeQRCode?.code, qrCodeDataURL]);

  useEffect(() => {
    if (!user || !token || user.userType !== 'CUSTOMER') {
      setLocation('/');
    }
  }, [user, token, setLocation]);

  const handleGenerateNew = () => {
    generateQRMutation.mutate();
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
            <Skeleton className="h-48 w-48 mx-auto rounded-2xl mb-6" />
            <Skeleton className="h-20 w-full rounded-lg mb-6" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      </>
    );
  }

  const activeQRCode = qrData?.activeQRCode;

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
          <h2 className="text-xl font-bold text-[#2C3E50]">Your QR Code</h2>
        </div>

        <div className="text-center">
          {activeQRCode && qrCodeDataURL ? (
            <>
              <Card className="border-2 border-dashed border-gray-300 mb-6">
                <CardContent className="p-8">
                  <img
                    src={qrCodeDataURL}
                    alt="QR Code"
                    className="w-48 h-48 mx-auto rounded-lg"
                  />
                  <p className="text-sm text-gray-600 mt-4 font-mono">
                    {activeQRCode.code}
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
                    Show this QR code to staff to collect your stamp
                  </p>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="border-2 border-dashed border-gray-300 mb-6">
              <CardContent className="p-8">
                <div className="w-48 h-48 mx-auto rounded-lg bg-gray-100 flex items-center justify-center">
                  <QrCodeIcon className="h-16 w-16 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  No active QR code
                </p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            <Button
              className="w-full bg-[#FF6B35] hover:bg-[#E55A2E] text-white py-3"
              onClick={handleGenerateNew}
              disabled={generateQRMutation.isPending}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${generateQRMutation.isPending ? 'animate-spin' : ''}`} />
              {activeQRCode ? 'Generate New QR' : 'Generate QR Code'}
            </Button>
            <Button
              variant="outline"
              className="w-full py-3"
              onClick={() => setLocation('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
