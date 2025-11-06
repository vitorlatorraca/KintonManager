import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface CTAButtonsProps {
  primaryLabel: string;
  primaryOnClick?: () => void;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryOnClick?: () => void;
  secondaryHref?: string;
  className?: string;
}

export default function CTAButtons({
  primaryLabel,
  primaryOnClick,
  primaryHref,
  secondaryLabel,
  secondaryOnClick,
  secondaryHref,
  className = "",
}: CTAButtonsProps) {
  const PrimaryButton = primaryHref ? (
    <Link href={primaryHref}>
      <Button className="btn-primary">{primaryLabel}</Button>
    </Link>
  ) : (
    <Button onClick={primaryOnClick} className="btn-primary">
      {primaryLabel}
    </Button>
  );

  const SecondaryButton = secondaryLabel ? (
    secondaryHref ? (
      <Link href={secondaryHref}>
        <Button variant="ghost" className="btn-ghost">
          {secondaryLabel}
        </Button>
      </Link>
    ) : (
      <Button onClick={secondaryOnClick} variant="ghost" className="btn-ghost">
        {secondaryLabel}
      </Button>
    )
  ) : null;

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {PrimaryButton}
      {SecondaryButton}
    </div>
  );
}

