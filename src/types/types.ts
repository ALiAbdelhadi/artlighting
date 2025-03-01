export interface ProductData {
    ProductId: string;
    productName: string;
    productImages: string[];
    specificationsTable: {
        Input: string;
        "Maximum wattage": string;
        "Brand Of Led": string;
        "Luminous Flux": string;
        "Main Material": string;
        "CRI": string;
        "Beam Angle": string;
        "Working Temperature": string;
        "Fixture Dimmable": string;
        "Electrical": string;
        "Power Factor": string;
        "Color Temperature": string;
        "IP": string;
        "Energy Saving": string;
        "Life Time": string;
    };
    description: string;
    MaxIP: string;
    features: string;
    tips: string;
    spotlightType: string;
    brand: string;
    price?: number;
    sectionType: string;

    [key: string]: any;
}

export interface CategoryData {
    [productKey: string]: ProductData;
}

export interface ProductsData {
    IndoorLighting: {
        [category: string]: CategoryData[];
    };
    outdoorLighting: {
        [category: string]: CategoryData[];
    };
    chandelier: {
        [category: string]: CategoryData[];
    };
}

export interface IndoorCategoryProps {
    categories: string[];
    children?: React.ReactNode;
}
export type ItemsProps = {
    id: string
    spotlightType: string,
    href: string
}