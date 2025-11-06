import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import HeroTitle from "@/components/hero-title";
import OverviewCard from "@/components/overview-card";
import MetricCard from "@/components/metric-card";
import BudgetBar from "@/components/budget-bar";
import Pill from "@/components/pill";
import { QrCode, Users, Gift, TrendingUp, Shield, Cloud, BarChart3, Lock } from "lucide-react";

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
                  Client Portal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/manager">
                <Button variant="outline" className="btn-secondary px-8 py-6 text-lg">
                  Manager Portal
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column - Overview Card */}
          <div className="lg:col-span-5">
            <OverviewCard title="At-a-glance overview">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 gap-4">
                <MetricCard
                  title="Active Customers"
                  value="1,247"
                  hint="+12% this month"
                  icon={<Users className="w-5 h-5" />}
                />
                <MetricCard
                  title="Redeemed Rewards"
                  value="342"
                  hint="+8% this month"
                  icon={<Gift className="w-5 h-5" />}
                />
                <MetricCard
                  title="Pending Stamps"
                  value="892"
                  hint="Ready to redeem"
                  icon={<TrendingUp className="w-5 h-5" />}
                />
              </div>

              {/* Budget Bars */}
              <div className="space-y-4 pt-4 border-t border-line">
                <h4 className="text-sm font-semibold text-text-primary">
                  Platform Usage
                </h4>
                <BudgetBar
                  label="QR Usage"
                  value={72}
                  pct={72}
                  color="#e63946"
                />
                <BudgetBar
                  label="Reward Claims"
                  value={55}
                  pct={55}
                  color="#facc15"
                />
                <BudgetBar
                  label="Active Sessions"
                  value={88}
                  pct={88}
                  color="#22c55e"
                />
              </div>

              {/* Pills */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-line">
                <Pill icon={<QrCode className="w-3 h-3" />}>
                  QR integration
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

