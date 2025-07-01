import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User, QrCode, History, Settings, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import StampProgress from "@/components/stamp-progress";
import TabNavigation from "@/components/tab-navigation";

export default function CustomerDashboard() {
  const { user, token, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: dashboardData, isLoading, error } = useQuery({
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

  useEffect(() => {
    if (!user || !token) {
      setLocation('/');
      return;
    }

    if (user.userType !== 'CUSTOMER') {
      setLocation('/manager');
      return;
    }
  }, [user, token, setLocation]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading dashboard",
        description: "Please try refreshing the page",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isLoading || !dashboardData) {
    return (
      <>
        <TabNavigation />
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      </>
    );
  }

  const { stamps, rewards } = dashboardData;

  return (
    <>
      <TabNavigation />
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#2C3E50]">
              Welcome, {user?.name || 'Customer'}!
            </h2>
            <p className="text-gray-600">Your stamp collection</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-gray-100 hover:bg-gray-200"
            onClick={() => setLocation('/profile')}
          >
            <User className="h-5 w-5 text-gray-600" />
          </Button>
        </div>

        {/* Stamp Progress Card */}
        <Card className="bg-gradient-to-r from-[#FF6B35] to-orange-500 text-white mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Stamp Progress</h3>
                <p className="text-orange-100">Collect 10 stamps for free gyoza!</p>
              </div>
              <StampProgress current={stamps.current} total={stamps.required} />
            </div>
          </CardContent>
        </Card>

        {/* Available Rewards */}
        {rewards && rewards.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-[#2C3E50] mb-3">Available Rewards</h3>
            <div className="space-y-3">
              {rewards.map((reward: any) => (
                <Card key={reward.id} className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-[#28A745] rounded-full flex items-center justify-center mr-3">
                          <Gift className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-[#2C3E50]">
                            {reward.type === 'GYOZA_FREE' ? 'Free Gyoza' : reward.type}
                          </h4>
                          <p className="text-sm text-gray-600">Ready to redeem!</p>
                        </div>
                      </div>
                      <Button
                        className="bg-[#28A745] hover:bg-green-600 text-white"
                        onClick={() => {
                          // Handle reward redemption
                          toast({
                            title: "Reward redeemed!",
                            description: "Show this to staff to claim your free gyoza.",
                          });
                        }}
                      >
                        Redeem
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            className="w-full bg-[#FF6B35] hover:bg-[#E55A2E] text-white py-4 text-lg"
            onClick={() => setLocation('/qr-code')}
          >
            <QrCode className="mr-3 h-5 w-5" />
            Generate QR Code
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="py-3"
              onClick={() => setLocation('/history')}
            >
              <History className="mr-2 h-4 w-4" />
              History
            </Button>
            <Button
              variant="outline"
              className="py-3"
              onClick={() => setLocation('/profile')}
            >
              <Settings className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
