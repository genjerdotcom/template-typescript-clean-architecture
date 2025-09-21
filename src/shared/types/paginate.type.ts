export interface PaginationOptions {
    page?: number;
    size?: number;
    sortBy?: string;
    descending?: string;
}

export interface PaginatedResult<T> {
    results: T[];
    count: number;
}