export default interface PaginationResponse<T> {
    data: T[];
    pagination: {
        total: number;
        offset: number;
        limit: number;
    };
}
