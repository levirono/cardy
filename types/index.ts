// ─── Core Auth Types ───────────────────────────────────────────────────────
export type UserRole = 'user' | 'designer' | 'admin'

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url?: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

// ─── Cards ─────────────────────────────────────────────────────────────────
export type MediaType = 'image' | 'video' | 'animation' | 'text'
export type AlignType = 'left' | 'center' | 'right'

export interface Card {
  id: string
  user_id: string | null
  title: string
  recipient_name: string
  message: string
  media_type: MediaType
  media_url: string | null
  background_color: string | null
  text_color: string | null
  title_color: string | null
  message_color: string | null
  font_family: string | null
  title_align: AlignType | null
  message_align: AlignType | null
  title_size: string | null
  message_size: string | null
  theme_preset: string | null
  unlock_at: string | null
  is_locked: boolean
  key: string | null
  opened_at: string | null
  created_at: string
  // joined
  profile?: Profile
}

// ─── Card Templates ────────────────────────────────────────────────────────
export type TemplateCategory = 'birthday' | 'anniversary' | 'wedding' | 'general' | 'christmas' | 'valentine' | 'thank_you' | 'graduation'

export interface CardTemplate {
  id: string
  designer_id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  preview_url: string | null
  category: TemplateCategory
  is_active: boolean
  created_at: string
  // joined
  designer?: Profile
  avg_rating?: number
  rating_count?: number
}

export interface CardRating {
  id: string
  template_id: string
  user_id: string
  rating: number
  comment: string | null
  created_at: string
  // joined
  user?: Profile
}

// ─── Design Requests ───────────────────────────────────────────────────────
export type DesignRequestStatus = 'Pending' | 'In Progress' | 'Completed' | 'Rejected'

export interface DesignRequest {
  id: string
  user_id: string
  designer_id: string | null
  title: string
  description: string
  status: DesignRequestStatus
  assigned_to: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
  // joined
  user?: Profile
  designer?: Profile
}

// ─── Print Requests ────────────────────────────────────────────────────────
export type WrapStyle = 'classic' | 'festive' | 'minimal'

export interface PrintRequest {
  id: string
  card_id: string
  recipient_name: string
  address_line: string
  wrap_style: WrapStyle
  note: string | null
  created_at: string
  card?: Card
}

// ─── Valentines ────────────────────────────────────────────────────────────
export interface Valentine {
  id: string
  sender_name: string | null
  recipient: string
  message: string
  created_at: string
}

// ─── Designer Applications ─────────────────────────────────────────────────
export type ApplicationStatus = 'pending' | 'approved' | 'rejected'

export interface DesignerApplication {
  id: string
  user_id: string
  status: ApplicationStatus
  motivation: string | null
  portfolio_url: string | null
  created_at: string
  decided_at: string | null
  // joined
  user?: Profile
}

// ─── Weddings ──────────────────────────────────────────────────────────────
export type WeddingTheme = 'classic' | 'modern' | 'rustic' | 'floral' | 'minimal' | 'tropical' | 'bohemian'

export interface Wedding {
  id: string
  user_id: string
  slug: string
  couple_name_1: string
  couple_name_2: string
  wedding_date: string
  venue_name: string | null
  venue_address: string | null
  venue_lat: number | null
  venue_lng: number | null
  ceremony_time: string | null
  reception_time: string | null
  cover_image_url: string | null
  theme_color: string | null
  theme_preset: WeddingTheme | null
  welcome_message: string | null
  story_text: string | null
  dress_code: string | null
  additional_info: string | null
  is_published: boolean
  created_at: string
  updated_at: string
  // joined counts
  rsvp_count?: number
  wish_count?: number
  attending_count?: number
}

export type AttendanceStatus = 'attending' | 'not_attending' | 'maybe'
export type HowTheyKnow = 'bride' | 'groom' | 'both' | 'other'

export interface WeddingRsvp {
  id: string
  wedding_id: string
  guest_name: string
  guest_email: string | null
  attendance_status: AttendanceStatus
  how_they_know: HowTheyKnow
  how_they_know_detail: string | null
  dietary_restrictions: string | null
  plus_one: boolean
  plus_one_name: string | null
  message_to_couple: string | null
  created_at: string
}

export interface WeddingWish {
  id: string
  wedding_id: string
  guest_name: string
  wish_message: string
  is_approved: boolean
  created_at: string
}

// ─── App Settings ──────────────────────────────────────────────────────────
export interface AppSetting {
  key: string
  value: Record<string, unknown>
  updated_at: string
}
