import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    KhaltiCheckout: any;
  }
}

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, clearCart } = useCartStore();
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);

  // Get user-specific cart items
  const userItems = user ? (items[user.id] || []) : [];
  const total = userItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    // Load Khalti script
    const script = document.createElement('script');
    script.src = 'https://khalti.s3.ap-south-1.amazonaws.com/KPG/dist/2020.12.22.0.0.0/khalti-checkout.iffe.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Initialize Khalti configuration after script loads
      window.KhaltiCheckout && initializeKhalti();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeKhalti = () => {
    const config = {
      publicKey: 'test_public_key_dc74e0fd57cb46cd93832aee0a390234',
      productIdentity: 'aura-closet-order',
      productName: 'Aura Closet Order',
      productUrl: window.location.origin,
      amount: total * 100, // Convert to paisa
      eventHandler: {
        async onSuccess(payload: any) {
          try {
            // Create order in Supabase
            const { data: order, error: orderError } = await supabase
              .from('orders')
              .insert({
                user_id: user?.id,
                total_amount: total,
                shipping_address: shippingAddress,
                status: 'processing'
              })
              .select()
              .single();

            if (orderError) throw orderError;

            // Create order items
            const orderItems = userItems.map(item => ({
              order_id: order.id,
              product_id: item.id,
              quantity: item.quantity,
              price_at_time: item.price
            }));

            const { error: itemsError } = await supabase
              .from('order_items')
              .insert(orderItems);

            if (itemsError) throw itemsError;

            // Update product stock
            for (const item of userItems) {
              const { error: stockError } = await supabase
                .from('products')
                .update({ stock: item.stock - item.quantity })
                .eq('id', item.id);

              if (stockError) throw stockError;
            }

            clearCart();
            toast.success('Order placed successfully!');
            navigate('/orders');
          } catch (error: any) {
            toast.error('Failed to process order');
            console.error('Order processing error:', error);
          }
        },
        onError(error: any) {
          toast.error('Payment failed. Please try again.');
          console.error('Khalti error:', error);
        },
        onClose() {
          setLoading(false);
        }
      }
    };

    return new window.KhaltiCheckout(config);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  if (userItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePayment = async () => {
    if (!shippingAddress) {
      toast.error('Please enter your shipping address');
      return;
    }

    setLoading(true);

    try {
      const checkout = initializeKhalti();
      checkout.show();
    } catch (error: any) {
      toast.error('Something went wrong. Please try again.');
      console.error('Checkout error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="w-full h-32 rounded-md border-gray-300 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
              placeholder="Enter your complete shipping address"
              required
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              {userItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-4">Payment</h2>
          <p className="text-gray-600 mb-6">
            Secure payment processing by Khalti. Your payment information is encrypted and secure.
          </p>
          <button
            onClick={handlePayment}
            disabled={loading || !shippingAddress}
            className="w-full bg-pink-600 text-white py-3 px-6 rounded-md hover:bg-pink-700 transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Pay with Khalti'}
          </button>
        </div>
      </div>
    </div>
  );
}