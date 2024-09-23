import { constructMetadata } from '@/lib/utils'
import { SignUp } from '@clerk/nextjs'

const SignUpPage = () => {
    return (
        <main className='py-14 sm:py-20 md:py-24 lg:py-28  xl:py-32 auth-page flex items-center justify-center bg-background'>
            <SignUp />
        </main>
    )
}
export const metadata = constructMetadata({
    title: "Sign Up | Art Lighting"
})
export default SignUpPage