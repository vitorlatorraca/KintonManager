import { useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Edit3, Lock, History, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import TabNavigation from "@/components/tab-navigation";

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
          <h2 className="text-xl font-bold text-[#2C3E50]">Profile</h2>
        </div>

        <div className="space-y-6">
          {/* User Info */}
          <div className="text-center">
            <div className="w-20 h-20 bg-[#FF6B35] rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-[#2C3E50]">{user.name || 'Customer'}</h3>
            <p className="text-gray-600">{user.phone}</p>
          </div>

          {/* Menu Options */}
          <div className="space-y-3">
            <Card className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Edit3 className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-[#2C3E50]">Edit Profile</span>
                  </div>
                  <div className="text-gray-400">→</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Lock className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-[#2C3E50]">Change Password</span>
                  </div>
                  <div className="text-gray-400">→</div>
                </div>
              </CardContent>
            </Card>

            <Card 
              className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setLocation('/history')}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <History className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-[#2C3E50]">Stamp History</span>
                  </div>
                  <div className="text-gray-400">→</div>
                </div>
              </CardContent>
            </Card>

            <Button
              variant="destructive"
              className="w-full bg-red-500 hover:bg-red-600 text-white py-4"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
