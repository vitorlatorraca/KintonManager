import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import HeroTitle from "@/components/hero-title";
import OverviewCard from "@/components/overview-card";
import Pill from "@/components/pill";
import { Hash, Gift, Cloud, BarChart3, Lock } from "lucide-react";

export default function LandingHero() {
  return (
    <section className="py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-6">
              <HeroTitle className="text-5xl lg:text-6xl">
                Take control of your loyalty system.
              </HeroTitle>
              <p className="text-xl text-text-muted max-w-2xl leading-relaxed">
                Digitalize your Kinton Ramen stamp card with Kinton Manager — an all-in-one loyalty platform for restaurants.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button className="btn-primary bg-[#e63946] hover:bg-[#d62839] text-white px-8 py-6 text-lg">
                  Try Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Features Card */}
          <div className="lg:col-span-5">
            <OverviewCard title="Key Features">
              {/* Feature List */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e63946]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Hash className="w-5 h-5 text-[#e63946]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">Customer Code System</h4>
                    <p className="text-sm text-text-muted">
                      Generate unique 6-digit codes for customers to collect stamps digitally.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#facc15]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Gift className="w-5 h-5 text-[#facc15]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">Reward Tracking</h4>
                    <p className="text-sm text-text-muted">
                      Automated stamp collection and reward redemption system.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#7c3aed]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BarChart3 className="w-5 h-5 text-[#7c3aed]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">Manager Dashboard</h4>
                    <p className="text-sm text-text-muted">
                      Complete admin panel for staff to validate codes and manage rewards.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#22c55e]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Lock className="w-5 h-5 text-[#22c55e]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-primary mb-1">Secure & Reliable</h4>
                    <p className="text-sm text-text-muted">
                      Bank-grade security with encrypted transactions and audit trails.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pills */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-line">
                <Pill icon={<Hash className="w-3 h-3" />}>
                  Code system
                </Pill>
                <Pill icon={<Cloud className="w-3 h-3" />}>
                  Cloud sync
                </Pill>
                <Pill icon={<BarChart3 className="w-3 h-3" />}>
                  Admin dashboard
                </Pill>
                <Pill icon={<Lock className="w-3 h-3" />}>
                  Secure login
                </Pill>
              </div>
            </OverviewCard>
          </div>
        </div>
      </div>
    </section>
  );
}

