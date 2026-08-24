export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          description: string;
          category: string;
          location: string | null;
          year: number | null;
          featured: boolean;
          published: boolean;
          sort_order: number;
          layout: "wide" | "tall" | "standard";
          cover_image: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          description?: string;
          category: string;
          location?: string | null;
          year?: number | null;
          featured?: boolean;
          published?: boolean;
          sort_order?: number;
          layout?: "wide" | "tall" | "standard";
          cover_image?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          description?: string;
          category?: string;
          location?: string | null;
          year?: number | null;
          featured?: boolean;
          published?: boolean;
          sort_order?: number;
          layout?: "wide" | "tall" | "standard";
          cover_image?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_images: {
        Row: {
          id: string;
          project_id: string;
          src: string;
          alt: string;
          sort_order: number;
          storage_path: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          src: string;
          alt?: string;
          sort_order?: number;
          storage_path?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          src?: string;
          alt?: string;
          sort_order?: number;
          storage_path?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
