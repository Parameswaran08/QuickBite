import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Restaurant } from "@/types/restaurant";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { RestaurantCard } from "@/components/RestaurantCard";
import { RestaurantDetailModal } from "@/components/RestaurantDetailModal";
import { Loader2, UtensilsCrossed } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const { toast } = useToast();

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleCloseModal = () => {
    setSelectedRestaurant(null);
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [searchQuery, selectedCuisine, minRating, restaurants]);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("is_active", true)
        .order("rating", { ascending: false });

      if (error) {
        console.error("Database error:", error);
        
        if (error.message.includes("relation") && error.message.includes("does not exist")) {
          toast({
            title: "Database Not Set Up",
            description: "Please check QUICK_FIX.md or SUPABASE_SETUP.md to set up the database.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error loading restaurants",
            description: error.message,
            variant: "destructive",
          });
        }
        throw error;
      }

      if (data) {
        setRestaurants(data);
        const uniqueCuisines = [...new Set(data.map(r => r.cuisine))];
        setCuisines(uniqueCuisines);
      }
    } catch (error: any) {
      console.error("Failed to load restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterRestaurants = () => {
    let filtered = [...restaurants];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.cuisine.toLowerCase().includes(query)
      );
    }

    if (selectedCuisine !== "all") {
      filtered = filtered.filter((r) => r.cuisine === selectedCuisine);
    }

    if (minRating > 0) {
      filtered = filtered.filter((r) => r.rating >= minRating);
    }

    setFilteredRestaurants(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <Header />
      
      <main className="container mx-auto px-4 py-10">
        {/* Hero section with search */}
        <div className="mb-10 space-y-8 animate-fade-in">
          <div className="text-center space-y-3">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-food-red bg-clip-text text-transparent">
              Hungry? We've got you covered!
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover delicious restaurants and get your favorite food delivered fast
            </p>
          </div>
          
          <div className="flex justify-center">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          
          <div className="flex justify-center">
            <FilterBar
              selectedCuisine={selectedCuisine}
              minRating={minRating}
              onCuisineChange={setSelectedCuisine}
              onRatingChange={setMinRating}
              cuisines={cuisines}
            />
          </div>
        </div>

        {/* Loading state with animation */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-32 animate-fade-in">
            <div className="relative">
              <div className="absolute inset-0 gradient-primary rounded-full blur-xl opacity-50 animate-pulse" />
              <Loader2 className="relative h-16 w-16 animate-spin text-primary" />
            </div>
            <p className="mt-6 text-lg text-muted-foreground font-medium">
              Loading delicious restaurants...
            </p>
          </div>
        )}

        {/* Restaurant grid with staggered animation */}
        {!loading && (
          <>
            {filteredRestaurants.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredRestaurants.map((restaurant, index) => (
                    <div
                      key={restaurant.id}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <RestaurantCard 
                        restaurant={restaurant} 
                        onClick={handleRestaurantClick}
                      />
                    </div>
                  ))}
                </div>
                
                {/* Results summary with style */}
                <div className="mt-10 text-center">
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card/50 backdrop-blur-sm border-2 shadow-card">
                    <UtensilsCrossed className="h-5 w-5 text-primary" />
                    <p className="text-sm font-medium">
                      Showing <span className="font-bold text-primary">{filteredRestaurants.length}</span> of{" "}
                      <span className="font-bold">{restaurants.length}</span> restaurants
                    </p>
                  </div>
                </div>
              </>
            ) : restaurants.length === 0 ? (
              <div className="text-center py-32 animate-fade-in">
                <div className="mb-6">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <UtensilsCrossed className="h-10 w-10 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">No restaurants available</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  Unable to load restaurants. The database may not be set up yet.
                </p>
                <button
                  onClick={loadRestaurants}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Retry Loading
                </button>
              </div>
            ) : (
              <div className="text-center py-32 animate-fade-in">
                <div className="mb-6">
                  <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <UtensilsCrossed className="h-10 w-10 text-muted-foreground" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">No restaurants found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We couldn't find any restaurants matching your criteria. Try adjusting your filters or search query.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Restaurant Detail Modal */}
      <RestaurantDetailModal
        restaurant={selectedRestaurant}
        isOpen={selectedRestaurant !== null}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Index;
