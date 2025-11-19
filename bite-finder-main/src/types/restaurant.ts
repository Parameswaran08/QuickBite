export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  delivery_time: string;
  image_url: string | null;
  address: string;
  cost_for_two: number;
  is_veg: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RestaurantFilters {
  searchQuery?: string;
  cuisine?: string;
  minRating?: number;
}
