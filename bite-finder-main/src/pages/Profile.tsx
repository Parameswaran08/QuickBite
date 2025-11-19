import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Phone, MapPin, Edit2, LogOut, ShoppingBag } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, logout, updateProfile: updateAuthProfile, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }

    loadOrders();
  }, [user, isAuthenticated, navigate]);

  const loadOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(savedOrders.reverse().slice(0, 5)); // Show last 5 orders
  };

  const handleSave = () => {
    setIsSaving(true);

    try {
      updateAuthProfile({
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
      });

      toast({
        title: "Profile updated!",
        description: "Your profile has been successfully updated.",
      });

      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">My Profile</h1>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl p-6 border-2 shadow-card mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Personal Information</h2>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        size="sm"
                        className="gradient-primary"
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        value={profile.email}
                        disabled
                        className="pl-10 bg-muted"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        disabled={!isEditing}
                        placeholder="9876543210"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Default Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="address"
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        disabled={!isEditing}
                        placeholder="123 Main Street, City"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-card rounded-xl p-6 border-2 shadow-card">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <ShoppingBag className="h-6 w-6" />
                  Recent Orders
                </h2>

                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No orders yet</p>
                    <Button onClick={() => navigate("/")} className="gradient-primary">
                      Start Ordering
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="p-4 border-2 rounded-lg hover:border-primary transition-colors cursor-pointer"
                        onClick={() => navigate(`/track-order/${order.id}`)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold">Order #{order.id.slice(-8)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="font-bold text-primary">₹{order.total}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} item(s) • {order.status}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-6 border-2 shadow-card">
                <h2 className="text-2xl font-bold mb-6">Quick Stats</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Orders</p>
                    <p className="text-3xl font-bold text-primary">{orders.length}</p>
                  </div>

                  <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      ₹{orders.reduce((sum, order) => sum + order.total, 0)}
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "Today"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
