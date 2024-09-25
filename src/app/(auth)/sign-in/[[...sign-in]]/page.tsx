import { constructMetadata } from '@/lib/utils'
import { SignIn } from '@clerk/nextjs'

const SignUpPage = () => {
    return (
        <main className='py-14 sm:py-20 md:py-24 lg:py-28 overflow-auto xl:py-32 auth-page flex items-center justify-center bg-background'>
            <SignIn/>
        </main>
    )
}
export const metadata = constructMetadata({
    title: "Sign in | Art Lighting"
})
export default SignUpPage