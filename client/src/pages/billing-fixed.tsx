import { useState, useEffect } from "react";
import { 
  CreditCard, 
  TrendingUp, 
  Users, 
  HardDrive, 
  Check, 
  ArrowRight,
  AlertTriangle,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tab } from "@/components/ui/pricing-tab";
import { PricingCards, type PricingTier } from "@/components/ui/pricing-cards";
import { BILLING_PLANS, type OrganizationWithBilling, type BillingPlan } from "@shared/schema";
import Sidebar from "@/components/sidebar";

export default function BillingFixedPage() {
  const [billingData, setBillingData] = useState<OrganizationWithBilling | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<BillingPlan | null>(null);
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");

  // Mock organization ID - in real app, get from auth context
  const organizationId = 1;

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      const response = await fetch(`/api/billing/${organizationId}`);
      if (response.ok) {
        const data = await response.json();
        setBillingData(data);
      }
    } catch (error) {
      console.error("Failed to fetch billing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (plan: BillingPlan) => {
    setUpgrading(plan);
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId,
          plan,
          successUrl: window.location.origin + "/billing?success=true",
          cancelUrl: window.location.origin + "/billing?canceled=true"
        })
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
    } finally {
      setUpgrading(null);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg relative overflow-hidden">
        <Sidebar />
        <main className="lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!billingData) {
    return (
      <div className="min-h-screen gradient-bg relative overflow-hidden">
        <Sidebar />
        <main className="lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
          <div className="text-center py-12">
            <p className="text-white">Failed to load billing information</p>
          </div>
        </main>
      </div>
    );
  }

  const currentPlan = billingData.currentPlan;
  const usage = billingData.usage;

  return (
    <div className="min-h-screen gradient-bg relative overflow-hidden">
      <Sidebar />
      <main className="lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Billing & Usage
              </h1>
              <p className="text-slate-400 mt-2">
                Manage your subscription and monitor usage across your organization
              </p>
            </div>
            {billingData.stripeCustomerId && (
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Manage Billing
              </Button>
            )}
          </div>

          {/* Current Plan */}
          <Card className="glass border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2 text-white">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Current Plan: {currentPlan.name}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    ${currentPlan.price}/{currentPlan.interval}
                  </CardDescription>
                </div>
                <Badge 
                  variant={billingData.subscriptionStatus === 'active' ? 'default' : 'destructive'}
                  className="text-sm"
                >
                  {billingData.subscriptionStatus || 'Active'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Projects Usage */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-1 text-white">
                      <TrendingUp className="h-4 w-4" />
                      Projects
                    </span>
                    <span className="text-sm text-slate-400">
                      {usage.projects} / {currentPlan.limits.projects === -1 ? '∞' : currentPlan.limits.projects}
                    </span>
                  </div>
                  {currentPlan.limits.projects !== -1 && (
                    <Progress 
                      value={(usage.projects / currentPlan.limits.projects) * 100}
                      className="h-2"
                    />
                  )}
                </div>

                {/* Team Members Usage */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-1 text-white">
                      <Users className="h-4 w-4" />
                      Team Members
                    </span>
                    <span className="text-sm text-slate-400">
                      {usage.teamMembers} / {currentPlan.limits.teamMembers === -1 ? '∞' : currentPlan.limits.teamMembers}
                    </span>
                  </div>
                  {currentPlan.limits.teamMembers !== -1 && (
                    <Progress 
                      value={(usage.teamMembers / currentPlan.limits.teamMembers) * 100}
                      className="h-2"
                    />
                  )}
                </div>

                {/* Storage Usage */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-1 text-white">
                      <HardDrive className="h-4 w-4" />
                      Storage
                    </span>
                    <span className="text-sm text-slate-400">
                      {formatBytes(usage.storage)} / {currentPlan.limits.storage === -1 ? '∞' : formatBytes(currentPlan.limits.storage)}
                    </span>
                  </div>
                  {currentPlan.limits.storage !== -1 && (
                    <Progress 
                      value={(usage.storage / currentPlan.limits.storage) * 100}
                      className="h-2"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Plans */}
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Choose Your Plan</h2>
              <p className="text-slate-400 mb-6">Select the perfect plan for your needs</p>
              
              {/* Billing Interval Toggle */}
              <div className="flex w-fit rounded-full bg-white/10 p-1 mx-auto">
                <Tab
                  text="monthly"
                  selected={billingInterval === "monthly"}
                  setSelected={(text) => setBillingInterval(text as "monthly" | "yearly")}
                />
                <Tab
                  text="yearly"
                  selected={billingInterval === "yearly"}
                  setSelected={(text) => setBillingInterval(text as "monthly" | "yearly")}
                  discount={true}
                />
              </div>
            </div>
            
            <PricingCards 
              tiers={Object.entries(BILLING_PLANS).map(([planKey, plan]) => {
                const isCurrentPlan = planKey === (billingData.subscriptionPlan || 'solo');
                const currentPrice = billingInterval === 'yearly' ? plan.yearlyPrice : plan.price;
                const interval = billingInterval === 'yearly' ? '/year' : '/month';
                
                // Calculate savings for yearly plan
                const monthlyCost = plan.price * 12;
                const yearlyCost = plan.yearlyPrice * 12;
                const savings = monthlyCost - yearlyCost;
                const savingsText = billingInterval === 'yearly' ? ` (Save $${savings}/year)` : '';
                
                return {
                  name: plan.name,
                  price: currentPrice,
                  interval: interval,
                  description: `Perfect for ${plan.name.toLowerCase()} users${savingsText}`,
                  highlight: isCurrentPlan,
                  features: plan.features.map(feature => ({
                    name: feature,
                    included: true
                  })),
                  cta: {
                    text: isCurrentPlan ? `Current ${plan.name} Plan` : "Let's Scale",
                    onClick: isCurrentPlan ? undefined : () => handleUpgrade(planKey as BillingPlan)
                  }
                } as PricingTier;
              })}
              containerClassName="px-0"
              className="gap-6"
            />
          </div>
        </div>
      </main>
    </div>
  );
}