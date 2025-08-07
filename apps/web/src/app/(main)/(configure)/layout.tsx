import Steps from "@/components/steps";
import { ReactNode } from "react";
const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Steps />
      {children}
    </div>
  );
};

export default layout;
