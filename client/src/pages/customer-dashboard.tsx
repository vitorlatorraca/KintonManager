import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User, QrCode, History, Settings, Gift, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import AppShell from "@/components/app-shell";
import HeroTitle from "@/components/hero-title";
import MetricCard from "@/components/metric-card";
import BudgetBar from "@/components/budget-bar";
import OverviewCard from "@/components/overview-card";
import Pill from "@/components/pill";
import CTAButtons from "@/components/cta-buttons";
import StampProgress from "@/components/stamp-progress";

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
      <AppShell showNav={false}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
            <div className="lg:col-span-5">
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  const { stamps, rewards } = dashboardData;
  const stampsProgress = Math.round((stamps.current / stamps.required) * 100);
  const stampsRemaining = stamps.required - stamps.current;

  return (
    <AppShell showNav={false}>
      <div className="space-y-8">
        {/* Hero Section with Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Hero */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <HeroTitle>
                Hello, {user?.name || "Customer"}
              </HeroTitle>
              <p className="text-base text-text-muted max-w-2xl">
                Track your stamp collection and redeem rewards at Kinton Ramen.
                Collect {stamps.required} stamps to earn a free gyoza!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <CTAButtons
                primaryLabel="Generate QR Code"
                primaryOnClick={() => setLocation("/qr-code")}
                secondaryLabel="View History"
                secondaryOnClick={() => setLocation("/history")}
              />
            </div>

            {/* Stamp Progress Card */}
            <Card className="card-base">
              <CardContent className="p-6">
                <StampProgress current={stamps.current} total={stamps.required} />
              </CardContent>
            </Card>

            {/* Available Rewards */}
            {rewards && rewards.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-text-primary">
                  Available Rewards
                </h3>
                <div className="space-y-3">
                  {rewards.map((reward: any) => (
                    <Card key={reward.id} className="card-base hover-lift">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                              <Gift className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                              <h4 className="font-bold text-text-primary">
                                {reward.type === "GYOZA_FREE"
                                  ? "Free Gyoza"
                                  : reward.type}
                              </h4>
                              <p className="text-sm text-text-muted">
                                Ready to redeem
                              </p>
                            </div>
                          </div>
                          <Button
                            className="btn-primary"
                            onClick={() => {
                              toast({
                                title: "Reward redeemed!",
                                description:
                                  "Show this to staff to receive your free gyoza.",
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
          </div>

          {/* Right Column - Overview */}
          <div className="lg:col-span-5">
            <OverviewCard title="At-a-glance overview">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                <MetricCard
                  title="Current Stamps"
                  value={stamps.current}
                  hint={`${stampsRemaining} to go`}
                  icon={<TrendingUp className="w-5 h-5" />}
                />
                <MetricCard
                  title="Progress"
                  value={`${stampsProgress}%`}
                  hint="Complete collection"
                  icon={<Award className="w-5 h-5" />}
                />
                <MetricCard
                  title="Available Rewards"
                  value={rewards?.length || 0}
                  hint="Ready to redeem"
                  icon={<Gift className="w-5 h-5" />}
                />
              </div>

              {/* Budget Bars */}
              <div className="space-y-4 pt-4 border-t border-line">
                <h4 className="text-sm font-semibold text-text-primary">
                  Collection Progress
                </h4>
                <BudgetBar
                  label="Stamps Collected"
                  value={stamps.current}
                  pct={stampsProgress}
                  color="#7c3aed"
                />
                <BudgetBar
                  label="Stamps Remaining"
                  value={stampsRemaining}
                  pct={100 - stampsProgress}
                  color="#1e2936"
                />
              </div>

              {/* Pills */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-line">
                <Pill icon={<Award className="w-3 h-3" />}>
                  Bank-grade security
                </Pill>
                <Pill icon={<Gift className="w-3 h-3" />}>
                  Smart rewards
                </Pill>
                <Pill icon={<QrCode className="w-3 h-3" />}>
                  QR code ready
                </Pill>
                <Pill icon={<History className="w-3 h-3" />}>
                  Full history
                </Pill>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-line space-y-3">
                <Button
                  variant="ghost"
                  className="w-full btn-ghost"
                  onClick={() => setLocation("/profile")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  View Profile
                </Button>
              </div>
            </OverviewCard>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
