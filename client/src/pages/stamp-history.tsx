import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Stamp, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import TabNavigation from "@/components/tab-navigation";

export default function StampHistory() {
  const { user, token } = useAuth();
  const [, setLocation] = useLocation();

  const { data: stamps, isLoading } = useQuery({
    queryKey: ['/api/stamps/history'],
    queryFn: async () => {
      const response = await fetch('/api/stamps/history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch stamp history');
      }
      return response.json();
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (!user || !token || user.userType !== 'CUSTOMER') {
      setLocation('/');
    }
  }, [user, token, setLocation]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'REDEEMED':
        return 'bg-gray-100 text-gray-800';
      case 'EXPIRED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </>
    );
  }

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
          <h2 className="text-xl font-bold text-[#2C3E50]">Stamp History</h2>
        </div>

        {stamps && stamps.length > 0 ? (
          <div className="space-y-4">
            {stamps.map((stamp: any, index: number) => (
              <Card key={stamp.id} className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        stamp.status === 'REDEEMED' ? 'bg-gray-400' : 'bg-[#28A745]'
                      }`}>
                        {stamp.status === 'REDEEMED' ? (
                          <Gift className="h-5 w-5 text-white" />
                        ) : (
                          <Stamp className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-[#2C3E50]">
                          {stamp.status === 'REDEEMED' ? 'Used for Reward' : `Stamp #${stamps.length - index}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(stamp.createdAt)}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(stamp.status)}>
                      {stamp.status.toLowerCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="p-8 text-center">
              <Stamp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No stamps yet</h3>
              <p className="text-gray-600 mb-4">
                Start collecting stamps by generating QR codes and showing them to staff!
              </p>
              <Button
                className="bg-[#FF6B35] hover:bg-[#E55A2E] text-white"
                onClick={() => setLocation('/qr-code')}
              >
                Generate Your First QR
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
