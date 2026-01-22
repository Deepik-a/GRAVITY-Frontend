"use client";

import React, { useEffect, useState } from "react";
import { CreateSubscriptionPlanDto, SubscriptionPlan } from "@/types/SubscriptionTypes";
import { createSubscriptionPlan, getSubscriptionPlans } from "@/services/SubscriptionService";
import { toast } from "react-toastify";
import { Plus, Check, X, ShieldCheck } from "lucide-react";

export default function SubscriptionManagementPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlan, setNewPlan] = useState<CreateSubscriptionPlanDto>({
    name: "",
    price: 0,
    duration: "monthly",
    description: "",
    features: [],
  });
  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await getSubscriptionPlans();
      setPlans(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.name || !newPlan.price || !newPlan.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createSubscriptionPlan(newPlan);
      toast.success("Subscription plan created successfully");
      setShowCreateModal(false);
      setNewPlan({ name: "", price: 0, duration: "monthly", description: "", features: [] });
      fetchPlans();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create plan");
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setNewPlan((prev) => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setNewPlan((prev) => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Subscription Management</h1>
          <p className="text-gray-500 font-medium">Create and manage company subscription plans</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all active:scale-95"
        >
          <Plus size={20} /> Create New Plan
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan._id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col hover:shadow-2xl transition-shadow duration-300">
              <div className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative">
                <div className="absolute top-4 right-4">
                  {plan.isActive ? (
                    <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-bold uppercase border border-green-500/30">Active</span>
                  ) : (
                    <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-bold uppercase border border-red-500/30">Inactive</span>
                  )}
                </div>
                <h3 className="text-2xl font-black mb-1">{plan.name}</h3>
                <p className="text-gray-400 font-medium text-sm">{plan.description}</p>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-black text-gray-900">₹{plan.price}</span>
                  <span className="text-gray-500 ml-2 font-bold uppercase text-sm">/ {plan.duration}</span>
                </div>

                <div className="space-y-3 flex-1">
                  <p className="font-bold text-gray-400 text-xs uppercase tracking-wider mb-2">Features Included</p>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="bg-green-100 p-1 rounded-full mt-0.5">
                        <Check size={12} className="text-green-600" />
                      </div>
                      <span className="text-gray-700 font-medium text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors">Edit</button>
                    <button className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors">Deactivate</button>
                </div> */}
              </div>
            </div>
          ))}
          
          {plans.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300">
              <div className="flex justify-center mb-4">
                 <ShieldCheck size={48} className="text-gray-200" />
              </div>
              <h3 className="text-xl font-bold text-gray-400">No subscription plans found</h3>
              <p className="text-gray-400 mt-2">Create a new plan to get started</p>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-gray-900">Create New Plan</h2>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Plan Name</label>
                <select
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium bg-white"
                >
                  <option value="" disabled>Select a plan name</option>
                  <option value="basic plan">Basic Plan</option>
                  <option value="upgrade plan">Upgrade Plan</option>
                  <option value="premium plan">Premium Plan</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    placeholder="2999"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({ ...newPlan, price: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Duration</label>
                  <select
                    value={newPlan.duration}
                    onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value as "monthly" | "yearly" })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium bg-white"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="What does this plan offer?"
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Features</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Add a feature..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="bg-gray-900 text-white px-4 rounded-xl font-bold text-sm hover:bg-black transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {newPlan.features.map((feature, index) => (
                    <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-2 border border-blue-100">
                      {feature}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveFeature(index)}
                        className="text-blue-400 hover:text-blue-800"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  {newPlan.features.length === 0 && (
                    <span className="text-gray-400 text-sm italic">No features added yet</span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
                >
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
