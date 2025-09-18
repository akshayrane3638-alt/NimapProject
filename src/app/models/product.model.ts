export interface Product{
    ProductId ?: number;
    ProductName : string;
    description ?: string;
    price ?: number;
    CategoryId ?: number;
    CategoryName  ?: string;
    created_at ?: string;
    updated_at ?: string;
}

export interface ProductListResponse{
    data : Product [];
    pagination : {
        page : number;
        pageSize : number;
        total : number;
        totalPages : number;
    }
}