export interface Product{
    ProductId ?: number;
    productName : string;
    //description ?: string;
    Price ?: number;
    categoryId ?: number;
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