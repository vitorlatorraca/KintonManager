import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, ExternalLink } from "lucide-react";
import KintonLogo from "@/components/kinton-logo";

export default function LandingNavbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover-lift">
              <KintonLogo variant="icon" size="sm" />
              <span className="text-lg font-bold text-text-primary">
                Kinton Manager
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="btn-ghost text-sm">
                Client View
              </Button>
            </Link>
            <Link href="/manager/dashboard">
              <Button variant="ghost" className="btn-ghost text-sm">
                Manager View
              </Button>
            </Link>
            <a
              href="https://github.com/vitorlatorraca/KintonManager"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" className="btn-ghost text-sm">
                GitHub
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </a>
            <a
              href="https://linkedin.com/in/vitorlatorraca"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" className="btn-ghost text-sm">
                LinkedIn
                <ExternalLink className="ml-2 h-3 w-3" />
              </Button>
            </a>
            <Link href="/login">
              <Button className="btn-primary bg-[#e63946] hover:bg-[#d62839] text-white">
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

