import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface OrderWithItems {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  shipping_address: string;
  payment_status: string;
  items: {
    id: string;
    quantity: number;
    price_at_time: number;
    product: {
      name: string;
      image_url: string;
    };
  }[];
}

export default function Orders() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            items:order_items(
              id,
              quantity,
              price_at_time,
              product:products(
                name,
                image_url
              )
            )
          `)
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders(data);
      } catch (error: any) {
        toast.error('Failed to fetch orders');
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please sign in to view your orders.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">No orders yet</h2>
        <p className="text-gray-600">Start shopping to create your first order.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    Order placed on{' '}
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="px-3 py-1 rounded-full text-sm font-medium capitalize
                    ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'}"
                  >
                    {order.status}
                  </span>
                  <span className="text-sm text-gray-600 mt-1">
                    Total: ${order.total_amount.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">Items</h3>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity} × ${item.price_at_time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t mt-4 pt-4">
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <p className="text-gray-600 whitespace-pre-line">
                  {order.shipping_address}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}