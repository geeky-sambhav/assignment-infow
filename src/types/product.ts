export interface ProductAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  slug: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: number;
  slug?: string;
}