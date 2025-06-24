import { useOrganization } from '@clerk/clerk-react';
import { useToast } from './use-toast';

type PlanType = 'pro_trial' | 'solo' | 'pro';

interface PlanFeatures {
  maxProjects: number;
  maxStorage: number; // in bytes
  maxTeamMembers: number;
  canInviteMembers: boolean;
  canUseAdvancedFeatures: boolean;
  canExportData: boolean;
  hasSupport: boolean;
  supportLevel: 'standard' | 'priority';
}

const PLAN_FEATURES: Record<PlanType, PlanFeatures> = {
  pro_trial: {
    maxProjects: -1, // unlimited
    maxStorage: 107374182400, // 100GB
    maxTeamMembers: -1, // unlimited
    canInviteMembers: true,
    canUseAdvancedFeatures: true,
    canExportData: true,
    hasSupport: true,
    supportLevel: 'priority'
  },
  solo: {
    maxProjects: 3,
    maxStorage: 5368709120, // 5GB
    maxTeamMembers: 0,
    canInviteMembers: false,
    canUseAdvancedFeatures: false,
    canExportData: true,
    hasSupport: true,
    supportLevel: 'standard'
  },
  pro: {
    maxProjects: -1, // unlimited
    maxStorage: 107374182400, // 100GB
    maxTeamMembers: -1, // unlimited
    canInviteMembers: true,
    canUseAdvancedFeatures: true,
    canExportData: true,
    hasSupport: true,
    supportLevel: 'priority'
  }
};

export function usePlanFeatures() {
  const { organization } = useOrganization();
  const { toast } = useToast();

  // Get current plan from organization metadata
  const currentPlan = (organization?.publicMetadata?.plan as PlanType) || 'pro_trial';
  const trialEndsAt = organization?.publicMetadata?.trialEndsAt as string | undefined;
  
  // Check if trial has expired
  const isTrialExpired = trialEndsAt ? new Date(trialEndsAt) < new Date() : false;
  
  // Get features for current plan
  const features = PLAN_FEATURES[currentPlan];
  
  // Helper functions
  const checkFeature = (feature: keyof PlanFeatures): boolean => {
    if (isTrialExpired && currentPlan === 'pro_trial') {
      return false; // All features disabled after trial expires
    }
    
    const value = features[feature];
    return typeof value === 'boolean' ? value : value !== 0;
  };

  const checkLimit = (
    resource: 'projects' | 'storage' | 'teamMembers',
    currentCount: number,
    additionalCount: number = 0
  ): { allowed: boolean; reason?: string; limit?: number } => {
    if (isTrialExpired && currentPlan === 'pro_trial') {
      return { 
        allowed: false, 
        reason: 'Your trial has expired. Please upgrade to continue.' 
      };
    }

    const limitKey = `max${resource.charAt(0).toUpperCase() + resource.slice(1)}` as keyof PlanFeatures;
    const limit = features[limitKey] as number;
    
    if (limit === -1) {
      return { allowed: true }; // Unlimited
    }
    
    if (currentCount + additionalCount > limit) {
      return { 
        allowed: false, 
        reason: `You've reached the ${resource} limit for your ${currentPlan} plan (${limit} max)`,
        limit 
      };
    }
    
    return { allowed: true, limit };
  };

  const showUpgradePrompt = (feature: string) => {
    toast({
      title: "Upgrade Required",
      description: `The ${feature} feature requires an upgraded plan. Your current plan is ${currentPlan}.`,
      variant: "default",
      action: {
        label: "View Plans",
        onClick: () => window.location.href = '/billing'
      }
    });
  };

  const getDaysLeftInTrial = (): number | null => {
    if (currentPlan !== 'pro_trial' || !trialEndsAt) return null;
    
    const now = new Date();
    const end = new Date(trialEndsAt);
    const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return daysLeft > 0 ? daysLeft : 0;
  };

  return {
    currentPlan,
    features,
    isTrialExpired,
    trialEndsAt,
    checkFeature,
    checkLimit,
    showUpgradePrompt,
    getDaysLeftInTrial,
    canInviteMembers: checkFeature('canInviteMembers'),
    canUseAdvancedFeatures: checkFeature('canUseAdvancedFeatures'),
    canExportData: checkFeature('canExportData'),
    hasSupport: checkFeature('hasSupport'),
    supportLevel: features.supportLevel
  };
}