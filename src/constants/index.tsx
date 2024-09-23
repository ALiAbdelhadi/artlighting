import { ChevronLeft, ChevronRight, HomeIcon, Boxes, PackageIcon, UsersIcon, BellDot } from 'lucide-react';
export const exploreEftar = [
    {
        id: "eftar-2020",
        imgUrl: "/eftar/eftar-1.jpg",
        title: "Eftar 2020"
    },
    {
        id: "eftar-2021",
        imgUrl: "/eftar/eftar-5.jpg",
        title: "Eftar 2021"
    },
    {
        id: "eftar-2024",
        imgUrl: "/eftar/eftar-3.jpg",
        title: "Eftar 2024"
    },
    {
        id: "eftar-2019",
        imgUrl: "/eftar/eftar-4.jpg",
        title: "Eftar 2019"
    },
    {
        id: "eftar-2022",
        imgUrl: "/eftar/eftar-2.jpg",
        title: "Eftar 2022"
    },
]
export const newCollectionProducts = [
    { id: "track", name: "Track", image: "/NewCollection/new-collection-1.jpg" },
    { id: "hallo", name: "Hallo", image: "/NewCollection/new-collection-2.jpg" },
    { id: "spot", name: "Spot", image: "/NewCollection/new-collection-3.jpg" },
]

export const brands = [
    {
        name: "Balcom",
        description: "Premium home appliances for discerning customers",
        logo: "/brand/balcom.jpeg",
        link: "/category/Balcom"
    },
    {
        name: "Mister LED",
        description: "Innovative LED lighting solutions for every space",
        logo: "/brand/mrled.png",
        link: "/category/MisterLed"
    },
    {
        name: "Jetra",
        description: "High-performance electronics for modern living",
        logo: "/brand/jetra.png",
        link: "/category/Jetra"
    },
];


export const DASHBOARDS = [
    {
        name: "Dashboard",
        icon: <HomeIcon className="h-5 w-5" />,
        url: "/dashboard",
    },
    {
        name: "Orders",
        icon: <Boxes className="h-5 w-5" />,
        url: "/dashboard/Orders",
    },
    {
        name: "Products",
        icon: <PackageIcon className="h-5 w-5" />,
        url: "/dashboard/Products",
    },
    {
        name: "Customers",
        icon: <UsersIcon className="h-5 w-5" />,
        url: "/dashboard/Customers",
    },
    {
        name: "Notification",
        icon: <BellDot className="h-5 w-5" />,
        url: "/dashboard/Notification",
    },
];


