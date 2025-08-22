"use client";

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
import { Lock, LogIn, X } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";

const LoginModal = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const t = useTranslations("login");
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <button
          onClick={closeModal}
          className="absolute right-3 top-3 rounded-full p-1 hover:bg-muted transition"
        >
          <X className="h-4 w-4" />
        </button>
        <AlertDialogHeader>
          <div className="flex items-center">
            <Lock className="mr-3 h-6 w-5 text-primary" />
            <AlertDialogTitle className="text-xl">{t("loginRequired")}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-left">
            {t("loginDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">{t("loginNote")}</p>
        </div>
        <AlertDialogFooter className="sm:justify-start">
          <SignInButton>
            <button
              className={`${buttonVariants({ variant: "outline" })} w-full sm:w-auto mt-3 sm:mt-0 outline-none`}
            >
              <LogIn className="mr-2 h-4 w-4" />
              {t("proceedToLogin")}
            </button>
          </SignInButton>
          <SignUpButton>
            <button
              className={`${buttonVariants({ variant: "default" })} w-full sm:w-auto`}
            >
              {t("signUp")}
            </button>
          </SignUpButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LoginModal;
