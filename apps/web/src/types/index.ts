export interface PagePropsTypes {
    params: Promise<{
        locale: string;
        ProductId?: string;
        projectId?: string;
        subCategory?: string;
        lightingType?: string;
        orderId?: string;
    }>,
    searchParams?: Promise<{
        [key: string]: string | string[] | undefined
    }>
}