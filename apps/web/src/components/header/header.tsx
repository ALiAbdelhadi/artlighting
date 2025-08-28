"use client"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ChandelierItems, IndoorItems, OutdoorItems } from "@/constants"
import { Link } from "@/i18n/navigation"
import { Container } from "@repo/ui"
import { Button } from "@repo/ui/button"
import { BoxIcon, BriefcaseIcon, MailIcon, MenuIcon, MoveRight, NewspaperIcon, UserIcon, XIcon } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"
import AuthSection from "./auth-section"
import { AuthSectionWrapper } from "./auth-section-wrapper"
import { SearchHeader } from "./search-header"
import LanguageSwitcher from "../language-switcher"
import { CartSidebar } from "../cart-sidebar"

interface Project {
  ProjectId: string
  ProjectName: string
  ProjectImages: string[]
  ProjectDescription: string
}

interface HeaderProps {
  projectsForHeader: Project[]
}

export default function Header({ projectsForHeader }: HeaderProps) {
  const t = useTranslations("header")
  const tProducts = useTranslations("products")
  const locale = useLocale()
  const isRTL = locale === 'ar'
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/30 border-b border-border/30">
      <Container className="container">
        <div className="flex items-center justify-between h-16 gap-4 rt:flex-row-reverse">
          <Link href="/" className="flex items-center gap-2 shrink-0" prefetch={false} aria-label="Art Lighting - Home">
            <Image
              width={80}
              height={80}
              src={locale === 'ar' ? "/logo-ar.png" : "/logo-en.png"}
              className="sm:w-16 sm:h-16 w-14 h-14"
              alt="Art Lighting Logo"
              priority
            />
          </Link>
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="space-x-3 rtl:flex-row-reverse">
              <NavigationMenuItem>
                <Link href="/about-us" prefetch={false}>
                  <Button
                    variant="ghost"
                    className="h-10 px-3 py-2 text-sm font-medium hover:bg-transparent hover:underline"
                  >
                    {t("about-us")}
                  </Button>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-10 px-3 py-2 text-sm font-medium bg-transparent hover:underline">
                  {t("projects")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[800px] grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                    {projectsForHeader.map((project) => (
                      <div
                        className="group relative overflow-hidden rounded-lg border border-border bg-card hover:bg-accent/20 transition-colors"
                        key={project.ProjectId}
                      >
                        <Link href={`/all-projects/${project.ProjectId}`} className="block p-4">
                          <div className="relative mb-3">
                            <Image
                              width={300}
                              height={200}
                              className="w-full h-32 object-cover rounded-md"
                              src={project.ProjectImages[0] || "/placeholder.svg"}
                              alt={project.ProjectName}
                            />
                          </div>
                          <div className="rtl:text-right text-left space-y-2">
                            <h3 className="font-semibold text-[15px] line-clamp-2">{project.ProjectName}</h3>
                            <p className="text-[13px] text-muted-foreground line-clamp-2">{project.ProjectDescription}</p>
                            <span className="text-[13px] text-primary mt-2 flex items-center rtl:items-start rtl:justify-end group-hover:underline gap-2">
                              {t('view-details')}
                              <span>
                                <MoveRight className="rtl:-rotate-180" />
                              </span>
                            </span>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-10 px-3 py-2 text-sm font-medium bg-transparent hover:underline">
                  {t("products")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[700px] grid-cols-3 gap-6 p-6 justify-items-center ">
                    <div className="space-y-3  rtl:space-y-reverse">
                      <h4 className="font-semibold text-primary text-base mb-3">
                        <Link href="/category/balcom/indoor" className="hover:underline">
                          {tProducts("indoor.title") || "Indoor"}
                        </Link>
                      </h4>
                      <ul className="space-y-2  rtl:space-y-reverse">
                        {IndoorItems.map((item) => (
                          <li key={item.id}>
                            <Link
                              href={item.href}
                              className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
                            >
                              {tProducts(`indoor.${item.id}`)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3  rtl:space-y-reverse">
                      <h4 className="font-semibold text-primary text-base mb-3">
                        <Link href="/category/balcom/outdoor" className="hover:underline">
                          {tProducts("outdoor.title") || "Outdoor"}
                        </Link>
                      </h4>
                      <ul className="space-y-2  rtl:space-y-reverse">
                        {OutdoorItems.map((item) => (
                          <li key={item.id}>
                            <Link
                              href={item.href}
                              className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
                            >
                              {tProducts(`outdoor.${item.id}`)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3  rtl:space-y-reverse">
                      <h4 className="font-semibold text-primary text-base mb-3">
                        <Link href="/category/mister-led/chandelier" className="hover:underline">
                          {tProducts("chandelier.title") || "Chandelier"}
                        </Link>
                      </h4>
                      <ul className="space-y-2  rtl:space-y-reverse">
                        {ChandelierItems.slice(0, 12).map((item) => (
                          <li key={item.id}>
                            <Link
                              href={item.href}
                              className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
                            >
                              {tProducts(`chandelier.${item.id}`)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/blog" prefetch={false}>
                  <Button
                    variant="ghost"
                    className="h-10 px-3 py-2 text-sm font-medium hover:bg-transparent hover:underline"
                  >
                    {t("blog")}
                  </Button>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact-us" prefetch={false}>
                  <Button
                    variant="ghost"
                    className="h-10 px-3 py-2 text-sm font-medium hover:bg-transparent hover:underline"
                  >
                    {t("contact-us")}
                  </Button>
                </Link>
              </NavigationMenuItem>
              <div className="hidden lg:flex items-center space-x-3 rtl:flex-row-reverse">
                <SearchHeader />
                <AuthSectionWrapper>
                  <AuthSection />
                </AuthSectionWrapper>
                <LanguageSwitcher currentLocale={locale} />
              </div>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center gap-2 lg:hidden">
            <Sheet>
              <SheetTrigger asChild >
                <div className="flex items-center gap-2">
                  <LanguageSwitcher currentLocale={locale} />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 bg-transparent"
                    aria-label="Open navigation menu"
                  >
                    <MenuIcon className="h-5 w-5" />
                  </Button>
                </div>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85vw] max-w-sm overflow-y-auto">
                <div className="flex justify-between px-3 py-2">
                  <SheetHeader className="py-0 px-0">
                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                    <AuthSectionWrapper>
                      <AuthSection />
                    </AuthSectionWrapper>
                  </SheetHeader>
                  <SheetClose className="cursor-pointer">
                    <XIcon className="size-5" />
                    <span className="sr-only">Close</span>
                  </SheetClose>
                </div>
                <div className="flex flex-col h-full">
                  <div className="px-3 border-b border-t">
                    <div className="py-4">
                      <SearchHeader isMobileSheet />
                    </div>
                  </div>
                  <nav className="flex flex-col space-y-1  rtl:space-y-reverse pt-6 flex-1">
                    <SheetClose asChild>
                      <Link
                        href="/about-us"
                        className="flex items-center gap-3  p-3 text-sm font-medium rounded-md hover:bg-accent"
                        prefetch={false}
                      >
                        <UserIcon className="h-4 w-4" />
                        {t("about-us")}
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/all-projects"
                        className="flex items-center gap-3  p-3 text-sm font-medium rounded-md hover:bg-accent"
                        prefetch={false}
                      >
                        <BriefcaseIcon className="h-4 w-4" />
                        {t("projects")}
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/category"
                        className="flex items-center gap-3  p-3 text-sm font-medium rounded-md hover:bg-accent"
                        prefetch={false}
                      >
                        <BoxIcon className="h-4 w-4" />
                        {t("products")}
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/blog"
                        className="flex items-center gap-3  p-3 text-sm font-medium rounded-md hover:bg-accent"
                        prefetch={false}
                      >
                        <NewspaperIcon className="h-4 w-4" />
                        {t("blog")}
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/contact-us"
                        className="flex items-center gap-3 p-3 text-sm font-medium rounded-md hover:bg-accent"
                        prefetch={false}
                      >
                        <MailIcon className="h-4 w-4" />
                        {t("contact-us")}
                      </Link>
                    </SheetClose>
                    <div className="px-1.5 py-3">
                      <CartSidebar />
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  )
}
