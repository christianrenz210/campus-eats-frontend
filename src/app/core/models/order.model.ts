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
  lines: NewOrderLine[];
}

export interface OrderLine {
  itemId: number;
  quantity: number;
  name?: string;
  price?: number;
}

export interface Order {
  id: number;
  reference: string;
  status: string;
  customerName: string;
  roomOrStall: string;
  lines: OrderLine[];
  createdAt: string;
  total?: number;
}
