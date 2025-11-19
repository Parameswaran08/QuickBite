import { useCart } from "@/contexts/CartContext";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";

const Cart = () => {
  const { items, removeItem, updateQuantity, getSubtotal, getDeliveryFee, getTax, getTotal } = useCart();
  const navigate = useNavigate();

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const tax = getTax();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <Header />
        <main className="container mx-auto px-4 py-10">
          <div className="text-center py-32 animate-fade-in">
            <div className="mb-6">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-3">Your Cart is Empty</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Looks like you haven't added any items to your cart yet. Browse our restaurants and add some delicious food!
            </p>
            <Button
              onClick={() => navigate("/")}
              className="gradient-primary"
            >
              Browse Restaurants
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
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Restaurants
        </Button>

        <h1 className="text-4xl font-bold mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.restaurant.id}
                className="bg-card rounded-xl p-6 border-2 shadow-card animate-fade-in"
              >
                <div className="flex gap-4">
                  <img
                    src={item.restaurant.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"}
                    alt={item.restaurant.name}
                    className="w-24 h-24 rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4";
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{item.restaurant.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{item.restaurant.cuisine} Cuisine</p>
                    <p className="text-lg font-bold text-primary">₹{item.price} for two</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.restaurant.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-bold w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.restaurant.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold">₹{item.price * item.quantity}</span>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeItem(item.restaurant.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 border-2 shadow-card sticky top-4">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Taxes (5%)</span>
                  <span>₹{tax}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{total}</span>
                </div>
              </div>

              <Button
                onClick={() => navigate("/checkout")}
                className="w-full h-12 text-lg font-bold gradient-primary"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;
