"use server"
import { currentUser } from "@clerk/nextjs/server";
const CustomersImage = async ({ width, height, className }: { width: number, height: number, className?: string }) => {
  const user = await currentUser()
  const userImage = user?.imageUrl
  return (
    <img src={userImage} alt="User Image" className={`${className} object-cover rounded-full`} width={width} height={height} />
  )
}

export default CustomersImage