import { BellDot, Boxes, HomeIcon, PackageIcon, UsersIcon } from "lucide-react";

export const DASHBOARDS = [
    {
        name: "Dashboard",
        icon: <HomeIcon className="h-5 w-5" />,
        url: "/admin/dashboard",
    },
    {
        name: "Orders",
        icon: <Boxes className="h-5 w-5" />,
        url: "/admin/dashboard/orders",
    },
    {
        name: "Products",
        icon: <PackageIcon className="h-5 w-5" />,
        url: "/admin/dashboard/products",
    },
    {
        name: "Customers",
        icon: <UsersIcon className="h-5 w-5" />,
        url: "/admin/dashboard/users",
    },
    {
        name: "Notification",
        icon: <BellDot className="h-5 w-5" />,
        url: "/admin/dashboard/notification",
    },
];