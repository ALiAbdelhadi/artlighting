import { constructMetadata } from "@/lib/utils";
import FAQs from "./faq-section";


export default function FAQsPage() {
  return <FAQs />;
}

export const metadata = constructMetadata({
  title: "FAQs",
  description: "Most Asked question in our lighting products",
});
