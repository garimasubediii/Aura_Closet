import React from 'react';
import { Heart, Leaf, Shield, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6 text-pink-800">About Aura Closet</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Welcome to Aura Closet, where fashion meets elegance. We believe in creating a magical shopping experience that brings out your inner beauty.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            alt="Our Store"
            className="rounded-lg shadow-lg"
          />
          <div className="absolute -bottom-6 -right-6 bg-pink-100 p-8 rounded-lg shadow-lg">
            <p className="text-pink-800 font-medium">Founded in 2024</p>
            <p className="text-gray-600">With love & passion</p>
          </div>
        </div>
        <div className="space-y-6 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-pink-800">Our Story</h2>
          <p className="text-gray-600">
            Aura Closet was born from a dream to create a space where fashion enthusiasts could find unique pieces that make them feel beautiful and confident. Our carefully curated collection reflects our commitment to quality, style, and sustainability.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-pink-50 p-4 rounded-lg">
              <p className="font-medium text-pink-800">1000+</p>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div className="bg-pink-50 p-4 rounded-lg">
              <p className="font-medium text-pink-800">500+</p>
              <p className="text-gray-600">Unique Styles</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
        <div className="bg-pink-50 p-6 rounded-lg text-center">
          <Heart className="w-8 h-8 text-pink-500 mx-auto mb-4" />
          <h3 className="font-medium text-pink-800 mb-2">Made with Love</h3>
          <p className="text-gray-600">Every piece is chosen with care and attention to detail</p>
        </div>
        <div className="bg-pink-50 p-6 rounded-lg text-center">
          <Sparkles className="w-8 h-8 text-pink-500 mx-auto mb-4" />
          <h3 className="font-medium text-pink-800 mb-2">Quality First</h3>
          <p className="text-gray-600">Premium materials and excellent craftsmanship</p>
        </div>
        <div className="bg-pink-50 p-6 rounded-lg text-center">
          <Leaf className="w-8 h-8 text-pink-500 mx-auto mb-4" />
          <h3 className="font-medium text-pink-800 mb-2">Sustainable</h3>
          <p className="text-gray-600">Eco-friendly practices and responsible sourcing</p>
        </div>
        <div className="bg-pink-50 p-6 rounded-lg text-center">
          <Shield className="w-8 h-8 text-pink-500 mx-auto mb-4" />
          <h3 className="font-medium text-pink-800 mb-2">Secure Shopping</h3>
          <p className="text-gray-600">Safe and protected online shopping experience</p>
        </div>
      </div>
    </div>
  );
}