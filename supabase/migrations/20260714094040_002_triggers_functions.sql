/*
# Glam & Glow — Triggers & Functions (Part 2)

## Overview
Adds database functions and triggers for:
1. Auto-generating human-readable order numbers (GG-YYYYMMDD-NNN)
2. Auto-upserting customer records when orders are created

## Changes
- generate_order_number() function
- set_order_number() trigger function + trigger on orders
- upsert_customer_from_order() trigger function + trigger on orders
- Unique index on customers.phone for ON CONFLICT support
*/

CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_phone_unique ON customers (phone);

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  date_part text;
  seq int;
  order_num text;
BEGIN
  date_part := to_char(now(), 'YYYYMMDD');
  SELECT COALESCE(max(seq), 0) + 1 INTO seq
  FROM orders
  WHERE order_number LIKE 'GG-' || date_part || '-%';
  order_num := 'GG-' || date_part || '-' || lpad(seq::text, 3, '0');
  RETURN order_num;
END;
$$;

CREATE OR REPLACE FUNCTION set_order_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_order_number ON orders;
CREATE TRIGGER trg_set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION set_order_number();

CREATE OR REPLACE FUNCTION upsert_customer_from_order()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO customers (name, phone, email, location, total_orders, total_spent, created_at)
  VALUES (
    NEW.customer_name,
    NEW.customer_phone,
    NEW.customer_email,
    NEW.delivery_area,
    1,
    NEW.grand_total,
    NEW.created_at
  )
  ON CONFLICT (phone) DO UPDATE
  SET
    total_orders = customers.total_orders + 1,
    total_spent = customers.total_spent + NEW.grand_total,
    name = COALESCE(NEW.customer_name, customers.name),
    email = COALESCE(NEW.customer_email, customers.email),
    location = COALESCE(NEW.delivery_area, customers.location);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_upsert_customer ON orders;
CREATE TRIGGER trg_upsert_customer
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION upsert_customer_from_order();
