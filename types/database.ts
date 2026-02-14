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
        }
        Insert: {
          id?: string
          created_at?: string
          event_id: string
          name: string
          email: string
          phone: string
          status?: 'pending' | 'confirmed' | 'cancelled'
        }
        Update: {
          id?: string
          created_at?: string
          event_id?: string
          name?: string
          email?: string
          phone?: string
          status?: 'pending' | 'confirmed' | 'cancelled'
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
export type ReservationRow = Database['public']['Tables']['reservations']['Row']
