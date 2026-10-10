export type CardMaterial = 'matte_black' | 'metallic_silver' | 'bamboo_wood' | 'custom_print';
export type OrderStatus = 'pending' | 'processing' | 'encoded' | 'shipped' | 'delivered' | 'cancelled';

export interface CardOrder {
  orderId: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  cardType: CardMaterial;
  quantity: number;
  status: OrderStatus;
  amount: number;
  currency: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  createdAt: string;
  updatedAt?: string;
}
