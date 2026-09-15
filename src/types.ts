export interface Service {
  id: number;
  slug: string;
  name: string;
  short_desc: string;
  full_desc: string;
  features: string[];
  icon: string;
  image_url: string;
  display_order: number;
  is_published?: boolean;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  category_slug: string;
  description: string;
  image_url: string;
  gallery_images?: string[];
  client_type: string;
  completion_time: string;
  featured: boolean;
  display_order: number;
  is_published?: boolean;
}

export interface PaintProduct {
  id: number;
  name: string;
  category: string;
  tagline: string;
  description: string;
  sizes: string[];
  coverage: string;
  drying_time: string;
  finish_type: string;
  features: string[];
  image_url: string;
  popular: boolean;
  display_order: number;
}

export interface QuoteRequest {
  id?: number;
  created_at?: string;
  full_name: string;
  phone: string;
  email?: string;
  service: string;
  project_type: string;
  size_estimate: string;
  paint_preference?: string;
  description?: string;
  status?: string;
}

export interface ContactMessage {
  id?: number;
  created_at?: string;
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
}
