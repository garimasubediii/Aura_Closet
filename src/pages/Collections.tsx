import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Category } from '../types';
import { Sparkles, Heart, Star, ShoppingBag } from 'lucide-react';

export default function Collections() {
  const [collections, setCollections] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch collections
        const { data: collectionsData, error: collectionsError } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (collectionsError) throw collectionsError;
        setCollections(collectionsData);

        // Fetch featured products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*, categories(*)')
          .limit(3)
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;
        setFeaturedProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading collections...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative h-[400px] mb-16 rounded-2xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          alt="Collections Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-900/70 to-transparent flex items-center">
          <div className="max-w-2xl px-8">
            <h1 className="text-5xl font-bold text-white mb-4">Our Collections</h1>
            <p className="text-xl text-pink-100">
              Discover our carefully curated collections, each designed to bring out your unique style and personality.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-pink-800 mb-8 flex items-center gap-2">
          <Star className="h-8 w-8" />
          Featured Items
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="aspect-w-1 aspect-h-1 relative">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <Heart className="h-6 w-6 text-pink-500" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-pink-600 font-medium">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Collections Grid */}
      <div>
        <h2 className="text-3xl font-bold text-pink-800 mb-8 flex items-center gap-2">
          <ShoppingBag className="h-8 w-8" />
          Browse Collections
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              to={`/shop?category=${collection.id}`}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="aspect-w-3 aspect-h-4">
                <img
                  src={`https://source.unsplash.com/800x600/?fashion,${collection.name}`}
                  alt={collection.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    {collection.name}
                    <Sparkles className="w-5 h-5" />
                  </h3>
                  <p className="text-pink-100">{collection.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}