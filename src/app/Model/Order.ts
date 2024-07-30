export interface Order {
  _id: string;
  _rev?: string; // _rev optional yapıldı, çünkü yeni oluşturulan belgelerde olmayabilir
  id: string;
  type: string; // 'order'
  table_id: string;
  user_id: string;
  place_id: string

  date: string;
  products: Array<{
    product_id: string;
    quantity: number;
    price_per_unit: number;
  }>;
  total_price: number;
  
  status: string; // 'completed', 'pending', 'canceled', vb.
}
