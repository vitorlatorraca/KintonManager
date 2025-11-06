import { useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Edit3, Lock, History, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import AppShell from "@/components/app-shell";
import HeroTitle from "@/components/hero-title";

export default function Profile() {
  const { user, token, logout } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user || !token || user.userType !== 'CUSTOMER') {
      setLocation('/');
    }
  }, [user, token, setLocation]);

  const handleLogout = () => {
    logout();
  };

  if (!user) return null;

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
          <HeroTitle className="text-3xl">Profile</HeroTitle>
        </div>

        <div className="space-y-6">
          {/* User Info */}
          <Card className="card-base">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">{user.name || 'Customer'}</h3>
              <p className="text-text-muted">{user.phone}</p>
            </CardContent>
          </Card>

          {/* Menu Options */}
          <div className="space-y-3">
            <Card className="card-base hover-lift cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Edit3 className="h-5 w-5 text-text-muted" />
                    <span className="font-medium text-text-primary">Edit Profile</span>
                  </div>
                  <div className="text-text-muted">→</div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-base hover-lift cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-text-muted" />
                    <span className="font-medium text-text-primary">Change Password</span>
                  </div>
                  <div className="text-text-muted">→</div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="card-base hover-lift cursor-pointer"
              onClick={() => setLocation('/history')}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <History className="h-5 w-5 text-text-muted" />
                    <span className="font-medium text-text-primary">Stamp History</span>
                  </div>
                  <div className="text-text-muted">→</div>
                </div>
              </CardContent>
            </Card>

            <Button
              variant="destructive"
              className="w-full btn-primary bg-danger hover:bg-danger/90 py-4"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
