export interface Category {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  year: number;
  creators: string;
  link: string | null;
  categoryId: string;
  video: boolean;
  cover: boolean;
  category?: Category;
}

export interface Review {
  id: string;
  stars: number;
  reason: string;
  createdAt: Date;
}

export interface ActionResponse {
  success?: boolean;
  error?: string;
}
