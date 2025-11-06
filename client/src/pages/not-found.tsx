import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import AppShell from "@/components/app-shell";

export default function NotFound() {
  return (
    <AppShell>
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="card-base w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-danger" />
            <h1 className="text-3xl font-bold text-text-primary mb-2">404 Page Not Found</h1>
            <p className="text-text-muted mb-6">
              The page you're looking for doesn't exist.
            </p>
            <Link href="/dashboard">
              <Button className="btn-primary">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
