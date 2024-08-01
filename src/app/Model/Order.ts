export interface Product_{
  id: string;
  name: string;
  per_price: number;
  quantity: number;
}


export interface Order {
  _id: string;
  _rev?: string;
  id: string;
  type: string; // 'order'
  user_id: string|null;
  products: Product_[];
  date: string;
  status: string; // 'completed', 'pending', 'canceled', vb.
  total_price: number;
  table_id: string;
  place_id: string;
}
