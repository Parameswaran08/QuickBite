import { UtensilsCrossed, Sparkles, ShoppingCart, User, LogIn } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

// Immersive header with gradient and glow effects
export const Header = () => {
  const navigate = useNavigate();
  const { items } = useCart();
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="border-b sticky top-0 z-50 backdrop-blur-xl bg-card/80">
      <div className="gradient-primary h-1 w-full" />
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="relative">
              <div className="absolute inset-0 gradient-primary rounded-xl blur-md opacity-60 animate-pulse" />
              <div className="relative h-12 w-12 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                <UtensilsCrossed className="h-7 w-7 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-food-red to-primary bg-clip-text text-transparent">
                  QuickBite
                </h1>
                <Sparkles className="h-5 w-5 text-food-yellow fill-food-yellow animate-pulse" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Discover amazing food near you
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <Button
              variant="outline"
              size="icon"
              className="relative"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                  {items.length}
                </span>
              )}
            </Button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <Button
                variant="outline"
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="gradient-primary flex items-center gap-2"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
