export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      order_items: {
        Row: {
          color: string | null;
          created_at: string | null;
          id: string;
          order_id: string;
          product_image: string | null;
          product_name: string;
          quantity: number;
          size: string;
          unit_price: number;
          variant_id: string | null;
        };
        Insert: {
          color?: string | null;
          created_at?: string | null;
          id?: string;
          order_id: string;
          product_image?: string | null;
          product_name: string;
          quantity: number;
          size: string;
          unit_price: number;
          variant_id?: string | null;
        };
        Update: {
          color?: string | null;
          created_at?: string | null;
          id?: string;
          order_id?: string;
          product_image?: string | null;
          product_name?: string;
          quantity?: number;
          size?: string;
          unit_price?: number;
          variant_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          address_id: string | null;
          created_at: string | null;
          customer_email: string | null;
          customer_name: string;
          customer_phone: string;
          id: string;
          notes: string | null;
          shipping_snapshot: Json;
          status: string;
          total_amount: number;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          address_id?: string | null;
          created_at?: string | null;
          customer_email?: string | null;
          customer_name: string;
          customer_phone: string;
          id?: string;
          notes?: string | null;
          shipping_snapshot?: Json;
          status?: string;
          total_amount: number;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          address_id?: string | null;
          created_at?: string | null;
          customer_email?: string | null;
          customer_name?: string;
          customer_phone?: string;
          id?: string;
          notes?: string | null;
          shipping_snapshot?: Json;
          status?: string;
          total_amount?: number;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey";
            columns: ["address_id"];
            isOneToOne: false;
            referencedRelation: "user_addresses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          alt_text: string | null;
          created_at: string | null;
          id: string;
          is_primary: number;
          product_id: string;
          sort_order: number | null;
          url: string;
        };
        Insert: {
          alt_text?: string | null;
          created_at?: string | null;
          id?: string;
          is_primary?: number;
          product_id: string;
          sort_order?: number | null;
          url: string;
        };
        Update: {
          alt_text?: string | null;
          created_at?: string | null;
          id?: string;
          is_primary?: number;
          product_id?: string;
          sort_order?: number | null;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_variants: {
        Row: {
          color: string | null;
          color_hex: string | null;
          created_at: string | null;
          id: string;
          price: number | null;
          product_id: string;
          size: string;
          sku: string | null;
          stock_qty: number;
        };
        Insert: {
          color?: string | null;
          color_hex?: string | null;
          created_at?: string | null;
          id?: string;
          price?: number | null;
          product_id: string;
          size?: string;
          sku?: string | null;
          stock_qty?: number;
        };
        Update: {
          color?: string | null;
          color_hex?: string | null;
          created_at?: string | null;
          id?: string;
          price?: number | null;
          product_id?: string;
          size?: string;
          sku?: string | null;
          stock_qty?: number;
        };
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          base_price: number;
          category_slug: string;
          created_at: string | null;
          description: string | null;
          id: string;
          is_active: number;
          meta_description: string | null;
          meta_title: string | null;
          name: string;
          search_vector: unknown;
          slug: string;
          updated_at: string | null;
        };
        Insert: {
          base_price: number;
          category_slug: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: number;
          meta_description?: string | null;
          meta_title?: string | null;
          name: string;
          search_vector?: unknown;
          slug: string;
          updated_at?: string | null;
        };
        Update: {
          base_price?: number;
          category_slug?: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          is_active?: number;
          meta_description?: string | null;
          meta_title?: string | null;
          name?: string;
          search_vector?: unknown;
          slug?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          full_name: string | null;
          id: string;
          is_admin: number;
          phone: string | null;
          updated_at: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          full_name?: string | null;
          id: string;
          is_admin?: number;
          phone?: string | null;
          updated_at?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          full_name?: string | null;
          id?: string;
          is_admin?: number;
          phone?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      user_addresses: {
        Row: {
          address: string;
          created_at: string | null;
          district: string;
          division: string;
          full_name: string;
          id: string;
          is_default: number;
          phone: string;
          postal_code: string | null;
          thana: string | null;
          upazila: string | null;
          user_id: string | null;
        };
        Insert: {
          address: string;
          created_at?: string | null;
          district: string;
          division: string;
          full_name: string;
          id?: string;
          is_default?: number;
          phone: string;
          postal_code?: string | null;
          thana?: string | null;
          upazila?: string | null;
          user_id?: string | null;
        };
        Update: {
          address?: string;
          created_at?: string | null;
          district?: string;
          division?: string;
          full_name?: string;
          id?: string;
          is_default?: number;
          phone?: string;
          postal_code?: string | null;
          thana?: string | null;
          upazila?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_addresses_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      decrement_stock: {
        Args: { p_quantity: number; p_variant_id: string };
        Returns: undefined;
      };
      is_admin: { Args: never; Returns: boolean };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
