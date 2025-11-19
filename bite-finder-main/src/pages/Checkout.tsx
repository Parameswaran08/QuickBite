import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Smartphone, Wallet, Loader2 } from "lucide-react";

interface DeliveryAddress {
  name: string;
  phone: string;
  address: string;
  pincode: string;
}

interface CardDetails {
  cardNumber: string;
  expiry: string;
  cvv: string;
  nameOnCard: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, getDeliveryFee, getTax, getTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    name: "",
    phone: "",
    address: "",
    pincode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card");
  
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: "",
    expiry: "",
    cvv: "",
    nameOnCard: "",
  });

  const [upiId, setUpiId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAddress = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!deliveryAddress.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!/^\d{10}$/.test(deliveryAddress.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!deliveryAddress.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!/^\d{6}$/.test(deliveryAddress.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (paymentMethod === "card") {
      if (!/^\d{16}$/.test(cardDetails.cardNumber.replace(/\s/g, ""))) {
        newErrors.cardNumber = "Card number must be 16 digits";
      }
      if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
        newErrors.expiry = "Expiry must be MM/YY format";
      }
      if (!/^\d{3}$/.test(cardDetails.cvv)) {
        newErrors.cvv = "CVV must be 3 digits";
      }
      if (!cardDetails.nameOnCard.trim()) {
        newErrors.nameOnCard = "Name on card is required";
      }
    } else if (paymentMethod === "upi") {
      if (!upiId.trim() || !upiId.includes("@")) {
        newErrors.upiId = "Valid UPI ID is required";
      }
    }

    setErrors({ ...errors, ...newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateAddress() || !validatePayment()) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields correctly",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate 95% success rate
    const success = Math.random() > 0.05;

    if (success) {
      const orderId = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      // Save order to localStorage
      const order = {
        id: orderId,
        items: items,
        deliveryAddress,
        paymentMethod,
        subtotal: getSubtotal(),
        deliveryFee: getDeliveryFee(),
        tax: getTax(),
        total: getTotal(),
        status: "placed",
        createdAt: new Date().toISOString(),
        estimatedDelivery: "30-35 mins",
      };

      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));

      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    } else {
      setIsProcessing(false);
      toast({
        title: "Payment Failed",
        description: "Payment could not be processed. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const tax = getTax();
  const total = getTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <Button variant="ghost" onClick={() => navigate("/cart")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>

        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-card rounded-xl p-6 border-2 shadow-card">
              <h2 className="text-2xl font-bold mb-4">Delivery Address</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={deliveryAddress.name}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, name: e.target.value })}
                    placeholder="John Doe"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={deliveryAddress.phone}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, phone: e.target.value })}
                    placeholder="9876543210"
                    maxLength={10}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <Label htmlFor="address">Complete Address *</Label>
                  <Input
                    id="address"
                    value={deliveryAddress.address}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, address: e.target.value })}
                    placeholder="123 Main Street, Apartment 4B"
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
                </div>

                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={deliveryAddress.pincode}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })}
                    placeholder="123456"
                    maxLength={6}
                    className={errors.pincode ? "border-red-500" : ""}
                  />
                  {errors.pincode && <p className="text-sm text-red-500 mt-1">{errors.pincode}</p>}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-xl p-6 border-2 shadow-card">
              <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
              <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary cursor-pointer">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5" />
                      <span>Credit/Debit Card</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary cursor-pointer">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Smartphone className="h-5 w-5" />
                      <span>UPI</span>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:border-primary cursor-pointer">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Wallet className="h-5 w-5" />
                      <span>Cash on Delivery</span>
                    </Label>
                  </div>
                </div>
              </RadioGroup>

              {/* Card Details */}
              {paymentMethod === "card" && (
                <div className="mt-6 space-y-4 pt-6 border-t">
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      value={cardDetails.cardNumber}
                      onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                      maxLength={16}
                      className={errors.cardNumber ? "border-red-500" : ""}
                    />
                    {errors.cardNumber && <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry (MM/YY) *</Label>
                      <Input
                        id="expiry"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        placeholder="12/25"
                        maxLength={5}
                        className={errors.expiry ? "border-red-500" : ""}
                      />
                      {errors.expiry && <p className="text-sm text-red-500 mt-1">{errors.expiry}</p>}
                    </div>

                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        type="password"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        placeholder="123"
                        maxLength={3}
                        className={errors.cvv ? "border-red-500" : ""}
                      />
                      {errors.cvv && <p className="text-sm text-red-500 mt-1">{errors.cvv}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="nameOnCard">Name on Card *</Label>
                    <Input
                      id="nameOnCard"
                      value={cardDetails.nameOnCard}
                      onChange={(e) => setCardDetails({ ...cardDetails, nameOnCard: e.target.value })}
                      placeholder="JOHN DOE"
                      className={errors.nameOnCard ? "border-red-500" : ""}
                    />
                    {errors.nameOnCard && <p className="text-sm text-red-500 mt-1">{errors.nameOnCard}</p>}
                  </div>
                </div>
              )}

              {/* UPI Details */}
              {paymentMethod === "upi" && (
                <div className="mt-6 pt-6 border-t">
                  <Label htmlFor="upiId">UPI ID *</Label>
                  <Input
                    id="upiId"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className={errors.upiId ? "border-red-500" : ""}
                  />
                  {errors.upiId && <p className="text-sm text-red-500 mt-1">{errors.upiId}</p>}
                </div>
              )}

              {/* COD Message */}
              {paymentMethod === "cod" && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-muted-foreground">
                    Pay with cash when your order is delivered. Please keep exact change ready.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 border-2 shadow-card sticky top-4">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items ({items.length})</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-medium">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes</span>
                  <span className="font-medium">₹{tax}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{total}</span>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full h-12 text-lg font-bold gradient-primary"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Place Order - ₹${total}`
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
