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
import KintonLogo from "@/components/kinton-logo";

export default function CustomerDashboard() {
  const { user, token, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const {
    data: dashboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/user/dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/user/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }
      return response.json();
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (!user || !token) {
      setLocation("/");
      return;
    }

    if (user.userType !== "CUSTOMER") {
      setLocation("/manager");
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
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold kinton-yellow kinton-text-shadow">
              HELLO, {user?.name?.toUpperCase() || "CUSTOMER"}!
            </h2>
            <p className="text-[#FFD700]/80 font-medium">
              Your stamp collection
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="kinton-button rounded-full"
            onClick={() => setLocation("/profile")}
          >
            <User className="h-5 w-5" />
          </Button>
        </div>

        {/* Stamp Progress Card */}
        <Card className="kinton-card">
          <CardContent className="p-6">
            <StampProgress current={stamps.current} total={stamps.required} />
          </CardContent>
        </Card>

        {/* Available Rewards */}
        {rewards && rewards.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold kinton-yellow kinton-text-shadow uppercase tracking-wide">
              AVAILABLE REWARDS
            </h3>
            <div className="space-y-4">
              {rewards.map((reward: any) => (
                <Card
                  key={reward.id}
                  className="kinton-card border-2 border-[#FFD700]/50"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-16 h-16 kinton-stamp mr-4 text-2xl">
                          🥟
                        </div>
                        <div>
                          <h4 className="font-bold kinton-yellow text-lg uppercase tracking-wide">
                            {reward.type === "GYOZA_FREE"
                              ? "FREE GYOZA"
                              : reward.type}
                          </h4>
                          <p className="text-[#FFD700]/80 font-medium">
                            Ready to redeem!
                          </p>
                        </div>
                      </div>
                      <Button
                        className="kinton-button text-lg px-6 py-3"
                        onClick={() => {
                          toast({
                            title: "Reward redeemed!",
                            description:
                              "Show this to staff to receive your free gyoza.",
                          });
                        }}
                      >
                        REDEEM
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            className="w-full kinton-button py-6 text-xl"
            onClick={() => setLocation("/qr-code")}
          >
            <QrCode className="mr-3 h-6 w-6" />
            GENERATE QR CODE
          </Button>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="kinton-tab py-4 text-base"
              onClick={() => setLocation("/history")}
            >
              <History className="mr-2 h-5 w-5" />
              HISTORY
            </Button>
            <Button
              variant="outline"
              className="kinton-tab py-4 text-base"
              onClick={() => setLocation("/profile")}
            >
              <Settings className="mr-2 h-5 w-5" />
              PROFILE
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
