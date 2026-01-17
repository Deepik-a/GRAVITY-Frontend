"use client";
import React, { useEffect, useState } from "react";
import { getCompanyReviews, submitReview } from "@/services/UserService";
import { toast } from 'react-toastify';

interface ReviewsSectionProps {
  companyId: string;
  isUser?: boolean; // If true, allow writing review
}

export default function ReviewsSection({ companyId, isUser = false }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await getCompanyReviews(companyId);
      setReviews(res);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) fetchReviews();
  }, [companyId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return toast.error("Please add a comment");
    setSubmitting(true);
    try {
       await submitReview({ companyId, ...newReview });
       toast.success("Review submitted!");
       setShowModal(false);
       setNewReview({ rating: 5, comment: "" });
       fetchReviews();
    } catch (err: any) {
        toast.error(err.message || "Failed to submit review");
    } finally {
        setSubmitting(false);
    }
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Reviews ({reviews.length})</h2>
        {isUser && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Write a Review
            </button>
        )}
      </div>

      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500 italic">No reviews yet.</p>
      ) : (
        <div className="space-y-6">
           {reviews.map((r) => (
               <div key={r.id} className="border-b pb-4">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                             {r.userDetails?.profileImage ? (
                                 <img src={r.userDetails.profileImage} alt="" className="h-full w-full object-cover" />
                             ) : (
                                 <span className="flex items-center justify-center h-full w-full text-xs font-bold text-gray-500">
                                    {(r.userDetails?.name || "U")[0].toUpperCase()}
                                 </span>
                             )}
                        </div>
                        <span className="font-semibold text-gray-800">{r.userDetails?.name || "Anonymous"}</span>
                     </div>
                     <span className="text-gray-400 text-sm">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="mt-2 flex items-center">
                     {[1,2,3,4,5].map(star => (
                         <span key={star} className={`h-4 w-4 ${star <= r.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                             ★
                         </span>
                     ))}
                  </div>
                  <p className="mt-2 text-gray-600">{r.comment}</p>
               </div>
           ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Write a Review</h3>
              <form onSubmit={handleSubmit}>
                 <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <div className="flex space-x-2">
                       {[1,2,3,4,5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className={`focus:outline-none text-2xl ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                             ★
                          </button>
                       ))}
                    </div>
                 </div>
                 <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                    <textarea
                      rows={4}
                      className="w-full border rounded-md p-2 focus:ring-2 focus:ring-black focus:border-transparent"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Share your experience..."
                      required
                    />
                 </div>
                 <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
                    >
                      {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
