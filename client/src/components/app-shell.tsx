import { ReactNode } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import KintonLogo from "@/components/kinton-logo";

interface AppShellProps {
  children: ReactNode;
  showNav?: boolean;
}

export default function AppShell({ children, showNav = true }: AppShellProps) {
  return (
    <div className="min-h-screen bg-bg">
      {showNav && (
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
                  <Button variant="ghost" className="btn-ghost">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="ghost" className="btn-ghost">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="btn-primary">Get started</Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>
      )}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

