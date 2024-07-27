export interface Order {
  _id: string;
  _rev?: string; // _rev optional yapıldı, çünkü yeni oluşturulan belgelerde olmayabilir
  type: string; // 'order'
  table_id: string;
  date: string;
  items: Array<{
    product_id: string;
    quantity: number;
    price_per_unit: number;
  }>;
  total_amount: number;
  status: string; // 'completed', 'pending', 'canceled', vb.
}
