
import React from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import { Sparkles, Star } from 'lucide-react';

interface UpgradeBannerProps {
  feature?: string;
  showWhenRole?: 'free' | 'pro' | null;
}

export const UpgradeBanner: React.FC<UpgradeBannerProps> = ({ 
  feature,
  showWhenRole = null
}) => {
  const { role, isLoading } = useUserRole();
  
  // If loading state or the user has no role, don't show anything
  if (isLoading || !role) return null;
  
  // If a specific role is passed and doesn't match current role, don't show
  if (showWhenRole && role !== showWhenRole) return null;
  
  const getCtaText = () => {
    if (role === 'free') return 'Upgrade to Pro';
    if (role === 'pro') return 'Upgrade to Business';
    return '';
  };
  
  const getFeatureText = () => {
    if (feature === 'custom_domains') 
      return 'Custom domains are available on the Business plan';
    if (feature === 'analytics') 
      return 'Advanced analytics are available on Pro and Business plans';
    if (feature === 'embed_links') 
      return 'Embed videos and content with our Pro and Business plans';
    return 'Upgrade your plan to unlock more features';
  };
  
  // Don't show for Business plan users
  if (role === 'business') return null;
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-brand-purple/20 rounded-lg p-4 my-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="rounded-full bg-brand-purple/10 p-2">
          {role === 'free' ? (
            <Sparkles className="h-5 w-5 text-brand-purple" />
          ) : (
            <Star className="h-5 w-5 text-brand-purple" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">
            {getFeatureText()}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {role === 'free' 
              ? 'Unlock more features with our Pro plan' 
              : 'Get even more with our Business plan'}
          </p>
        </div>
        
        <Button 
          size="sm"
          variant="default"
          className="bg-brand-purple hover:bg-brand-purple/90"
        >
          {getCtaText()}
        </Button>
      </div>
    </div>
  );
};
