import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, ShoppingCart, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Products</p>
              <p className="text-2xl font-semibold mt-1">30</p>
            </div>
            <Package className="h-8 w-8 text-indigo-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-2xl font-semibold mt-1">12</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-2xl font-semibold mt-1">6</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Revenue</p>
              <p className="text-2xl font-semibold mt-1">$1,450</p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">#ORD-2024-001</p>
                <p className="text-sm text-gray-600">March 15, 2024</p>
              </div>
              <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                Completed
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">#ORD-2024-002</p>
                <p className="text-sm text-gray-600">March 14, 2024</p>
              </div>
              <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                Processing
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/admin/products"
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Package className="h-6 w-6 mb-2 text-gray-700" />
              <p className="font-medium">Manage Products</p>
            </Link>
            <Link
              to="/admin/orders"
              className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ShoppingCart className="h-6 w-6 mb-2 text-gray-700" />
              <p className="font-medium">View Orders</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}