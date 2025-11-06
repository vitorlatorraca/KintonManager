import { Link } from "wouter";
import { ExternalLink } from "lucide-react";
import KintonLogo from "@/components/kinton-logo";

export default function LandingFooter() {
  return (
    <footer className="border-t border-line bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <KintonLogo variant="icon" size="sm" />
              <span className="text-lg font-bold text-text-primary">
                Kinton Manager
              </span>
            </div>
            <p className="text-sm text-text-muted max-w-md">
              Digital loyalty platform for Kinton Ramen. Collect stamps, earn rewards, and enjoy free gyoza.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-text-primary">Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard">
                  <span className="text-sm text-text-muted hover:text-text-primary transition-colors cursor-pointer">
                    Client Portal
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/manager/dashboard">
                  <span className="text-sm text-text-muted hover:text-text-primary transition-colors cursor-pointer">
                    Manager Portal
                  </span>
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/vitorlatorraca/KintonManager"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-muted hover:text-text-primary transition-colors flex items-center gap-1"
                >
                  GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-text-primary">Legal</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-text-muted hover:text-text-primary transition-colors cursor-pointer">
                  Privacy
                </span>
              </li>
              <li>
                <span className="text-sm text-text-muted hover:text-text-primary transition-colors cursor-pointer">
                  Terms
                </span>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/vitorlatorraca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-muted hover:text-text-primary transition-colors flex items-center gap-1"
                >
                  Contact
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-line flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-dim">
            © 2024 Kinton Manager. Built with ❤️ for Kinton Ramen.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/vitorlatorraca/KintonManager"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-dim hover:text-text-primary transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/vitorlatorraca"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-text-dim hover:text-text-primary transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

