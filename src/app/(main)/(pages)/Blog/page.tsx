import { constructMetadata } from "@/lib/utils";
export const metadata = constructMetadata({ title: "Blog", description: "Know About Our Latest News In New Arrivals Products, Events in  egypt and in china " })
import React from 'react'
import BlogContent from "./BlogContent";

const page = () => {
    return (
        <BlogContent />
    )
}

export default page