
import { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { PlanType } from '@/types/plan';

export function useUserRole(): { 
  role: PlanType | null, 
  isLoading: boolean,
  isUpgradable: boolean,
  canAccessFeature: (feature: string) => boolean 
} {
  const { user } = useAuthContext();
  const [role, setRole] = useState<PlanType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchUserRole() {
      if (!user) {
        setRole(null);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // First try to get from subscription table (future Stripe integration)
        const { data: subscriptionData } = await supabase
          .from('subscriptions')
          .select('plan_type')
          .eq('user_id', user.id)
          .maybeSingle();
          
        // Fall back to profile data if no subscription
        if (subscriptionData?.plan_type) {
          setRole(subscriptionData.plan_type as PlanType);
        } else {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('plan_type')
            .eq('id', user.id)
            .single();
            
          setRole(profileData?.plan_type as PlanType || 'free');
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRole('free'); // Default fallback
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUserRole();
  }, [user]);
  
  // Helper function to check if user can be upgraded
  const isUpgradable = role !== 'business';
  
  // Function to check if user has access to specific features
  const canAccessFeature = (feature: string): boolean => {
    if (!role) return false;
    
    switch (feature) {
      case 'custom_domains':
        return role === 'business';
      case 'analytics':
        return role === 'pro' || role === 'business';
      case 'embed_links':
        return role === 'pro' || role === 'business';
      case 'templates':
        return true; // Available to all plans
      default:
        return true; // Default to allowing access
    }
  };
  
  return { role, isLoading, isUpgradable, canAccessFeature };
}
