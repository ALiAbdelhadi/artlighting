import { buttonVariants } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { Lock, LogIn } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

const LoginModal = ({ isOpen, setIsOpen }: {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
}) => {
    return (
        <Dialog onOpenChange={setIsOpen} open={isOpen} >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className='flex items-center'>
                    <Lock className=" mr-3 h-6 w-5 text-primary" />
                    <DialogTitle className='text-xl'>Login Required</DialogTitle>
                    </div>
                    <DialogDescription className=' text-left'>
                        To proceed with your order, we kindly ask you to log in to your account.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-sm text-muted-foreground">
                        Don't worry! After logging in, you'll be redirected back to this page, and your progress will be saved.
                    </p>
                </div>
                <DialogFooter className="sm:justify-start  ">
                    <SignInButton >
                        <button className={`${buttonVariants({ variant: "outline" })} w-full sm:w-auto mt-3`}>
                            <LogIn className="mr-2 h-4 w-4" />
                            Proceed to Login
                        </button>
                    </SignInButton>
                    <SignUpButton>
                        <button className={`${buttonVariants({ variant: "default" })} w-full sm:w-auto`}>
                            Sign up
                        </button>
                    </SignUpButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default LoginModal
