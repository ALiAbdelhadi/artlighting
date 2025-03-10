import { constructMetadata } from "@/lib/utils";
import FAQs from "./faqContnet";
const page = () => {
  return <FAQs />;
};

export default page;
export const metadata = constructMetadata({
  title: "FAQs",
  description: "Most Asked question in our lighting products",
});
