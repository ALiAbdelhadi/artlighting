import { constructMetadata } from "@/lib/utils";
import BlogContent from "./blog-content";
export const metadata = constructMetadata({
  title: "Blog",
  description:
    "Know About Our Latest News In New Arrivals Products, Events in  egypt and in china ",
});

export default function Blog() {
  return <BlogContent />;
}
