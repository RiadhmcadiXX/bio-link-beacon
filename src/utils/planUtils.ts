
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PlanType } from '@/types/plan';

export async function updateUserPlan(userId: string, newPlan: PlanType): Promise<boolean> {
  try {
    // Update the profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ plan_type: newPlan })
      .eq('id', userId);

    if (profileError) throw profileError;

    // Also update the subscription record if it exists
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (existingSubscription) {
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .update({ 
          plan_type: newPlan,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (subscriptionError) throw subscriptionError;
    } else {
      // Create a new subscription record
      const { error: insertError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan_type: newPlan
        });

      if (insertError) throw insertError;
    }

    toast.success(`User plan updated to ${newPlan}`);
    return true;
  } catch (error) {
    console.error("Failed to update user plan:", error);
    toast.error("Failed to update user plan");
    return false;
  }
}
