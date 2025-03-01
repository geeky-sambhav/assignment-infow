export interface CategoryAttributes {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateCategoryDto {
    name: string;
}

export interface UpdateCategoryDto {
    name?: string;
}