import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { ShoppingBag, Star } from 'lucide-react';
import ReactStars from 'react-rating-stars-component';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch product
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*, categories(*)')
          .eq('id', id)
          .single();

        if (productError) throw productError;
        setProduct(productData);

        // Fetch reviews with correct profiles relationship
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select(`
            *,
            profile:profiles!fk_reviews_user(
            id,
              full_name,
              avatar_url
            )
          `)
          .eq('product_id', id)
          .order('created_at', { ascending: false });

        if (reviewsError) throw reviewsError;
        setReviews(reviewsData);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !product) return;

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          product_id: product.id,
          rating: newReview.rating,
          comment: newReview.comment
        });

      if (error) throw error;

      // Refresh reviews with correct profiles relationship
      const { data, error: fetchError } = await supabase
        .from('reviews')
        .select(`
          *,
          profile:profiles!fk_reviews_user (
            full_name,
            avatar_url
          )
        `)
        .eq('product_id', id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setReviews(data);
      setNewReview({ rating: 0, comment: '' });
      toast.success('Review submitted successfully');
    } catch (error: any) {
      toast.error('Failed to submit review'+ error.message);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-[500px] object-cover rounded-lg"
            />
          </div>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-2xl font-semibold">${product.price}</p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Size</h3>
                <p className="text-gray-600">{product.size}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Availability</h3>
                <p className="text-gray-600">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
              </div>
            </div>
            <button
              onClick={() => addItem(product)}
              disabled={product.stock === 0}
              className="w-full bg-pink-600 text-white py-3 px-6 rounded-md hover:bg-pink-700 transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-5 w-5" />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          
          {user && (
            <form onSubmit={handleReviewSubmit} className="mb-8">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <ReactStars
                  count={5}
                  onChange={(rating) => setNewReview({ ...newReview, rating })}
                  size={24}
                  activeColor="#db2777"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border-gray-300 focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
                  rows={4}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors"
              >
                Submit Review
              </button>
            </form>
          )}

          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-6">
                <div className="flex items-center mb-2">
                  <img
                    src={review.profile?.avatar_url || 'https://via.placeholder.com/40'}
                    alt={review.profile?.full_name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium">{review.profile?.full_name}</p>
                    <div className="flex items-center">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}