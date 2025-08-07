export enum ProductIP {
    IP20 = "IP20",
    IP44 = "IP44",
    IP54 = "IP54",
    IP65 = "IP65",
    IP68 = "IP68",
}

export interface Configuration {
    id: string;
    ProductId: string;
    configPrice: number;
    priceIncrease: number;
    shippingPrice: number;
    discount: number;
    quantity: number;
    lampPriceIncrease: number | null;
    totalPrice: number;
    productIp: ProductIP | null; 
    updatedAt: Date; 
}

export async function updateConfiguration(configId: string, updates: Partial<Configuration>) {
    try {
        const response = await fetch(`/api/configurations/${configId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updates),
        });
        if (!response.ok) {
            const errorText = await response.text();
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        return (await response.json()) as Configuration; // تحديد نوع الإرجاع
    } catch (error) {
        console.error("Failed to update configuration:", error);
        throw error;
    }
}

export async function getConfiguration(productId: string): Promise<Configuration> {
    try {
        const response = await fetch(`/api/configurations/${productId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            const errorText = await response.text();
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        return (await response.json()) as Configuration;
    } catch (error) {
        console.error("Failed to fetch configuration:", error);
        throw error;
    }
}
