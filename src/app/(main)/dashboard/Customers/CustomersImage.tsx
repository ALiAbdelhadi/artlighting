"use server"
import { currentUser } from "@clerk/nextjs/server";
const CustomersImage = async () => {
  const user = await currentUser()
  const userImage = user?.imageUrl
  return (
    <img src={userImage} alt="User Image" className='object-cover rounded-full mr-1.5 ' width={30} height={30} />
  )
}

export default CustomersImage