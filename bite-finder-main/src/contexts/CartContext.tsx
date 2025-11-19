import { createContext, useContext, useState, ReactNode } from "react";
import { Restaurant } from "@/types/restaurant";

export interface CartItem {
  restaurant: Restaurant;
  quantity: number;
  price: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (restaurant: Restaurant) => void;
  removeItem: (restaurantId: string) => void;
  updateQuantity: (restaurantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTax: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (restaurant: Restaurant) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.restaurant.id === restaurant.id
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.restaurant.id === restaurant.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prevItems,
        {
          restaurant,
          quantity: 1,
          price: restaurant.cost_for_two,
        },
      ];
    });
  };

  const removeItem = (restaurantId: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.restaurant.id !== restaurantId)
    );
  };

  const updateQuantity = (restaurantId: string, quantity: number) => {
    if (quantity < 1) return;

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.restaurant.id === restaurantId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getDeliveryFee = () => {
    return items.length > 0 ? 40 : 0;
  };

  const getTax = () => {
    const subtotal = getSubtotal();
    return Math.round(subtotal * 0.05);
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryFee() + getTax();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getSubtotal,
        getDeliveryFee,
        getTax,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
