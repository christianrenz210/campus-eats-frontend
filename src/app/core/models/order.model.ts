import { MenuItem } from './menu-item.model';

export interface CartLine {
  item: MenuItem;
  quantity: number;
}

export interface NewOrderLine {
  itemId: number;
  quantity: number;
}

export interface NewOrder {
  customerName: string;
  roomOrStall: string;
  notes?: string;
  lines: NewOrderLine[];
}

export type OrderStatus =
  | 'pending' | 'preparing' | 'ready'
  | 'delivered' | 'cancelled';

export interface OrderLine {
  itemId: number;
  quantity: number;
  name: string;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  reference: string;
  status: OrderStatus;
  customerName: string;
  roomOrStall: string;
  notes: string;
  lines: OrderLine[];
  total: number;
  placedAt: string;
}
