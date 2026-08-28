export interface Category {
  id: string;
  label: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  displayOrder: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
