import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Circle, Clock, MapPin, Phone } from "lucide-react";

interface Order {
  id: string;
  items: any[];
  deliveryAddress: any;
  status: string;
  estimatedDelivery: string;
}

const OrderTracking = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (orderId) {
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      const foundOrder = orders.find((o: Order) => o.id === orderId);
      setOrder(foundOrder || null);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <Header />
        <main className="container mx-auto px-4 py-10">
          <div className="text-center py-32">
            <h2 className="text-3xl font-bold mb-4">Order Not Found</h2>
            <Button onClick={() => navigate("/")} className="gradient-primary">
              Back to Home
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const statuses = [
    { key: "placed", label: "Order Placed", completed: true },
    { key: "preparing", label: "Preparing Food", completed: false },
    { key: "out_for_delivery", label: "Out for Delivery", completed: false },
    { key: "delivered", label: "Delivered", completed: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Track Order</h1>
          <p className="text-xl text-muted-foreground mb-8">Order ID: #{order.id}</p>

          {/* Estimated Delivery */}
          <div className="bg-card rounded-xl p-6 border-2 shadow-card mb-8">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">Estimated Delivery</p>
                <p className="text-2xl font-bold text-primary">{order.estimatedDelivery}</p>
              </div>
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="bg-card rounded-xl p-6 border-2 shadow-card mb-8">
            <h2 className="text-2xl font-bold mb-6">Order Status</h2>
            <div className="space-y-6">
              {statuses.map((status, index) => (
                <div key={status.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    {status.completed ? (
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full border-2 border-muted flex items-center justify-center">
                        <Circle className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    {index < statuses.length - 1 && (
                      <div className={`w-0.5 h-12 ${status.completed ? "bg-primary" : "bg-muted"}`} />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <p className={`font-semibold ${status.completed ? "text-primary" : "text-muted-foreground"}`}>
                      {status.label}
                    </p>
                    {status.completed && (
                      <p className="text-sm text-muted-foreground">Completed</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Restaurant Details */}
          {order.items.length > 0 && (
            <div className="bg-card rounded-xl p-6 border-2 shadow-card mb-8">
              <h2 className="text-2xl font-bold mb-4">Restaurant Details</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="pb-4 border-b last:border-0">
                    <p className="font-semibold text-lg">{item.restaurant.name}</p>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4" />
                      {item.restaurant.address}
                    </p>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4" />
                      Contact Restaurant
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Address */}
          <div className="bg-card rounded-xl p-6 border-2 shadow-card mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="h-6 w-6" />
              Delivery Address
            </h2>
            <div className="space-y-1">
              <p className="font-semibold">{order.deliveryAddress.name}</p>
              <p className="text-muted-foreground">{order.deliveryAddress.phone}</p>
              <p className="text-muted-foreground">{order.deliveryAddress.address}</p>
              <p className="text-muted-foreground">Pincode: {order.deliveryAddress.pincode}</p>
            </div>
          </div>

          {/* Back Button */}
          <Button onClick={() => navigate("/")} className="w-full h-12 gradient-primary">
            Back to Home
          </Button>
        </div>
      </main>
    </div>
  );
};

export default OrderTracking;
