import { Restaurant } from "@/types/restaurant";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { X, Star, Clock, MapPin, Leaf, TrendingUp, Utensils, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

interface RestaurantDetailModalProps {
  restaurant: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper functions
const getDescription = (cuisine: string): string => {
  const descriptions: Record<string, string> = {
    Italian: "Experience authentic Italian flavors with our handcrafted pizzas, fresh pasta, and traditional recipes passed down through generations. Every dish is prepared with love and the finest ingredients.",
    Indian: "Savor the rich spices and aromas of India with our carefully curated menu. From creamy curries to tandoori specialties, each dish brings the authentic taste of Indian cuisine to your table.",
    American: "Enjoy classic American comfort food with a modern twist. Our burgers, fries, and shakes are made fresh daily using premium ingredients for that perfect taste you crave.",
    Japanese: "Discover the art of Japanese cuisine with our expertly crafted sushi, sashimi, and traditional dishes. Fresh fish and authentic preparation methods ensure an unforgettable dining experience.",
    Mexican: "Indulge in the vibrant flavors of Mexico with our tacos, burritos, and authentic Mexican specialties. Fresh ingredients and traditional recipes bring the fiesta to your plate.",
    Healthy: "Nourish your body with our wholesome, nutritious meals. We use organic ingredients and balanced recipes to create delicious dishes that are as good for you as they taste.",
    Chinese: "Experience the diverse flavors of Chinese cuisine with our wok-tossed noodles, dumplings, and regional specialties. Each dish is prepared with authentic techniques and fresh ingredients.",
    Mediterranean: "Enjoy the fresh, healthy flavors of the Mediterranean with our selection of grilled meats, fresh salads, and traditional dishes. Every bite transports you to the sunny shores of the Med.",
  };
  return descriptions[cuisine] || "Discover delicious food prepared with passion and the finest ingredients. Our menu offers a variety of dishes to satisfy every craving.";
};

const getMenuHighlights = (cuisine: string): string[] => {
  const menus: Record<string, string[]> = {
    Italian: ["Margherita Pizza", "Pasta Carbonara", "Tiramisu", "Bruschetta"],
    Indian: ["Butter Chicken", "Biryani", "Naan Bread", "Paneer Tikka"],
    American: ["Classic Burger", "Crispy Fries", "Milkshake", "BBQ Wings"],
    Japanese: ["California Roll", "Salmon Sashimi", "Miso Soup", "Tempura"],
    Mexican: ["Tacos al Pastor", "Burrito Bowl", "Guacamole", "Quesadilla"],
    Healthy: ["Quinoa Bowl", "Green Smoothie", "Avocado Toast", "Fresh Salad"],
    Chinese: ["Kung Pao Chicken", "Fried Rice", "Spring Rolls", "Dumplings"],
    Mediterranean: ["Falafel Wrap", "Greek Salad", "Hummus Platter", "Grilled Kebab"],
  };
  return menus[cuisine] || ["Chef's Special", "House Favorite", "Signature Dish"];
};

export const RestaurantDetailModal = ({
  restaurant,
  isOpen,
  onClose,
}: RestaurantDetailModalProps) => {
  const { toast } = useToast();
  const { addItem } = useCart();
  const navigate = useNavigate();

  if (!restaurant) return null;

  const formattedPrice = `₹${restaurant.cost_for_two}`;
  const isHighRated = restaurant.rating >= 4.5;
  const description = getDescription(restaurant.cuisine);
  const menuHighlights = getMenuHighlights(restaurant.cuisine);

  const handleOrderNow = () => {
    addItem(restaurant);
    toast({
      title: "Added to Cart!",
      description: `${restaurant.name} has been added to your cart.`,
    });
    onClose();
    navigate("/cart");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Hero Image Section */}
        <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
          <img
            src={restaurant.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4";
            }}
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-lg"
          >
            <X className="h-5 w-5 text-gray-800" />
          </button>
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {restaurant.is_veg && (
              <Badge className="bg-food-green text-white shadow-lg">
                <Leaf className="h-3 w-3 mr-1" />
                Pure Veg
              </Badge>
            )}
            {isHighRated && (
              <Badge className="gradient-primary text-white shadow-lg">
                <TrendingUp className="h-3 w-3 mr-1" />
                Top Rated
              </Badge>
            )}
          </div>
        </div>

        {/* Restaurant Information */}
        <div className="p-6 space-y-6">
          {/* Restaurant Header */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {restaurant.name}
            </h2>
            <p className="text-lg text-muted-foreground font-medium">
              {restaurant.cuisine} Cuisine
            </p>
          </div>

          {/* Restaurant Stats */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-food-yellow/10 border border-food-yellow/20">
              <Star className="h-4 w-4 fill-food-yellow text-food-yellow" />
              <span className="font-bold text-sm">{restaurant.rating}</span>
            </div>
            
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{restaurant.delivery_time}</span>
            </div>

            <div className="px-4 py-1.5 rounded-lg gradient-primary">
              <span className="font-bold text-white">{formattedPrice} for two</span>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{restaurant.address}</span>
          </div>

          {/* Description */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Utensils className="h-5 w-5 text-primary" />
              About
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* Menu Highlights */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Utensils className="h-5 w-5 text-primary" />
              Menu Highlights
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {menuHighlights.map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Special Features */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-bold mb-3">Special Features</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-card border hover:border-primary transition-colors">
                <Zap className="h-5 w-5 text-food-yellow" />
                <span className="text-sm font-medium">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-card border hover:border-primary transition-colors">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Contactless</span>
              </div>
              {isHighRated && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-card border hover:border-primary transition-colors">
                  <Star className="h-5 w-5 text-food-yellow fill-food-yellow" />
                  <span className="text-sm font-medium">Top Rated</span>
                </div>
              )}
              {restaurant.is_veg && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-card border hover:border-primary transition-colors">
                  <Leaf className="h-5 w-5 text-food-green" />
                  <span className="text-sm font-medium">Pure Veg</span>
                </div>
              )}
            </div>
          </div>

          {/* Order Button */}
          <div className="border-t pt-6">
            <Button
              onClick={handleOrderNow}
              className="w-full h-14 text-lg font-bold gradient-primary hover:opacity-90 transition-opacity"
            >
              Order Now - {formattedPrice} for two
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
