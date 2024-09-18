import { ReactNode } from "react"
import Steps from "@/app/components/Steps"
const layout = ({ children }: { children: ReactNode }) => {
    return (
        <div>
            <Steps />
            {children}
        </div>
    )
}

export default layout