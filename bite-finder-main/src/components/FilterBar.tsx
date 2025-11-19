import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Filter } from "lucide-react";

interface FilterBarProps {
  selectedCuisine: string;
  minRating: number;
  onCuisineChange: (cuisine: string) => void;
  onRatingChange: (rating: number) => void;
  cuisines: string[];
}

// Enhanced filter bar with animations
export const FilterBar = ({ 
  selectedCuisine, 
  minRating, 
  onCuisineChange, 
  onRatingChange,
  cuisines 
}: FilterBarProps) => {
  
  const ratings = [0, 3.5, 4.0, 4.5];
  
  return (
    <div className="flex flex-wrap gap-4 items-center p-6 rounded-2xl bg-card/50 backdrop-blur-sm border-2 shadow-card">
      <div className="flex items-center gap-2 text-primary">
        <Filter className="h-5 w-5" />
        <span className="font-semibold">Filters:</span>
      </div>
      
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-foreground">Cuisine</span>
        <Select value={selectedCuisine} onValueChange={onCuisineChange}>
          <SelectTrigger className="w-[180px] border-2 rounded-xl hover:border-primary transition-colors">
            <SelectValue placeholder="All cuisines" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cuisines</SelectItem>
            {cuisines.map((cuisine) => (
              <SelectItem key={cuisine} value={cuisine}>
                {cuisine}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm font-medium text-foreground">Rating</span>
        <div className="flex gap-2">
          {ratings.map((rating) => (
            <Button
              key={rating}
              variant={minRating === rating ? "default" : "outline"}
              size="sm"
              onClick={() => onRatingChange(rating)}
              className={`min-w-[65px] rounded-xl transition-all duration-300 ${
                minRating === rating 
                  ? "shadow-glow" 
                  : "hover:border-primary hover:scale-105"
              }`}
            >
              {rating === 0 ? "Any" : `${rating}+ ⭐`}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
