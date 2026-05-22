export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      order_items: {
        Row: {
          id: string;
          order_id: string;
          variant_id: string | null;
          product_name: string;
          product_image: string | null;
          size: string;
          color: string | null;
          unit_price: number;
          quantity: number;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          order_id: string;
          variant_id?: string | null;
          product_name: string;
          product_image?: string | null;
          size: string;
          color?: string | null;
          unit_price: number;
          quantity: number;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          order_id?: string;
          variant_id?: string | null;
          product_name?: string;
          product_image?: string | null;
          size?: string;
          color?: string | null;
          unit_price?: number;
          quantity?: number;
          created_at?: string | null;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          customer_name: string;
          customer_phone: string;
          customer_email: string | null;
          status: string;
          total_amount: number;
          notes: string | null;
          created_at: string | null;
          updated_at: string | null;
          address_id: string | null;
          shipping_snapshot: Json;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          customer_name: string;
          customer_phone: string;
          customer_email?: string | null;
          status: string;
          total_amount: number;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          address_id?: string | null;
          shipping_snapshot: Json;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          customer_name?: string;
          customer_phone?: string;
          customer_email?: string | null;
          status?: string;
          total_amount?: number;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          address_id?: string | null;
          shipping_snapshot?: Json;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt_text: string | null;
          sort_order: number | null;
          is_primary: number;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt_text?: string | null;
          sort_order?: number | null;
          is_primary: number;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          product_id?: string;
          url?: string;
          alt_text?: string | null;
          sort_order?: number | null;
          is_primary?: number;
          created_at?: string | null;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          size: string;
          color: string | null;
          color_hex: string | null;
          stock_qty: number;
          price: number | null;
          sku: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          size: string;
          color?: string | null;
          color_hex?: string | null;
          stock_qty: number;
          price?: number | null;
          sku?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          product_id?: string;
          size?: string;
          color?: string | null;
          color_hex?: string | null;
          stock_qty?: number;
          price?: number | null;
          sku?: string | null;
          created_at?: string | null;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          category_slug: string;
          base_price: number;
          is_active: number;
          meta_title: string | null;
          meta_description: string | null;
          created_at: string | null;
          updated_at: string | null;
          search_vector: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          category_slug: string;
          base_price: number;
          is_active: number;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          search_vector?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          category_slug?: string;
          base_price?: number;
          is_active?: number;
          meta_title?: string | null;
          meta_description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          search_vector?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          is_admin: number;
          created_at: string | null;
          updated_at: string | null;
          avatar_url: string | null;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          is_admin: number;
          created_at?: string | null;
          updated_at?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          phone?: string | null;
          is_admin?: number;
          created_at?: string | null;
          updated_at?: string | null;
          avatar_url?: string | null;
        };
      };
      user_addresses: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string;
          phone: string;
          division: string;
          district: string;
          upazila: string | null;
          thana: string | null;
          address: string;
          postal_code: string | null;
          is_default: number;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          full_name: string;
          phone: string;
          division: string;
          district: string;
          upazila?: string | null;
          thana?: string | null;
          address: string;
          postal_code?: string | null;
          is_default: number;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          full_name?: string;
          phone?: string;
          division?: string;
          district?: string;
          upazila?: string | null;
          thana?: string | null;
          address?: string;
          postal_code?: string | null;
          is_default?: number;
          created_at?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Convenience types
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type ProductImage =
  Database["public"]["Tables"]["product_images"]["Row"];
export type ProductVariant =
  Database["public"]["Tables"]["product_variants"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type UserAddress = Database["public"]["Tables"]["user_addresses"]["Row"];
