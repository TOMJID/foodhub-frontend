export interface UserWithExtras {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role?: string;
  address?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface OrderItem {
  id: string;
  mealId: string;
  quantity: number;
  priceAtTime: number;
  meal: {
    id: string;
    name: string;
    imageUrl?: string | null;
  };
}

export interface Order {
  id: string;
  status: string;
  totalAmount: number;
  deliveryAddress?: string;
  createdAt: string;
  items: OrderItem[];
  customerId?: string;
  providerId?: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  provider?: {
    id: string;
    restaurantName: string;
    cuisineType: string;
    address: string;
  };
}

export interface ProviderProfile {
  id: string;
  userId: string;
  restaurantName: string;
  cuisineType: string;
  address: string;
  coverImageUrl?: string | null;
  meals: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
    isAvailable: boolean;
    category: {
      name: string;
    };
  }[];
}
