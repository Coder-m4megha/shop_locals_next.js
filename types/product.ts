export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  fabric: string;
  color: string;
  occasion: string;
  isNew: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}