// src/lib/enums.ts

export enum Role {
  ADMIN = "ADMIN",
  STAFF = "STAFF",
  CUSTOMER = "CUSTOMER"
}

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED"
}

export enum DeliveryMethod {
  HOME_DELIVERY = "HOME_DELIVERY",
  STORE_PICKUP = "STORE_PICKUP"
}