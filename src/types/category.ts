export interface CategoryAttributes {
    id: number;
    name: string;
    description: string;
    slug: string;
    parentId: number | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  