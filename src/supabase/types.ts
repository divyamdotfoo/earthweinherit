export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      carbon_conc: {
        Row: {
          value: number;
          year: number;
        };
        Insert: {
          value: number;
          year?: number;
        };
        Update: {
          value?: number;
          year?: number;
        };
        Relationships: [];
      };
      chat: {
        Row: {
          createdat: string | null;
          id: string;
          title: string;
          userid: string;
        };
        Insert: {
          createdat?: string | null;
          id: string;
          title: string;
          userid: string;
        };
        Update: {
          createdat?: string | null;
          id?: string;
          title?: string;
          userid?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_userid_fkey";
            columns: ["userid"];
            isOneToOne: false;
            referencedRelation: "user";
            referencedColumns: ["id"];
          }
        ];
      };
      ice_extent: {
        Row: {
          value: number;
          year: number;
        };
        Insert: {
          value: number;
          year?: number;
        };
        Update: {
          value?: number;
          year?: number;
        };
        Relationships: [];
      };
      mean_sea: {
        Row: {
          value: number;
          year: number;
        };
        Insert: {
          value: number;
          year?: number;
        };
        Update: {
          value?: number;
          year?: number;
        };
        Relationships: [];
      };
      mean_temp: {
        Row: {
          value: number;
          year: number;
        };
        Insert: {
          value: number;
          year?: number;
        };
        Update: {
          value?: number;
          year?: number;
        };
        Relationships: [];
      };
      message: {
        Row: {
          annotations: Json | null;
          chatid: string;
          content: string;
          createdat: string | null;
          id: string;
          role: string;
        };
        Insert: {
          annotations?: Json | null;
          chatid: string;
          content: string;
          createdat?: string | null;
          id?: string;
          role: string;
        };
        Update: {
          annotations?: Json | null;
          chatid?: string;
          content?: string;
          createdat?: string | null;
          id?: string;
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: "message_chatid_fkey";
            columns: ["chatid"];
            isOneToOne: false;
            referencedRelation: "chat";
            referencedColumns: ["id"];
          }
        ];
      };
      page: {
        Row: {
          content: string | null;
          embedding: string | null;
          id: number;
          img: string | null;
          report_name: string | null;
          report_url: string | null;
          token_count: number | null;
          type: string | null;
        };
        Insert: {
          content?: string | null;
          embedding?: string | null;
          id?: number;
          img?: string | null;
          report_name?: string | null;
          report_url?: string | null;
          token_count?: number | null;
          type?: string | null;
        };
        Update: {
          content?: string | null;
          embedding?: string | null;
          id?: number;
          img?: string | null;
          report_name?: string | null;
          report_url?: string | null;
          token_count?: number | null;
          type?: string | null;
        };
        Relationships: [];
      };
      page_duplicate: {
        Row: {
          content: string | null;
          embedding: string | null;
          id: number;
          img: string | null;
          report_name: string | null;
          report_url: string | null;
          token_count: number | null;
          type: string | null;
        };
        Insert: {
          content?: string | null;
          embedding?: string | null;
          id?: number;
          img?: string | null;
          report_name?: string | null;
          report_url?: string | null;
          token_count?: number | null;
          type?: string | null;
        };
        Update: {
          content?: string | null;
          embedding?: string | null;
          id?: number;
          img?: string | null;
          report_name?: string | null;
          report_url?: string | null;
          token_count?: number | null;
          type?: string | null;
        };
        Relationships: [];
      };
      user: {
        Row: {
          created_at: string;
          id: string;
        };
        Insert: {
          created_at?: string;
          id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      binary_quantize:
        | {
            Args: {
              "": string;
            };
            Returns: unknown;
          }
        | {
            Args: {
              "": unknown;
            };
            Returns: unknown;
          };
      halfvec_avg: {
        Args: {
          "": number[];
        };
        Returns: unknown;
      };
      halfvec_out: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      halfvec_send: {
        Args: {
          "": unknown;
        };
        Returns: string;
      };
      halfvec_typmod_in: {
        Args: {
          "": unknown[];
        };
        Returns: number;
      };
      hnsw_bit_support: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      hnsw_halfvec_support: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      hnsw_sparsevec_support: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      hnswhandler: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      ivfflat_bit_support: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      ivfflat_halfvec_support: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      ivfflathandler: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      l2_norm:
        | {
            Args: {
              "": unknown;
            };
            Returns: number;
          }
        | {
            Args: {
              "": unknown;
            };
            Returns: number;
          };
      l2_normalize:
        | {
            Args: {
              "": string;
            };
            Returns: string;
          }
        | {
            Args: {
              "": unknown;
            };
            Returns: unknown;
          }
        | {
            Args: {
              "": unknown;
            };
            Returns: unknown;
          };
      search: {
        Args: {
          embedding: string;
          match_threshold: number;
          match_count: number;
        };
        Returns: {
          id: number;
          content: string;
          token_count: number;
          report_name: string;
          report_url: string;
          type: string;
          img: string;
          similarity: number;
        }[];
      };
      sparsevec_out: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      sparsevec_send: {
        Args: {
          "": unknown;
        };
        Returns: string;
      };
      sparsevec_typmod_in: {
        Args: {
          "": unknown[];
        };
        Returns: number;
      };
      vector_avg: {
        Args: {
          "": number[];
        };
        Returns: string;
      };
      vector_dims:
        | {
            Args: {
              "": string;
            };
            Returns: number;
          }
        | {
            Args: {
              "": unknown;
            };
            Returns: number;
          };
      vector_norm: {
        Args: {
          "": string;
        };
        Returns: number;
      };
      vector_out: {
        Args: {
          "": string;
        };
        Returns: unknown;
      };
      vector_send: {
        Args: {
          "": string;
        };
        Returns: string;
      };
      vector_typmod_in: {
        Args: {
          "": unknown[];
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
