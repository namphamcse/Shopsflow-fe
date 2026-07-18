import type {
  Cart,
  CartItem,
  Category,
  Order,
  OrderItem,
  OrderStatus,
  PageResponse,
  Product,
  Review,
} from "../types";
import { apiClient } from "./client";

export type ProductFilters = {
  keyword?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string;
};

export type ProductPayload = {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stockQuantity: number;
  categoryIds: number[];
};

type UnknownRecord = Record<string, unknown>;

type RawCartItem = UnknownRecord;
type RawCart = UnknownRecord;

const orderStatuses: OrderStatus[] = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];

function record(value: unknown): UnknownRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : {};
}

function unwrapData(value: unknown): unknown {
  const source = record(value);
  if ("data" in source && source.data !== undefined) return source.data;
  return value;
}

function finiteNumber(value: unknown, fallback = 0) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function nonNegativeNumber(value: unknown, fallback = 0) {
  return Math.max(0, finiteNumber(value, fallback));
}

function nonNegativeInteger(value: unknown, fallback = 0) {
  return Math.max(0, Math.trunc(finiteNumber(value, fallback)));
}

function positiveId(value: unknown): number | null {
  const parsed = finiteNumber(value, Number.NaN);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() || fallback : fallback;
}

function nullableText(value: unknown) {
  const normalized = text(value);
  return normalized || null;
}

function dateText(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return "";
  return Number.isNaN(Date.parse(value)) ? "" : value;
}

function arrayValue(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function normalizeCategory(raw: unknown): Category {
  const source = record(raw);
  return {
    id: positiveId(source.id) ?? 0,
    name: text(source.name, "Unnamed category"),
  };
}

function normalizeProduct(raw: unknown): Product {
  const source = record(raw);
  return {
    id: positiveId(source.id) ?? 0,
    name: text(source.name, "Unnamed product"),
    description: nullableText(source.description),
    price: nonNegativeNumber(source.price),
    imageUrl: nullableText(source.imageUrl),
    stockQuantity: nonNegativeInteger(source.stockQuantity),
    createdAt: dateText(source.createdAt),
    categories: arrayValue(source.categories)
      .map(normalizeCategory)
      .filter((category) => category.id > 0),
  };
}

function normalizeProductPage(raw: unknown, fallbackSize = 12): PageResponse<Product> {
  const source = record(unwrapData(raw));
  const page = record(source.page);
  const content = arrayValue(source.content).map(normalizeProduct).filter((product) => product.id > 0);
  const size = nonNegativeInteger(source.size ?? page.size, fallbackSize) || fallbackSize;
  const number = nonNegativeInteger(source.number ?? page.number, 0);
  const totalElements = nonNegativeInteger(source.totalElements ?? page.totalElements, content.length);
  const computedPages = totalElements > 0 ? Math.ceil(totalElements / size) : 0;
  const totalPages = nonNegativeInteger(source.totalPages ?? page.totalPages, computedPages);
  const first = typeof source.first === "boolean" ? source.first : number === 0;
  const last = typeof source.last === "boolean"
    ? source.last
    : totalPages === 0 || number >= totalPages - 1;
  const empty = typeof source.empty === "boolean" ? source.empty : content.length === 0;

  return { content, totalElements, totalPages, size, number, first, last, empty };
}

function normalizeCart(raw: unknown): Cart {
  const source = record(unwrapData(raw)) as RawCart;
  const rawItems = arrayValue(source.items) as RawCartItem[];

  const items = rawItems.map((item): CartItem => {
    const quantity = Math.max(1, nonNegativeInteger(item.quantity, 1));
    const unitPrice = nonNegativeNumber(item.unitPrice);
    const rawStock = finiteNumber(item.stockQuantity, Number.NaN);
    const stockQuantity = Number.isFinite(rawStock) && rawStock >= 0
      ? Math.trunc(rawStock)
      : null;

    return {
      itemId: positiveId(item.itemId ?? item.id),
      productId: positiveId(item.productId) ?? 0,
      productName: text(item.productName, "Unnamed product"),
      imageUrl: nullableText(item.imageUrl),
      stockQuantity,
      unitPrice,
      quantity,
      subtotal: nonNegativeNumber(item.subtotal, unitPrice * quantity),
    };
  }).filter((item) => item.productId > 0);

  const computedItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const computedPrice = items.reduce((sum, item) => sum + item.subtotal, 0);

  return {
    items,
    totalItems: nonNegativeInteger(source.totalItems, computedItems),
    totalPrice: nonNegativeNumber(source.totalPrice, computedPrice),
  };
}

function normalizeReview(raw: unknown): Review {
  const source = record(raw);
  const stars = Math.min(5, Math.max(1, nonNegativeInteger(source.stars, 1)));
  return {
    id: positiveId(source.id) ?? 0,
    stars,
    comment: nullableText(source.comment),
    createdAt: dateText(source.createdAt),
    userId: positiveId(source.userId) ?? 0,
    userName: text(source.userName, "Customer"),
  };
}

function normalizeOrderItem(raw: unknown): OrderItem {
  const source = record(raw);
  const quantity = Math.max(1, nonNegativeInteger(source.quantity, 1));
  const priceAtPurchase = nonNegativeNumber(source.priceAtPurchase);
  return {
    productId: positiveId(source.productId) ?? 0,
    productName: text(source.productName, "Unnamed product"),
    quantity,
    priceAtPurchase,
    subtotal: nonNegativeNumber(source.subtotal, priceAtPurchase * quantity),
  };
}

function normalizeOrder(raw: unknown): Order {
  const source = record(raw);
  const rawStatus = text(source.status).toUpperCase() as OrderStatus;
  const items = arrayValue(source.items)
    .map(normalizeOrderItem)
    .filter((item) => item.productId > 0);
  const computedItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const computedAmount = items.reduce((sum, item) => sum + item.subtotal, 0);

  return {
    id: positiveId(source.id) ?? 0,
    status: orderStatuses.includes(rawStatus) ? rawStatus : "PENDING",
    totalAmount: nonNegativeNumber(source.totalAmount, computedAmount),
    totalItems: nonNegativeInteger(source.totalItems, computedItems),
    createdAt: dateText(source.createdAt),
    items,
  };
}

function requireEntityId(id: number, entity: string) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Invalid ${entity} id.`);
  }
}

function requireCartItemId(itemId: number) {
  requireEntityId(itemId, "cart item");
}

export async function getProducts(filters: ProductFilters = {}, signal?: AbortSignal) {
  const response = await apiClient.get<unknown>("/products", { params: filters, signal });
  return normalizeProductPage(response.data, filters.size ?? 12);
}

export async function getAllProducts(
  filters: Omit<ProductFilters, "page" | "size"> = {},
  signal?: AbortSignal,
) {
  const products: Product[] = [];
  let page = 0;
  const size = 100;

  while (true) {
    const result = await getProducts({ ...filters, page, size }, signal);
    products.push(...result.content);

    if (result.last || page + 1 >= result.totalPages || result.content.length === 0) break;
    page += 1;
  }

  return products;
}

export async function getProduct(id: number, signal?: AbortSignal) {
  requireEntityId(id, "product");
  const response = await apiClient.get<unknown>(`/products/${id}`, { signal });
  const product = normalizeProduct(unwrapData(response.data));
  if (product.id <= 0) throw new Error("The backend returned an invalid product.");
  return product;
}

export async function createProduct(payload: ProductPayload) {
  const response = await apiClient.post<unknown>("/products", payload);
  const product = normalizeProduct(unwrapData(response.data));
  if (product.id <= 0) throw new Error("The backend returned an invalid product.");
  return product;
}

export async function updateProduct(id: number, payload: ProductPayload) {
  requireEntityId(id, "product");
  const response = await apiClient.put<unknown>(`/products/${id}`, payload);
  const product = normalizeProduct(unwrapData(response.data));
  if (product.id <= 0) throw new Error("The backend returned an invalid product.");
  return product;
}

export async function deleteProduct(id: number) {
  requireEntityId(id, "product");
  await apiClient.delete(`/products/${id}`);
}

export async function getCategories(signal?: AbortSignal) {
  const response = await apiClient.get<unknown>("/categories", { signal });
  const raw = unwrapData(response.data);
  return arrayValue(raw).map(normalizeCategory).filter((category) => category.id > 0);
}

export async function createCategory(name: string) {
  const response = await apiClient.post<unknown>("/categories", { name });
  const category = normalizeCategory(unwrapData(response.data));
  if (category.id <= 0) throw new Error("The backend returned an invalid category.");
  return category;
}

export async function updateCategory(id: number, name: string) {
  requireEntityId(id, "category");
  const response = await apiClient.put<unknown>(`/categories/${id}`, { name });
  const category = normalizeCategory(unwrapData(response.data));
  if (category.id <= 0) throw new Error("The backend returned an invalid category.");
  return category;
}

export async function deleteCategory(id: number) {
  requireEntityId(id, "category");
  await apiClient.delete(`/categories/${id}`);
}

export async function getCart() {
  const response = await apiClient.get<unknown>("/cart");
  return normalizeCart(response.data);
}

export async function addToCart(productId: number, quantity: number) {
  requireEntityId(productId, "product");
  const response = await apiClient.post<unknown>("/cart/items", { productId, quantity });
  return normalizeCart(response.data);
}

export async function updateCartItem(itemId: number, quantity: number) {
  requireCartItemId(itemId);
  const response = await apiClient.put<unknown>(`/cart/items/${itemId}`, { quantity });
  return response.data ? normalizeCart(response.data) : getCart();
}

export async function removeCartItem(itemId: number) {
  requireCartItemId(itemId);
  const response = await apiClient.delete<unknown>(`/cart/items/${itemId}`);
  return response.data ? normalizeCart(response.data) : getCart();
}

export async function getProductReviews(productId: number, signal?: AbortSignal) {
  requireEntityId(productId, "product");
  const response = await apiClient.get<unknown>(`/products/${productId}/reviews`, { signal });
  return arrayValue(unwrapData(response.data))
    .map(normalizeReview)
    .filter((review) => review.id > 0);
}

export async function createReview(productId: number, stars: number, comment: string) {
  requireEntityId(productId, "product");
  const response = await apiClient.post<unknown>(`/products/${productId}/reviews`, { stars, comment });
  const review = normalizeReview(unwrapData(response.data));
  if (review.id <= 0) throw new Error("The backend returned an invalid review.");
  return review;
}

export async function updateReview(reviewId: number, stars: number, comment: string) {
  requireEntityId(reviewId, "review");
  const response = await apiClient.put<unknown>(`/reviews/${reviewId}`, { stars, comment });
  const review = normalizeReview(unwrapData(response.data));
  if (review.id <= 0) throw new Error("The backend returned an invalid review.");
  return review;
}

export async function deleteReview(reviewId: number) {
  requireEntityId(reviewId, "review");
  await apiClient.delete(`/reviews/${reviewId}`);
}

export async function placeOrder() {
  const response = await apiClient.post<unknown>("/orders");
  const order = normalizeOrder(unwrapData(response.data));
  if (order.id <= 0) throw new Error("The backend returned an invalid order.");
  return order;
}

export async function getOrders(signal?: AbortSignal) {
  const response = await apiClient.get<unknown>("/orders", { signal });
  return arrayValue(unwrapData(response.data)).map(normalizeOrder).filter((order) => order.id > 0);
}

export async function getAllOrders(signal?: AbortSignal) {
  const response = await apiClient.get<unknown>("/orders/all", { signal });
  return arrayValue(unwrapData(response.data)).map(normalizeOrder).filter((order) => order.id > 0);
}

export async function updateOrderStatus(id: number, status: OrderStatus) {
  requireEntityId(id, "order");
  const response = await apiClient.put<unknown>(`/orders/${id}/status`, { status });
  const order = normalizeOrder(unwrapData(response.data));
  if (order.id <= 0) throw new Error("The backend returned an invalid order.");
  return order;
}
