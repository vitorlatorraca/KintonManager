import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, BarChart3, Shield, QrCode, Users, Award, Lock } from "lucide-react";
import LandingNavbar from "@/components/landing/navbar";
import LandingHero from "@/components/landing/hero";
import FeatureCard from "@/components/landing/feature-card";
import LandingFooter from "@/components/landing/footer";
import ThemedChart from "@/components/themed-chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockData = [
  { name: "Mon", stamps: 45, rewards: 12 },
  { name: "Tue", stamps: 52, rewards: 15 },
  { name: "Wed", stamps: 38, rewards: 10 },
  { name: "Thu", stamps: 61, rewards: 18 },
  { name: "Fri", stamps: 78, rewards: 22 },
  { name: "Sat", stamps: 95, rewards: 28 },
  { name: "Sun", stamps: 88, rewards: 25 },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      <LandingNavbar />
      
      <main>
        {/* Hero Section */}
        <LandingHero />

        {/* Story Section */}
        <section className="py-20 bg-card/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-6 mb-16">
              <h2 className="text-4xl font-extrabold tracking-[-0.02em] text-text-primary">
                Built for the digital era
              </h2>
              <p className="text-xl text-text-muted leading-relaxed">
                Kinton Manager was built to bring the Kinton Ramen loyalty program into the digital era. 
                No more paper cards — just scan, collect, and enjoy your free ramen.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Smartphone}
                title="Client Experience"
                description="Seamless mobile experience for customers to collect stamps and redeem rewards. Simple, fast, and intuitive."
                features={[
                  "QR code generation",
                  "Real-time stamp tracking",
                  "Reward notifications",
                  "Transaction history"
                ]}
              />
              <FeatureCard
                icon={BarChart3}
                title="Manager Dashboard"
                description="Comprehensive analytics and management tools for restaurant staff. Monitor activity, validate codes, and track rewards."
                features={[
                  "Real-time analytics",
                  "Code validation",
                  "Reward management",
                  "Customer insights"
                ]}
              />
              <FeatureCard
                icon={Shield}
                title="Analytics & Security"
                description="Bank-grade security with comprehensive audit trails. Track every transaction and ensure data integrity."
                features={[
                  "Secure authentication",
                  "Transaction logs",
                  "Data encryption",
                  "Compliance ready"
                ]}
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left - Chart */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h2 className="text-4xl font-extrabold tracking-[-0.02em] text-text-primary">
                    Real-time insights
                  </h2>
                  <p className="text-lg text-text-muted">
                    Track daily activity with comprehensive analytics and visualizations.
                  </p>
                </div>
                <div className="card-base p-6">
                  <ThemedChart>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={mockData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1b2531" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#9AA7B2"
                          style={{ fontSize: '12px' }}
                        />
                        <YAxis 
                          stroke="#9AA7B2"
                          style={{ fontSize: '12px' }}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: '#0f141a',
                            border: '1px solid #1e2936',
                            borderRadius: '8px',
                            color: '#e6edf3'
                          }}
                        />
                        <Bar dataKey="stamps" fill="#e63946" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="rewards" fill="#facc15" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ThemedChart>
                </div>
              </div>

              {/* Right - Features */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#e63946]/20 flex items-center justify-center flex-shrink-0">
                      <QrCode className="w-6 h-6 text-[#e63946]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text-primary mb-2">
                        QR Code Integration
                      </h3>
                      <p className="text-text-muted">
                        Generate unique QR codes for each customer. Fast, secure, and easy to validate at the point of sale.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#facc15]/20 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-[#facc15]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text-primary mb-2">
                        Customer Management
                      </h3>
                      <p className="text-text-muted">
                        Track customer activity, stamp collections, and reward redemptions in real-time.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#22c55e]/20 flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-[#22c55e]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text-primary mb-2">
                        Reward System
                      </h3>
                      <p className="text-text-muted">
                        Automated reward tracking. Customers earn stamps and redeem rewards seamlessly.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#7c3aed]/20 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-6 h-6 text-[#7c3aed]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-text-primary mb-2">
                        Secure & Reliable
                      </h3>
                      <p className="text-text-muted">
                        Bank-grade security with encrypted transactions and comprehensive audit trails.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-card/30">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-extrabold tracking-[-0.02em] text-text-primary">
                Ready to get started?
              </h2>
              <p className="text-xl text-text-muted">
                Experience Kinton Manager today. Try the demo or explore the codebase.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button className="btn-primary bg-[#e63946] hover:bg-[#d62839] text-white px-8 py-6 text-lg">
                  Try Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a
                href="https://github.com/vitorlatorraca/KintonManager"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="btn-secondary px-8 py-6 text-lg">
                  View on GitHub
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}

