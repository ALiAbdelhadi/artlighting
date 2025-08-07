import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ChandelierItems, IndoorItems, OutdoorItems, projectDataForHeader } from "@/constants"
import { Container } from "@repo/ui"
import { Button } from "@repo/ui/button"
import { BoxIcon, BriefcaseIcon, MailIcon, MenuIcon, NewspaperIcon, UserIcon, XIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { CartSidebar } from "../cart-sidebar"
import AuthSection from "./auth-section"
import { AuthSectionWrapper } from "./auth-section-wrapper"
import { SearchHeader } from "./search-header"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <Container className="container">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0" prefetch={false} aria-label="Art Lighting - Home">
            <Image
              quality={100}
              width={80}
              height={80}
              src="/logo.png"
              className="w-12 h-12 lg:w-16 lg:h-16"
              alt="Art Lighting Logo"
              priority
            />
          </Link>
          <NavigationMenu className="hidden xl:flex">
            <NavigationMenuList className="space-x-3">
              <NavigationMenuItem>
                <Link href="/about-us" prefetch={false}>
                  <Button
                    variant="ghost"
                    className="h-10 px-3 py-2 text-sm font-medium hover:bg-transparent hover:underline"
                  >
                    About Us
                  </Button>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-10 px-3 py-2 text-sm font-medium bg-transparent hover:underline">
                  Projects
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[800px] grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                    {projectDataForHeader.map((project) => (
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
                              src={project.ProjectImages[0]}
                              alt={project.ProjectName}
                            />
                          </div>
                          <h3 className="font-semibold text-[15px] mb-2 line-clamp-2">{project.ProjectName}</h3>
                          <p className="text-[13px] text-muted-foreground line-clamp-2">{project.ProjectDescription}</p>
                          <span className="text-[13px] text-primary mt-2 inline-block group-hover:underline">
                            View Details →
                          </span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-10 px-3 py-2 text-sm font-medium bg-transparent hover:underline">
                  Products
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[700px] grid-cols-3 gap-6 p-6 justify-items-center ">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-primary text-base mb-3">
                        <Link href="/category/balcom/indoor" className="hover:underline">
                          Indoor
                        </Link>
                      </h4>
                      <ul className="space-y-2">
                        {IndoorItems.map((item) => (
                          <li key={item.id}>
                            <Link
                              href={item.href}
                              className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
                            >
                              {item.spotlightType}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-primary text-base mb-3">
                        <Link href="/category/balcom/outdoor" className="hover:underline">
                          Outdoor
                        </Link>
                      </h4>
                      <ul className="space-y-2">
                        {OutdoorItems.map((item) => (
                          <li key={item.id}>
                            <Link
                              href={item.href}
                              className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
                            >
                              {item.spotlightType}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-primary text-base mb-3">
                        <Link href="/category/mister-led/chandelier" className="hover:underline">
                          Chandelier
                        </Link>
                      </h4>
                      <ul className="space-y-2">
                        {ChandelierItems.slice(0, 12).map((item) => (
                          <li key={item.id}>
                            <Link
                              href={item.href}
                              className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
                            >
                              {item.spotlightType}
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
                    Blog
                  </Button>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact-us" prefetch={false}>
                  <Button
                    variant="ghost"
                    className="h-10 px-3 py-2 text-sm font-medium hover:bg-transparent hover:underline"
                  >
                    Contact
                  </Button>
                </Link>
              </NavigationMenuItem>
              <div className="hidden lg:flex items-center space-x-3">
                <SearchHeader />
                <AuthSectionWrapper>
                  <AuthSection />
                </AuthSectionWrapper>
              </div>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center gap-2 lg:hidden">
            <Sheet>
              <SheetTrigger asChild className="p-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  aria-label="Open navigation menu"
                >
                  <MenuIcon className="h-5 w-5" />
                </Button>
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
                  <nav className="flex flex-col space-y-1 pt-6 flex-1">
                    <SheetClose asChild>
                      <Link
                        href="/about-us"
                        className="flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md hover:bg-accent"
                        prefetch={false}
                      >
                        <UserIcon className="h-4 w-4" />
                        About Us
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/all-projects"
                        className="flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md hover:bg-accent"
                        prefetch={false}
                      >
                        <BriefcaseIcon className="h-4 w-4" />
                        Projects
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/category"
                        className="flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md hover:bg-accent"
                        prefetch={false}
                      >
                        <BoxIcon className="h-4 w-4" />
                        Products
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/blog"
                        className="flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md hover:bg-accent"
                        prefetch={false}
                      >
                        <NewspaperIcon className="h-4 w-4" />
                        Blog
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/contact-us"
                        className="flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md hover:bg-accent"
                        prefetch={false}
                      >
                        <MailIcon className="h-4 w-4" />
                        Contact
                      </Link>
                    </SheetClose>
                    <div className="px-3">
                      <CartSidebar />
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header >
  )
}