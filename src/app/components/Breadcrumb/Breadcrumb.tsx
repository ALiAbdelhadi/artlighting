"use client";

import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Container from "../Container";
import styles from "./Breadcrumb.module.css";

const CustomBreadcrumb = () => {
    const pathname = usePathname();
    const pathParts = pathname.split("/").filter((part) => part);
    const [showFullBreadcrumb, setShowFullBreadcrumb] = useState(false);

    const toggleBreadcrumb = () => {
        setShowFullBreadcrumb(!showFullBreadcrumb);
    };

    return (
        <Container>
            <Breadcrumb className="pt-9 pb-0 sm:block hidden">
                <BreadcrumbItem className="p-0 m-0">
                    <Link href="/" >
                        Home
                    </Link>
                </BreadcrumbItem>
                {pathParts.map((part, index) => {
                    const href = "/" + pathParts.slice(0, index + 1).join("/");
                    const isLast = index === pathParts.length - 1;
                    return (
                        <BreadcrumbItem key={href} className="p-0">
                            {!isLast ? (
                                <Link href={href} className="capitalize">
                                    {decodeURIComponent(part)}
                                </Link>
                            ) : (
                                <span className={` capitalize ${styles.active}`}>
                                    {decodeURIComponent(part)}
                                </span>
                            )}
                        </BreadcrumbItem>
                    )
                })}
            </Breadcrumb>
        </Container>
    );
};

export default CustomBreadcrumb;
