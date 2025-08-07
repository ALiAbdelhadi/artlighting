import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { buttonVariants } from "@repo/ui/button";
import { Lock, LogIn } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

const LoginModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <div className="flex items-center">
            <Lock className=" mr-3 h-6 w-5 text-primary" />
            <AlertDialogTitle className="text-xl">Login Required</AlertDialogTitle>
          </div>
          <AlertDialogDescription className=" text-left">
            To proceed with your order, we kindly ask you to log in to your
            account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Don&apos;t worry! After logging in, you&apos;ll be redirected back to this
            page, and your progress will be saved.
          </p>
        </div>
        <AlertDialogFooter className="sm:justify-start  ">
          <SignInButton>
            <button
              className={`${buttonVariants({ variant: "outline" })} w-full sm:w-auto mt-3 sm:mt-0 outline-none`}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Proceed to Login
            </button>
          </SignInButton>
          <SignUpButton>
            <button
              className={`${buttonVariants({ variant: "default" })} w-full sm:w-auto`}
            >
              Sign up
            </button>
          </SignUpButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LoginModal;
