"use client";

import React, { useEffect, useState } from "react";
import { SubscriptionPlan } from "@/types/SubscriptionTypes";
import { getSubscriptionPlans, createSubscriptionCheckout } from "@/services/SubscriptionService";
import { getProfile } from "@/services/CompanyService";
import { toast } from "react-toastify";
import { Check, ShieldCheck, CreditCard, Calendar, Star } from "lucide-react";

interface CurrentSubscription {
  planId?: string;
  status: "active" | "expired" | "cancelled" | "none"; // Adjusted to match expected backend response
  startDate?: string;
  endDate?: string;
  planName?: string; // Optional, might need to fetch plan details if not returned directly
}

export default function CompanySubscriptionPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSub, setCurrentSub] = useState<CurrentSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const storedUser = localStorage.getItem('user');
      const userId = storedUser ? JSON.parse(storedUser).id : null;
      
      const [plansData, profileData] = await Promise.all([
        getSubscriptionPlans(true), // Fetch only active plans
        userId ? getProfile(userId) : Promise.resolve(null)
      ]);
      
      if (!profileData) {
         setLoading(false);
         return;
      }
      
      setPlans(plansData);

      // Extract subscription info from profile
      const profile = (profileData as unknown) as { subscription: CurrentSubscription; id: string; _id: string };
      const sub = profile.subscription; 
      if (sub) {
        setCurrentSub(sub);
      }
      
      setCompanyId(profile.id || profile._id);

    } catch (error) {
      console.error(error);
      toast.error("Failed to load subscription details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!companyId) {
        toast.error("Company information missing. Please re-login.");
        return;
    }

    setProcessingId(plan._id);
    try {
      const { url } = await createSubscriptionCheckout(plan._id, companyId);
      window.location.href = url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to initiate payment");
      setProcessingId(null);
    }
  };

  const isActive = currentSub?.status === 'active';
  
  // Find name of current plan if active
  const currentPlanDetails = plans.find(p => p._id === currentSub?.planId);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 text-black">
        <div className="max-w-7xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Upgrade Your Business</h1>
        <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto">
          Unlock premium features, manage unlimited slots, and grow your clientele with our tailored subscription plans.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
        </div>
      ) : (
        <>
        {/* Current Subscription Status */}
          {isActive ? (
             <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-green-100 mb-12 relative">
                <div className="absolute top-0 right-0 bg-green-500 text-white px-6 py-2 rounded-bl-3xl font-bold">
                    ACTIVE PLAN
                </div>
                <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                         <div className="flex items-center gap-3 mb-2">
                            <ShieldCheck className="text-green-600 w-8 h-8" />
                            <h2 className="text-2xl font-black text-gray-900">
                                {currentPlanDetails?.name || 'Premium Plan'}
                            </h2>
                         </div>
                         <p className="text-gray-500 font-medium mb-6">
                            Your subscription is active and valid until <span className="text-gray-900 font-bold">{new Date(currentSub?.endDate || '').toLocaleDateString()}</span>
                         </p>
                         <div className="flex gap-4">
                            <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 flex items-center gap-2">
                                <Calendar size={18} className="text-gray-400" />
                                <span className="text-sm font-bold text-gray-700">Started: {new Date(currentSub?.startDate || '').toLocaleDateString()}</span>
                            </div>
                         </div>
                    </div>
                     <div className="text-center md:text-right">
                         <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                         <p className="text-green-600 font-black text-3xl mb-4">ACTIVE</p>
                         <button className="text-gray-400 font-bold text-sm hover:text-gray-600 underline">Cancel Subscription</button>
                    </div>
                </div>
             </div>
          ) : (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-12 flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-full shrink-0">
                         <Star className="text-blue-600 w-6 h-6" />
                      </div>
                      <div>
                          <h3 className="font-bold text-blue-900 text-lg">No Active Subscription</h3>
                          <p className="text-blue-700">Subscribe now to start managing slots and accepting bookings.</p>
                      </div>
                </div>
          )}

          {/* Plan Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => {
                 const isCurrent = currentSub?.planId === plan._id && isActive;
                 const currentName = currentPlanDetails?.name?.toLowerCase();
                 const planName = plan.name.toLowerCase();

                 // Optimization: Highlight "Upgrade Plan" if they are on "Basic Plan"
                 const isMajorUpgrade = currentName === 'basic plan' && planName === 'upgrade plan';
                 
                 return (
                    <div 
                        key={plan._id} 
                        className={`bg-white rounded-3xl shadow-xl overflow-hidden border-2 flex flex-col transition-all duration-300 transform hover:-translate-y-2 relative
                        ${isCurrent ? 'border-green-500 ring-4 ring-green-500/10' : isMajorUpgrade ? 'border-blue-500 scale-105 z-10' : 'border-transparent hover:border-gray-200'}
                        `}
                    >
                        {isCurrent ? (
                            <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-1.5 font-bold text-xs uppercase tracking-widest">
                                Current Plan
                            </div>
                        ) : isMajorUpgrade ? (
                            <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-center py-1.5 font-bold text-xs uppercase tracking-widest">
                                Recommended Upgrade
                            </div>
                        ) : null}
                        
                        <div className={`p-8 ${(isCurrent || isMajorUpgrade) ? 'pt-10' : ''}`}>
                            <h3 className="text-2xl font-black mb-2 text-gray-900">{plan.name}</h3>
                            <p className="text-gray-500 font-medium text-sm mb-6">{plan.description}</p>
                            
                            <div className="flex items-baseline mb-8">
                            <span className="text-5xl font-black text-gray-900">₹{plan.price}</span>
                            <span className="text-gray-400 ml-2 font-bold uppercase text-sm">/ {plan.duration}</span>
                            </div>

                            <button
                                onClick={() => handleSubscribe(plan)}
                                disabled={processingId === plan._id || isCurrent}
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95
                                    ${isCurrent 
                                        ? 'bg-green-100 text-green-700 cursor-default shadow-none' 
                                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-xl'}
                                    ${processingId === plan._id ? 'opacity-70 cursor-wait' : ''}
                                `}
                            >
                                {processingId === plan._id ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : isCurrent ? (
                                    <> <Check size={20} /> Active </>
                                ) : (
                                    <> <CreditCard size={20} /> Choose {plan.name} </>
                                )}
                            </button>
                        </div>
              
                        <div className="bg-gray-50 p-8 flex-1 border-t border-gray-100">
                             <p className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-4">What&apos;s Included</p>
                            <ul className="space-y-4">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="bg-green-100 p-1 rounded-full mt-0.5 shrink-0">
                                            <Check size={12} className="text-green-600" />
                                        </div>
                                        <span className="text-gray-700 font-medium text-sm leading-relaxed">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                 )
            })}
          </div>
        </>
      )}
      </div>
    </div>
  );
}
