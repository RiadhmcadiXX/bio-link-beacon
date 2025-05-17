
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateUserPlan } from "@/utils/planUtils";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuthContext } from "@/contexts/AuthContext";
import { Check, Sparkles, Zap, Building2 } from "lucide-react";

export const PlanManagement = () => {
  const { user } = useAuthContext();
  const { role, isLoading } = useUserRole();
  const [updating, setUpdating] = useState(false);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>Loading your subscription information...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const handleUpgrade = async (newPlan: 'free' | 'pro' | 'business') => {
    if (!user) {
      toast.error("You need to be logged in to upgrade");
      return;
    }

    // In the future, this will redirect to Stripe checkout
    // For now, we'll manually update the plan for testing
    setUpdating(true);
    try {
      const success = await updateUserPlan(user.id, newPlan);
      if (success) {
        toast.success(`Upgraded to ${newPlan} plan!`);
        // Force reload to update UI with new plan
        window.location.reload();
      }
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Subscription Plans</CardTitle>
        <CardDescription>
          Choose the right plan for your needs
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-6 mt-2 md:grid-cols-3">
          {/* Free Plan */}
          <Card className={`relative ${role === 'free' ? 'border-brand-purple/50 shadow-md' : ''}`}>
            {role === 'free' && (
              <div className="absolute -top-3 left-0 right-0 flex justify-center">
                <Badge className="bg-brand-purple">Current Plan</Badge>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-gray-500" />
                <CardTitle className="text-lg">Free</CardTitle>
              </div>
              <CardDescription>
                <div className="mt-1">
                  <span className="text-2xl font-bold">$0</span>
                  <span className="text-sm text-gray-500 ml-1">/month</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm">Up to 5 links</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm">Basic templates</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm">Basic analytics</span>
                </li>
              </ul>
              
              {role === 'free' ? (
                <Button disabled variant="outline" className="w-full">
                  Current Plan
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleUpgrade('free')}
                  disabled={updating}
                >
                  Downgrade
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className={`relative ${role === 'pro' ? 'border-brand-purple/50 shadow-md' : ''}`}>
            {role === 'pro' && (
              <div className="absolute -top-3 left-0 right-0 flex justify-center">
                <Badge className="bg-brand-purple">Current Plan</Badge>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-purple-500" />
                <CardTitle className="text-lg">Pro</CardTitle>
              </div>
              <CardDescription>
                <div className="mt-1">
                  <span className="text-2xl font-bold">$9.99</span>
                  <span className="text-sm text-gray-500 ml-1">/month</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm">Unlimited links</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm">All templates</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm">Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm">Embed YouTube videos</span>
                </li>
              </ul>
              
              {role === 'pro' ? (
                <Button disabled variant="outline" className="w-full">
                  Current Plan
                </Button>
              ) : role === 'business' ? (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleUpgrade('pro')}
                  disabled={updating}
                >
                  Downgrade
                </Button>
              ) : (
                <Button 
                  className="w-full bg-brand-purple hover:bg-brand-purple/90"
                  onClick={() => handleUpgrade('pro')}
                  disabled={updating}
                >
                  Upgrade
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Business Plan */}
          <Card className={`relative ${role === 'business' ? 'border-brand-purple/50 shadow-md' : ''}`}>
            {role === 'business' && (
              <div className="absolute -top-3 left-0 right-0 flex justify-center">
                <Badge className="bg-brand-purple">Current Plan</Badge>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-lg">Business</CardTitle>
              </div>
              <CardDescription>
                <div className="mt-1">
                  <span className="text-2xl font-bold">$24.99</span>
                  <span className="text-sm text-gray-500 ml-1">/month</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm">Everything in Pro</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm">Custom domain</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm">Priority support</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm">White-label option</span>
                </li>
              </ul>
              
              {role === 'business' ? (
                <Button disabled variant="outline" className="w-full">
                  Current Plan
                </Button>
              ) : (
                <Button 
                  className="w-full bg-brand-purple hover:bg-brand-purple/90"
                  onClick={() => handleUpgrade('business')}
                  disabled={updating}
                >
                  Upgrade
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
