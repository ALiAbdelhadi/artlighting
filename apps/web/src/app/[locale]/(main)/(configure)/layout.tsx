import Steps from "@/components/steps";
import { ReactNode } from "react";


export default function ConfigurationLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Steps />
      {children}
    </>
  )
}