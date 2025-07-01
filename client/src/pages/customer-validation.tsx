import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, User, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import TabNavigation from "@/components/tab-navigation";

export default function CustomerValidation() {
  const { user, token } = useAuth();
  const [, setLocation] = useLocation();
  const { qrCode } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showRewardCelebration, setShowRewardCelebration] = useState(false);

  const { data: validationData, isLoading, error } = useQuery({
    queryKey: ['/api/qr/validate', qrCode],
    queryFn: async () => {
      const response = await apiRequest('POST', '/api/qr/validate', { 
        code: decodeURIComponent(qrCode || '') 
      });
      return response.json();
    },
    enabled: !!qrCode && !!token,
    retry: false,
  });

  const addStampMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/stamps/add', {
        qrCodeId: validationData.qrCode.id,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setShowSuccess(true);
      if (data.rewardCreated) {
        setShowRewardCelebration(true);
      }
      
      toast({
        title: "Stamp added successfully!",
        description: `Customer now has ${data.customer.newStampCount}/10 stamps`,
      });

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/user/dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stamps/history'] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to add stamp",
        description: error.message || "Please try again.",
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

  useEffect(() => {
    if (error) {
      toast({
        title: "QR Code validation failed",
        description: "This QR code is invalid, expired, or already used.",
        variant: "destructive",
      });
      setTimeout(() => setLocation('/manager/dashboard'), 2000);
    }
  }, [error, toast, setLocation]);

  const handleAddStamp = () => {
    addStampMutation.mutate();
  };

  const handleBackToScanner = () => {
    setLocation('/manager/dashboard');
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
          <Skeleton className="h-40 w-full rounded-2xl mb-6" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </>
    );
  }

  if (error || !validationData) {
    return (
      <>
        <TabNavigation />
        <div className="p-6">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-100 mr-3"
              onClick={handleBackToScanner}
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <h2 className="text-xl font-bold text-[#2C3E50]">Validation Failed</h2>
          </div>
          
          <Card className="border-2 border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <div className="text-red-500 text-4xl mb-4">❌</div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Invalid QR Code</h3>
              <p className="text-red-600 mb-4">
                This QR code is invalid, expired, or has already been used.
              </p>
              <Button
                className="bg-[#2C3E50] hover:bg-gray-700 text-white"
                onClick={handleBackToScanner}
              >
                Back to Scanner
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (showSuccess) {
    return (
      <>
        <TabNavigation />
        <div className="p-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-[#28A745] rounded-full mx-auto mb-6 flex items-center justify-center stamp-bounce">
              <Check className="h-12 w-12 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-[#2C3E50] mb-3">Stamp Added Successfully!</h2>
            
            <Card className="bg-green-50 border-green-200 mb-6">
              <CardContent className="p-4">
                <p className="text-green-800 font-medium">{validationData.customer.name}</p>
                <p className="text-green-700">
                  now has <span className="font-bold">{validationData.customer.currentStamps + 1}</span>/10 stamps
                </p>
              </CardContent>
            </Card>

            {/* Reward Achievement */}
            {showRewardCelebration && (
              <Card className="bg-yellow-50 border-yellow-200 mb-6 reward-celebration">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🏆</div>
                    <h3 className="text-lg font-bold text-yellow-800 mb-1">🎉 Reward Unlocked!</h3>
                    <p className="text-yellow-700">Customer earned a FREE GYOZA!</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-3">
              <Button
                className="w-full bg-[#FF6B35] hover:bg-[#E55A2E] text-white py-3"
                onClick={handleBackToScanner}
              >
                Scan Next Customer
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const { customer, qrCode: qrCodeData } = validationData;

  return (
    <>
      <TabNavigation />
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100 mr-3"
            onClick={handleBackToScanner}
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <h2 className="text-xl font-bold text-[#2C3E50]">Customer Validation</h2>
        </div>

        {/* Customer Info Card */}
        <Card className="border-2 border-green-200 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-[#FF6B35] rounded-full flex items-center justify-center mr-4">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#2C3E50]">{customer.name}</h3>
                <p className="text-gray-600">{customer.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#FF6B35]">{customer.currentStamps}</p>
                <p className="text-sm text-gray-600">Current Stamps</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#28A745]">
                  {customer.currentStamps >= 10 ? Math.floor(customer.currentStamps / 10) : 0}
                </p>
                <p className="text-sm text-gray-600">Total Rewards Earned</p>
              </div>
            </div>

            <Card className="bg-gray-50">
              <CardContent className="p-3">
                <p className="text-sm text-gray-700">
                  QR Code: <span className="font-mono">{qrCodeData.code}</span>
                </p>
                <p className="text-sm text-gray-700">
                  Generated: {new Date(qrCodeData.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            className="w-full bg-[#28A745] hover:bg-green-600 text-white py-4 text-lg"
            onClick={handleAddStamp}
            disabled={addStampMutation.isPending}
          >
            <Plus className="mr-3 h-5 w-5" />
            {addStampMutation.isPending ? "Adding Stamp..." : "Add Stamp (+1)"}
          </Button>
          
          <Button
            variant="outline"
            className="w-full py-3"
            onClick={handleBackToScanner}
            disabled={addStampMutation.isPending}
          >
            Cancel & Scan Another
          </Button>
        </div>
      </div>
    </>
  );
}
