import Steps from "@/components/steps";
import { ReactNode } from "react";
const layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Steps />
      {children}
    </>
  );
};

export default layout;
