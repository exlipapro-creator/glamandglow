export interface Collection {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  hero_image_url: string
  sort_order: number
  is_published: boolean
  created_at: string
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  category: string
  collection_id: string | null
  short_description: string
  description: string
  notes: string
  volume: string
  price: number
  compare_at_price: number | null
  images: string[]
  rating: number
  review_count: number
  badges: string[]
  is_published: boolean
  sort_order: number
  created_at: string
  collections: Collection | null
}

export interface Campaign {
  id: string
  slug: string
  title: string
  subtitle: string
  body: string
  hero_image_url: string
  cta_label: string
  cta_link: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface Testimonial {
  id: string
  name: string
  location: string
  rating: number
  quote: string
  product_name: string
  sort_order: number
  is_published: boolean
}

export interface Customer {
  id: string
  name: string
  phone: string
  email: string | null
  location: string
  total_orders: number
  total_spent: number
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  price: number
  quantity: number
  subtotal: number
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  delivery_area: string
  delivery_address: string
  notes: string | null
  items_total: number
  delivery_fee: number
  grand_total: number
  status: string
  payment_method: string
  created_at: string
  order_items: OrderItem[]
}

export interface StoreSettings {
  id: string
  key: string
  value: string
  label: string
  type: string
}

export interface CartItem {
  product: Product
  quantity: number
}
