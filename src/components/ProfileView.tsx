
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { User, Package, Edit, Save, X } from "lucide-react";

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: {
    quantity: number;
    price_at_time: number;
    products: {
      name: string;
      image: string;
    };
  }[];
}

const ProfileView = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: ''
  });
  const { toast } = useToast();

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data || { id: user.id, email: user.email, full_name: null, avatar_url: null });
      setFormData({
        full_name: data?.full_name || '',
        email: data?.email || user.email || ''
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          total_amount,
          status,
          created_at,
          order_items (
            quantity,
            price_at_time,
            products (
              name,
              image
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          email: formData.email
        });

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile.",
          variant: "destructive"
        });
        return;
      }

      setEditing(false);
      await fetchProfile();
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProfile(), fetchOrders()]);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading profile...</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-6 w-6" />
              <span>Profile Information</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(!editing)}
                className="ml-auto"
              >
                {editing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={updateProfile} className="bg-purple-600 hover:bg-purple-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{profile?.full_name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{profile?.email}</p>
                </div>
                <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:text-red-700">
                  Logout
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-6 w-6" />
              <span>Order History</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No orders found</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">${order.total_amount}</p>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {order.order_items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <img
                            src={item.products.image || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=50&h=50&fit=crop"}
                            alt={item.products.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.products.name}</p>
                            <p className="text-xs text-gray-600">Qty: {item.quantity} × ${item.price_at_time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileView;
