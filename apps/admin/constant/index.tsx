import { BellDot, Boxes, FolderTree, HomeIcon, PackageIcon, PercentIcon, ShieldIcon, UsersIcon } from "lucide-react";

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
        name: "Categories",
        icon: <FolderTree className="h-5 w-5" />,
        url: "/admin/dashboard/categories",
    },
    {
        name: "Discounts",
        icon: <PercentIcon className="h-5 w-5" />,
        url: "/admin/dashboard/discounts",
    },
    {
        name: "Customers",
        icon: <UsersIcon className="h-5 w-5" />,
        url: "/admin/dashboard/users",
    },
    {
        name: "Team",
        icon: <ShieldIcon className="h-5 w-5" />,
        url: "/admin/dashboard/team",
    },
    {
        name: "Notification",
        icon: <BellDot className="h-5 w-5" />,
        url: "/admin/dashboard/notification",
    },
];