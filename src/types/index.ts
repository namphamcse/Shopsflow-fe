export type Role = "ADMIN" | "USER";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  stockQuantity: number;
  createdAt: string;
  categories: Category[];
};

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

export type CartItem = {
  itemId: number | null;
  productId: number;
  productName: string;
  imageUrl: string | null;
  stockQuantity: number | null;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

export type Cart = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
};

export type Review = {
  id: number;
  stars: number;
  comment: string | null;
  createdAt: string;
  userId: number;
  userName: string;
};

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type OrderItem = {
  productId: number;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
  subtotal: number;
};

export type Order = {
  id: number;
  status: OrderStatus;
  totalAmount: number;
  totalItems: number;
  createdAt: string;
  items: OrderItem[];
};

export type ApiError = {
  status?: number;
  message?: string;
  fieldErrors?: Record<string, string> | null;
};
