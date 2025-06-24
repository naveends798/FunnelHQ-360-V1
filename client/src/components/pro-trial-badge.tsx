import { Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ProTrialBadgeProps {
  className?: string;
}

export function ProTrialBadge({ className }: ProTrialBadgeProps) {
  const { isAdmin } = useAuth();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const [trialInfo, setTrialInfo] = useState<{
    isProTrial: boolean;
    daysLeft: number;
    isTrialExpired: boolean;
  }>({
    isProTrial: false,
    daysLeft: 0,
    isTrialExpired: false
  });

  useEffect(() => {
    // For development/demo mode, always show trial for admin users
    if (process.env.NODE_ENV === 'development' && isAdmin) {
      setTrialInfo({
        isProTrial: true,
        daysLeft: 12, // Demo: 12 days left
        isTrialExpired: false
      });
      return;
    }

    // For production with real organization data
    if (organization && orgLoaded) {
      const plan = organization.publicMetadata?.plan as string;
      const trialEndsAt = organization.publicMetadata?.trialEndsAt as string;
      
      const isProTrial = plan === 'pro_trial';
      const trialEndDate = trialEndsAt ? new Date(trialEndsAt) : null;
      const now = new Date();
      
      const isTrialExpired = isProTrial && trialEndDate ? trialEndDate < now : false;
      const daysLeft = trialEndDate ? Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;

      setTrialInfo({
        isProTrial,
        daysLeft: Math.max(0, daysLeft),
        isTrialExpired
      });
    }
  }, [organization, orgLoaded, isAdmin]);

  // Only show for admin users who are on pro trial
  if (!isAdmin || !trialInfo.isProTrial) {
    return null;
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Compact Pro Trial Badge */}
      <Badge className="w-full justify-center py-1 px-2 text-xs font-medium bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white border-none">
        <Crown className="w-3 h-3 mr-1" />
        Pro Trial
      </Badge>

      {/* Compact Trial Status */}
      <div className="bg-card/30 border border-border/30 rounded-md p-2 space-y-2">
        {/* Trial Period Info - More compact */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Trial
          </span>
          <span className="text-xs font-semibold text-foreground">
            {trialInfo.isTrialExpired ? "Expired" : `${trialInfo.daysLeft}d left`}
          </span>
        </div>

        {/* Compact Subscribe Button */}
        <Link href="/billing">
          <Button 
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-none font-medium text-xs py-1 h-6"
            size="sm"
          >
            Upgrade
          </Button>
        </Link>
      </div>
    </div>
  );
}