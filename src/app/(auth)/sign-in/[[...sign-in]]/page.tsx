import { ThemedSignIn } from '@/components/ui/ThemedSignIn';
import { constructMetadata } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
const SignInPage = () => {
    return (
        <main className="flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 py-28">
            <Link href={"/"} className='absolute top-4 left-4 text-foreground hover:text-primary transition-colors'>
                <span className='flex items-center'>
                <ArrowLeft className='mr-2 w-5 h-5'/>
                    Back to Home
                </span>
            </Link>
            <div className="w-full max-w-4xl flex xl:shadow-2xl shadow-none rounded-xl overflow-hidden">
                <div className="flex-1 hidden lg:block relative">
                    <Image
                        src="/NewCollection/new-collection-2.jpg"
                        alt="Art Lighting Showcase"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-l-xl"
                    />
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col justify-end p-8 text-foreground">
                        <h2 className="text-3xl font-bold mb-2">Welcome to Art Lighting</h2>
                        <p className="text-sm">Illuminate your space with our exquisite collection</p>
                    </div>
                </div>
                <div className="flex-1 lg:bg-card bg-transparent text-card-foreground sm:p-8 p-4 flex items-center sm:items-start flex-col justify-center">
                    <ThemedSignIn />
                </div>
            </div>
        </main>
    )
}

export const metadata = constructMetadata({
    title: "Sign in | Art Lighting"
})

export default SignInPage