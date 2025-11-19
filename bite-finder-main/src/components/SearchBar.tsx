import { Search, Sparkles } from "lucide-react";
import { Input } from "./ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

// Enhanced search bar with visual effects
export const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-3xl group">
      <div className="absolute -inset-1 gradient-primary rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
        <Input
          type="text"
          placeholder="Search for restaurants, cuisines, dishes..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-12 pr-12 h-14 text-base border-2 rounded-2xl bg-card/50 backdrop-blur-sm focus:border-primary focus:shadow-glow transition-all duration-300"
        />
        {value && (
          <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-food-yellow fill-food-yellow animate-pulse" />
        )}
      </div>
    </div>
  );
};
