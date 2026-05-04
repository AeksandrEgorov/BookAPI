export type Pagination = {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

export type ApiErrorDetail = {
    field: string;
    message: string;
};

export type ApiErrorResponse = {
    error: string;
    details?: ApiErrorDetail[];
};