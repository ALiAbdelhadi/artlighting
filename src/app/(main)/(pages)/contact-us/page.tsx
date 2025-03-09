import { constructMetadata } from "@/lib/utils";
import ContactContent from "./ContactContent";
const page = () => {
  return <ContactContent />;
};
export default page;
export const metadata = constructMetadata({
  title: "Contact Us",
  description:
    "Have a question or want to work with us? Reach out and we'll get back to you as soon as we can.",
});
