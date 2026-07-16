import { supabase } from './supabase'
import type { Product, Collection, Campaign, Testimonial, Order, OrderItem } from '../types'

// ---- Collections ----
export async function fetchCollections(): Promise<Collection[]> {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('is_published', true)
    .order('sort_order')
  if (error) throw error
  return data as Collection[]
}

export async function fetchCollectionBySlug(slug: string): Promise<Collection | null> {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()
  if (error) throw error
  return data as Collection | null
}

// ---- Products ----
export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, collections(*)')
    .eq('is_published', true)
    .order('sort_order')
  if (error) throw error
  return data as Product[]
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, collections(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .maybeSingle()
  if (error) throw error
  return data as Product | null
}

export async function fetchProductsByCollection(collectionId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, collections(*)')
    .eq('collection_id', collectionId)
    .eq('is_published', true)
    .order('sort_order')
  if (error) throw error
  return data as Product[]
}

export async function fetchNewArrivals(limit = 8): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, collections(*)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data as Product[]
}

export async function fetchBestSellers(limit = 8): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, collections(*)')
    .eq('is_published', true)
    .contains('badges', ['Best Seller'])
    .order('rating', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data as Product[]
}

export async function fetchRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*, collections(*)')
    .eq('is_published', true)
    .neq('id', product.id)
    .limit(limit)

  if (product.collection_id) {
    query = query.eq('collection_id', product.collection_id)
  } else {
    query = query.eq('category', product.category)
  }

  const { data, error } = await query
  if (error) throw error
  return data as Product[]
}

// ---- Campaigns ----
export async function fetchCampaigns(): Promise<Campaign[]> {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  if (error) throw error
  return data as Campaign[]
}

// ---- Testimonials ----
export async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_published', true)
    .order('sort_order')
  if (error) throw error
  return data as Testimonial[]
}

// ---- Orders ----
export async function createOrder(
  order: {
    customer_name: string
    customer_phone: string
    customer_email: string | null
    delivery_area: string
    delivery_address: string
    notes: string | null
    items_total: number
    delivery_fee: number
    grand_total: number
    payment_method: string
  },
  items: Omit<OrderItem, 'id' | 'order_id'>[]
): Promise<Order> {
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert(order)
    .select()
    .single()
  if (orderError) throw orderError
  const created = orderData as Order

  const itemsWithOrderId = items.map((item) => ({ ...item, order_id: created.id }))
  const { error: itemsError } = await supabase.from('order_items').insert(itemsWithOrderId)
  if (itemsError) throw itemsError

  return created
}
