import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, MapPin, Clock, CreditCard } from "lucide-react";

interface Order {
  id: string;
  items: any[];
  deliveryAddress: any;
  paymentMethod: string;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: string;
  createdAt: string;
  estimatedDelivery: string;
}

const OrderConfirmation = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-xl text-muted-foreground">Order ID: #{order.id}</p>
          </div>

          {/* Estimated Delivery */}
          <div className="bg-card rounded-xl p-6 border-2 shadow-card mb-6">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-primary" />
              <div>
                <p className="font-semibold">Estimated Delivery Time</p>
                <p className="text-2xl font-bold text-primary">{order.estimatedDelivery}</p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-card rounded-xl p-6 border-2 shadow-card mb-6">
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center pb-4 border-b last:border-0">
                  <div>
                    <p className="font-semibold">{item.restaurant.name}</p>
                    <p className="text-sm text-muted-foreground">{item.restaurant.cuisine} Cuisine</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold">₹{item.price * item.quantity}</p>
                </div>
              ))}

              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span>₹{order.deliveryFee}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Taxes</span>
                  <span>₹{order.tax}</span>
                </div>
                <div className="flex justify-between text-xl font-bold pt-2 border-t">
                  <span>Total Paid</span>
                  <span className="text-primary">₹{order.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-card rounded-xl p-6 border-2 shadow-card mb-6">
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

          {/* Payment Method */}
          <div className="bg-card rounded-xl p-6 border-2 shadow-card mb-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              Payment Method
            </h2>
            <p className="text-muted-foreground capitalize">
              {order.paymentMethod === "card" && "Credit/Debit Card"}
              {order.paymentMethod === "upi" && "UPI"}
              {order.paymentMethod === "cod" && "Cash on Delivery"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => navigate(`/track-order/${order.id}`)}
              className="flex-1 h-12 gradient-primary"
            >
              Track Order
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="flex-1 h-12"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmation;
