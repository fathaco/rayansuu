export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          category: string
          hours: string
          lessons: string
          badge: string | null
          badge_color: string | null
          image_url: string | null
          is_new: boolean
          price: string | null
          tutorial_link: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          category: string
          hours: string
          lessons: string
          badge?: string | null
          badge_color?: string | null
          image_url?: string | null
          is_new?: boolean
          price?: string | null
          tutorial_link?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          category?: string
          hours?: string
          lessons?: string
          badge?: string | null
          badge_color?: string | null
          image_url?: string | null
          is_new?: boolean
          price?: string | null
          tutorial_link?: string | null
        }
      }
      reservations: {
        Row: {
          id: string
          created_at: string
          event_id: string
          name: string
          email: string
          phone: string
          status: 'pending' | 'confirmed' | 'cancelled'
          payment_proof_url: string | null
          payment_confirmed: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          event_id: string
          name: string
          email: string
          phone: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          payment_proof_url?: string | null
          payment_confirmed?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          event_id?: string
          name?: string
          email?: string
          phone?: string
          status?: 'pending' | 'confirmed' | 'cancelled'
          payment_proof_url?: string | null
          payment_confirmed?: boolean
        }
      }
      reviews: {
        Row: {
          id: string
          created_at: string
          content: string | null
          image_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          content?: string | null
          image_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          content?: string | null
          image_url?: string | null
        }
      }
      faqs: {
        Row: {
          id: string
          created_at: string
          question: string
          answer: string
          display_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          question: string
          answer: string
          display_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          question?: string
          answer?: string
          display_order?: number
        }
      }
      footer_settings: {
        Row: {
          id: number
          tagline: string | null
          social_facebook: string | null
          social_youtube: string | null
          social_instagram: string | null
          social_twitter: string | null
          quick_links: { label: string; href: string }[]
          sections: { label: string; href: string }[]
          contact: { label: string; href: string }[]
          copyright_text: string | null
          privacy_url: string | null
          terms_url: string | null
          updated_at: string
        }
        Insert: {
          id?: number
          tagline?: string | null
          social_facebook?: string | null
          social_youtube?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          quick_links?: { label: string; href: string }[]
          sections?: { label: string; href: string }[]
          contact?: { label: string; href: string }[]
          copyright_text?: string | null
          privacy_url?: string | null
          terms_url?: string | null
          updated_at?: string
        }
        Update: {
          id?: number
          tagline?: string | null
          social_facebook?: string | null
          social_youtube?: string | null
          social_instagram?: string | null
          social_twitter?: string | null
          quick_links?: { label: string; href: string }[]
          sections?: { label: string; href: string }[]
          contact?: { label: string; href: string }[]
          copyright_text?: string | null
          privacy_url?: string | null
          terms_url?: string | null
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export type EventRow = Database['public']['Tables']['events']['Row']
export type EventInsert = Database['public']['Tables']['events']['Insert']
export type EventUpdate = Database['public']['Tables']['events']['Update']
export type ReservationRow = Database['public']['Tables']['reservations']['Row']
export type ReviewRow = Database['public']['Tables']['reviews']['Row']
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert']
export type ReviewUpdate = Database['public']['Tables']['reviews']['Update']
export type FaqRow = Database['public']['Tables']['faqs']['Row']
export type FaqInsert = Database['public']['Tables']['faqs']['Insert']
export type FaqUpdate = Database['public']['Tables']['faqs']['Update']
export type FooterSettingsRow = Database['public']['Tables']['footer_settings']['Row']
export type FooterSettingsUpdate = Database['public']['Tables']['footer_settings']['Update']
