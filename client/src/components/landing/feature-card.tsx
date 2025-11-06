import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features?: string[];
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  features = [],
}: FeatureCardProps) {
  return (
    <Card className="card-base hover-lift h-full">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="w-14 h-14 rounded-full bg-[#e63946]/20 flex items-center justify-center">
            <Icon className="w-7 h-7 text-[#e63946]" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-text-primary">{title}</h3>
            <p className="text-text-muted leading-relaxed">{description}</p>
          </div>
          {features.length > 0 && (
            <ul className="space-y-2 pt-4 border-t border-line">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-text-muted">
                  <span className="text-[#e63946] mt-1">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

