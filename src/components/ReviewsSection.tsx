"use client";
import React, { useEffect, useState } from "react";
import { getCompanyReviews, submitReview } from "@/services/UserService";
import { toast } from 'react-toastify';
import { Star, MessageSquare, Plus, X, Loader2, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { resolveImageUrl } from "@/utils/urlHelper";
import { useCallback } from "react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userDetails?: {
    name: string;
    profileImage?: string;
  };
}

interface ReviewsSectionProps {
  companyId: string;
  isUser?: boolean; // If true, allow writing review
}

export default function ReviewsSection({ companyId, isUser = false }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getCompanyReviews(companyId);
      setReviews(res);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    if (companyId) fetchReviews();
  }, [companyId, fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return toast.error("Please add a comment");
    setSubmitting(true);
    try {
       await submitReview({ companyId, ...newReview });
       toast.success("Thank you! Your review has been submitted.");
       setShowModal(false);
       setNewReview({ rating: 5, comment: "" });
       fetchReviews();
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to submit review";
        toast.error(message);
    } finally {
        setSubmitting(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-amber-50 rounded-3xl flex flex-col items-center justify-center text-amber-600 border border-amber-100 shadow-inner">
            <span className="text-3xl font-black">{calculateAverageRating()}</span>
            <div className="flex scale-75 -mt-1">
              <Star size={12} fill="currentColor" />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Client Feedback</h2>
            <p className="text-gray-500 font-medium">Based on {reviews.length} authentic customer reviews</p>
          </div>
        </div>
        
        {isUser && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl text-sm font-black hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 active:scale-95"
          >
            <Plus size={18} /> Write Review
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm animate-pulse">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-500 font-bold">Loading experiences...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white border border-gray-100 border-dashed rounded-[2rem] p-16 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
            <MessageSquare size={32} />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-500 max-w-xs mx-auto font-medium">Be the first to share your experience with this company!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {reviews.map((r, idx) => (
               <div 
                key={r.id} 
                className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${idx * 100}ms` }}
               >
                  <div className="flex items-start justify-between mb-6">
                     <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-blue-50 overflow-hidden border-2 border-white shadow-sm flex items-center justify-center text-blue-600">
                             {r.userDetails?.profileImage ? (
                                 <Image 
                                    src={resolveImageUrl(r.userDetails.profileImage) || ""} 
                                    alt="" 
                                    width={56} 
                                    height={56} 
                                    className="h-full w-full object-cover" 
                                    unoptimized
                                 />
                             ) : (
                                 <UserIcon size={24} />
                             )}
                        </div>
                        <div>
                          <span className="block font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{r.userDetails?.name || "Premium Client"}</span>
                          <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{new Date(r.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                        </div>
                     </div>
                     <div className="flex gap-1">
                        {[1,2,3,4,5].map(star => (
                           <Star 
                            key={star} 
                            size={14} 
                            className={star <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} 
                           />
                        ))}
                     </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-2 -top-2 text-4xl text-blue-50 font-serif -z-10">&quot;</div>
                    <p className="text-gray-600 font-medium leading-relaxed italic">{r.comment}</p>
                  </div>
               </div>
           ))}
        </div>
      )}

      {/* Write Review Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-in fade-in duration-300">
           <div className="bg-white p-10 rounded-[2.5rem] w-full max-w-lg shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-8">
                <div className="space-y-1">
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Share Experience</h3>
                  <p className="text-gray-500 font-bold text-sm">Your feedback helps others choose better.</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-3 hover:bg-gray-100 rounded-2xl text-gray-400 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 text-center">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Overall Rating</label>
                    <div className="flex justify-center gap-4">
                       {[1,2,3,4,5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className="focus:outline-none transition-transform active:scale-90"
                          >
                             <Star 
                              size={40} 
                              className={star <= (hoverRating || newReview.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} 
                             />
                          </button>
                       ))}
                    </div>
                    <p className="mt-4 text-xs font-black text-amber-600 uppercase tracking-widest">
                      {newReview.rating === 1 ? 'Poor' : 
                       newReview.rating === 2 ? 'Fair' : 
                       newReview.rating === 3 ? 'Good' : 
                       newReview.rating === 4 ? 'Great' : 'Exceptional!'}
                    </p>
                 </div>

                 <div className="space-y-2">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Your Detailed Review</label>
                    <textarea
                      rows={5}
                      className="w-full bg-gray-50 border-2 border-gray-100 rounded-3xl p-6 focus:bg-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-300 font-medium"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="What did you like about their service?"
                      required
                    />
                 </div>

                 <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-8 py-5 text-gray-500 font-black uppercase text-xs tracking-widest hover:text-gray-700 transition-colors"
                    >
                      Wait, Back
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-[2] px-8 py-5 bg-blue-600 text-white rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xl shadow-blue-100 active:scale-95"
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 size={18} className="animate-spin" /> Processing
                        </span>
                      ) : "Confirm Review"}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}

