"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import { Button } from "@repo/ui/button"
import { ChevronDown, LogIn, User, UserPlus } from "lucide-react"
import { useTranslations } from "next-intl"
import { CartSidebar } from "../cart-sidebar"

export default function AuthSection() {
  const { isLoaded } = useUser()
  const t = useTranslations("auth-section")

  if (!isLoaded) {
    return <AuthSkeleton />
  }

  return (
    <div className="flex items-center sm:gap-3 rtl:flex-row-reverse" suppressHydrationWarning>
      <DesktopAuth t={t} />
      <MobileAuth t={t} />

    </div>
  )
}

function AuthSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <div className="animate-pulse">
        <div className="h-9 w-20 bg-muted rounded-md"></div>
      </div>
    </div>
  )
}

function DesktopAuth({ t }: { t: any }) {
  return (
    <>
      <div className="hidden lg:flex items-center rtl:flex-row-reverse gap-3">
        <SignedOut>
          <AuthDropdown t={t} />
        </SignedOut>
        <SignedIn>
          <UserAvatar />
        </SignedIn>
        <CartSidebar />
      </div>
    </>
  )
}

function MobileAuth({ t }: { t: any }) {
  return (
    <div className="flex lg:hidden items-center justify-between w-full gap-3">
      <SignedOut>
        <MobileAuthButtons t={t} />
      </SignedOut>
      <SignedIn>
        <UserAvatar isMobile />
      </SignedIn>
    </div>
  )
}

function AuthDropdown({ t }: { t: any }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 font-medium shadow-sm hover:shadow-md transition-all duration-200 border-border/50 hover:border-border"
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">
            {t("account", { defaultMessage: "Account" })}
          </span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 shadow-lg border-border/50"
        sideOffset={8}
      >
        <SignInButton>
          <DropdownMenuItem className="cursor-pointer group hover:bg-accent/50 transition-colors">
            <LogIn className="w-4 h-4 mr-2 group-hover:text-primary transition-colors rtl:mr-0 rtl:ml-2" />
            <span className="font-medium">{t("signIn")}</span>
          </DropdownMenuItem>
        </SignInButton>
        <DropdownMenuSeparator />
        <SignUpButton>
          <DropdownMenuItem className="cursor-pointer group hover:bg-accent/50 transition-colors">
            <UserPlus className="w-4 h-4 mr-2 group-hover:text-primary transition-colors rtl:mr-0 rtl:ml-2" />
            <span className="font-medium">{t("signUp")}</span>
          </DropdownMenuItem>
        </SignUpButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function MobileAuthButtons({ t }: { t: any }) {
  return (
    <div className="flex items-center gap-2 flex-1">
      <SignInButton>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 font-medium hover:bg-accent/50 transition-colors duration-200"
        >
          <LogIn className="w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
          {t("signIn")}
        </Button>
      </SignInButton>
      <SignUpButton>
        <Button
          size="sm"
          className="flex-1 font-medium shadow-sm hover:shadow-md transition-all duration-200"
        >
          <UserPlus className="w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
          {t("signUp")}
        </Button>
      </SignUpButton>
    </div>
  )
}

function UserAvatar({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <UserButton
      afterSignOutUrl="/"
      appearance={{
        elements: {
          avatarBox: `${isMobile ? 'w-9 h-9' : 'w-10 h-10'} shadow-sm hover:shadow-md transition-shadow duration-200 ring-2 ring-transparent hover:ring-primary/10`,
          userButtonPopoverCard: "shadow-xl border border-border/50",
          userButtonPopoverFooter: "hidden",
        },
        variables: {
          fontSize: isMobile ? "13px" : "14px",
          borderRadius: isMobile ? "6px" : "8px",
        },
      }}
    />
  )
}