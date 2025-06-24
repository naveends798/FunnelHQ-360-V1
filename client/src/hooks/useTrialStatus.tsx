import { useEffect, useState } from 'react';
import { useOrganization } from '@clerk/clerk-react';
import { useLocation } from 'wouter';
import { useToast } from './use-toast';

export function useTrialStatus() {
  const { organization } = useOrganization();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [hasShownExpiredToast, setHasShownExpiredToast] = useState(false);

  const plan = organization?.publicMetadata?.plan as string;
  const trialEndsAt = organization?.publicMetadata?.trialEndsAt as string;

  const isProTrial = plan === 'pro_trial';
  const trialEndDate = trialEndsAt ? new Date(trialEndsAt) : null;
  const now = new Date();
  
  const isTrialExpired = isProTrial && trialEndDate ? trialEndDate < now : false;
  const daysLeft = trialEndDate ? Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const hoursLeft = trialEndDate ? Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60)) : 0;

  // Show warning when trial is about to expire
  useEffect(() => {
    if (!isProTrial || !trialEndDate || hasShownExpiredToast) return;

    if (isTrialExpired) {
      // Trial has expired
      toast({
        title: "Trial Expired",
        description: "Your 14-day Pro trial has ended. Upgrade now to continue using all features.",
        variant: "destructive",
        duration: 10000,
        action: {
          label: "Upgrade Now",
          onClick: () => setLocation('/billing')
        }
      });
      setHasShownExpiredToast(true);
    } else if (daysLeft <= 3 && daysLeft > 0) {
      // Trial expiring soon
      const message = daysLeft === 1 
        ? `Your trial expires in ${hoursLeft} hours!`
        : `Your trial expires in ${daysLeft} days.`;
        
      toast({
        title: "Trial Ending Soon",
        description: message + " Upgrade to Pro to keep all your features.",
        variant: "default",
        action: {
          label: "View Plans",
          onClick: () => setLocation('/billing')
        }
      });
    }
  }, [isProTrial, trialEndDate, isTrialExpired, daysLeft, hoursLeft, hasShownExpiredToast, toast, setLocation]);

  // Redirect to billing if trial expired and on restricted route
  useEffect(() => {
    if (isTrialExpired) {
      const allowedRoutes = ['/billing', '/support', '/login', '/signup'];
      const isAllowedRoute = allowedRoutes.some(route => location.startsWith(route));
      
      if (!isAllowedRoute) {
        console.log('🔒 Trial expired, redirecting to billing');
        setLocation('/billing');
      }
    }
  }, [isTrialExpired, location, setLocation]);

  return {
    isProTrial,
    isTrialExpired,
    trialEndDate,
    daysLeft: Math.max(0, daysLeft),
    hoursLeft: Math.max(0, hoursLeft),
    showUpgradeBanner: isProTrial && (isTrialExpired || daysLeft <= 7)
  };
}