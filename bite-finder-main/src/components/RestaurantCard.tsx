import { Star, Clock, Leaf, TrendingUp } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Restaurant } from "@/types/restaurant";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick?: (restaurant: Restaurant) => void;
}

// Immersive restaurant card with rich effects
export const RestaurantCard = ({ restaurant, onClick }: RestaurantCardProps) => {
  const formattedPrice = `₹${restaurant.cost_for_two}`;
  const isHighRated = restaurant.rating >= 4.5;

  const handleClick = () => {
    onClick?.(restaurant);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.(restaurant);
    }
  };
  
  return (
    <Card 
      className="overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer group border-2 hover:border-primary/50 hover:-translate-y-2 animate-fade-in"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      {/* Image with overlay effect */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={restaurant.image_url || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4";
          }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {restaurant.is_veg && (
            <Badge className="bg-food-green text-white shadow-lg backdrop-blur-sm">
              <Leaf className="h-3 w-3 mr-1" />
              Pure Veg
            </Badge>
          )}
          {isHighRated && (
            <Badge className="gradient-primary text-white shadow-lg animate-pulse">
              <TrendingUp className="h-3 w-3 mr-1" />
              Top Rated
            </Badge>
          )}
        </div>
        
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 animate-shimmer opacity-0 group-hover:opacity-100 pointer-events-none" />
      </div>

      <CardContent className="p-5">
        {/* Restaurant name with gradient on hover */}
        <div className="mb-3">
          <h3 className="font-bold text-xl text-card-foreground mb-1 line-clamp-1 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-food-red group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {restaurant.name}
          </h3>
          <p className="text-sm text-muted-foreground font-medium">{restaurant.cuisine}</p>
        </div>

        {/* Rating and delivery with enhanced styling */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-food-yellow/10 border border-food-yellow/20">
            <Star className="h-4 w-4 fill-food-yellow text-food-yellow" />
            <span className="font-bold text-sm">{restaurant.rating}</span>
          </div>
          
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{restaurant.delivery_time}</span>
          </div>
        </div>

        {/* Price with gradient background */}
        <div className="flex justify-between items-center pt-3 border-t-2">
          <span className="text-sm text-muted-foreground font-medium">Cost for two</span>
          <div className="px-4 py-1.5 rounded-lg gradient-primary">
            <span className="font-bold text-white">{formattedPrice}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
