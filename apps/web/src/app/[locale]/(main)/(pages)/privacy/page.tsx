import { constructMetadata } from "@/lib/utils";
import PrivacyContnet from "./privacy-section";
const page = () => {
  return <PrivacyContnet />;
};

export default page;
export const metadata = constructMetadata({
  title: "Privacy Policy | Art Lighting",
  description:
    "Learn about how Art Lighting collects, uses, and protects your personal information.",
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Art Lighting",
    description:
      "Learn about how Art Lighting collects, uses, and protects your personal information.",
  },
});
