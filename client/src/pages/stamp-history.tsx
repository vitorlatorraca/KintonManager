import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Stamp, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import AppShell from "@/components/app-shell";
import HeroTitle from "@/components/hero-title";

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
        return 'bg-success/20 text-success border-success/30';
      case 'REDEEMED':
        return 'bg-text-muted/20 text-text-muted border-border';
      case 'EXPIRED':
        return 'bg-danger/20 text-danger border-danger/30';
      default:
        return 'bg-text-muted/20 text-text-muted border-border';
    }
  };

  if (isLoading) {
    return (
      <AppShell showNav={false}>
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-12 w-full" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell showNav={false}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="btn-ghost rounded-full"
            onClick={() => setLocation('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <HeroTitle className="text-3xl">Stamp History</HeroTitle>
        </div>

        {stamps && stamps.length > 0 ? (
          <div className="space-y-3">
            {stamps.map((stamp: any, index: number) => (
              <Card key={stamp.id} className="card-base hover-lift">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        stamp.status === 'REDEEMED' ? 'bg-text-muted/20' : 'bg-success/20'
                      }`}>
                        {stamp.status === 'REDEEMED' ? (
                          <Gift className="h-6 w-6 text-success" />
                        ) : (
                          <Stamp className="h-6 w-6 text-success" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">
                          {stamp.status === 'REDEEMED' ? 'Used for Reward' : `Stamp #${stamps.length - index}`}
                        </p>
                        <p className="text-sm text-text-muted">
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
          <Card className="card-base border-dashed">
            <CardContent className="p-12 text-center">
              <Stamp className="h-16 w-16 mx-auto mb-4 text-text-muted" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">No stamps yet</h3>
              <p className="text-text-muted mb-6">
                Start collecting stamps by generating QR codes and showing them to staff!
              </p>
              <Button
                className="btn-primary"
                onClick={() => setLocation('/qr-code')}
              >
                Generate Your First QR
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
