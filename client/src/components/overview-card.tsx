import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OverviewCardProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export default function OverviewCard({
  title,
  children,
  actions,
  className = "",
}: OverviewCardProps) {
  return (
    <Card className={`card-base ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-text-primary">
            {title}
          </CardTitle>
          {actions && <div>{actions}</div>}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">{children}</CardContent>
    </Card>
  );
}

