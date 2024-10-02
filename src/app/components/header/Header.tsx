
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    BoxIcon,
    BriefcaseIcon,
    MailIcon,
    MenuIcon,
    NewspaperIcon,
    ShoppingCartIcon,
    UserIcon,
} from "lucide-react";
import Link from "next/link";
import AuthInDesktop from "./AuthInDesktop";
import AuthInMobile from "./AuthInMobile";
import ContainerAuthInDesktop from "./ContainerAuthInDesktop";
import ContainerAuthInMobile from "./ContainerAuthInMobile";
import { UserButton } from "@clerk/nextjs";

export default function Header() {
    return (
        <header className=" relative top-0 z-50 w-full bg-background shadow-sm">
            <div className=" container flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2" prefetch={false}>
                    <img
                        src={"/Logo.png"}
                        className="md:w-20 md:h-20 w-16 h-16"
                        alt="Art Lighting  Logo"
                    />
                </Link>
                <nav className="hidden lg:flex items-center space-x-6">
                    <NavigationMenu>
                        <NavigationMenuList>
                            <Link href={"/AboutUs"} prefetch={false}>
                                <NavigationMenuItem className="group inline-flex h-12 w-max items-center justify-center rounded-md px-5 py-3 text-[16px] font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                                    About Us
                                </NavigationMenuItem>
                            </Link>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="bg-transparent hover:bg-accent hover:text-accent-foreground">Projects</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="grid w-[800px] grid-cols-3 gap-x-2 p-4 dark:bg-[#1c1a17]" >
                                        <div className="projectCard relative overflow-hidden">
                                            <div className="figureCard relative">
                                                <Link
                                                    scroll={true}
                                                    href=" /All-Projects/Project-one"
                                                    className="imageContainer relative flex justify-center items-center z-10"
                                                >
                                                    <img
                                                        src="/projects/projectTest2.jpg"
                                                        alt="Project one"
                                                        className="w-72 "
                                                    />
                                                </Link>
                                                <div className="textContainer flex flex-col justify-center items-center">
                                                    <h3 className="ProjectDescription  mt-2 mb-2 text-center text-sm tracking-wider">
                                                        Project: The ideal lighting{" "}
                                                    </h3>
                                                    <h4 className="projectDate text-sm font-light text-muted-foreground mb-3">
                                                        More Details
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="projectCard  relative overflow-hidden">
                                            <div className="figureCard relative">
                                                <Link
                                                    scroll={true}
                                                    href=" /All-Projects/Project-six"
                                                    className="imageContainer relative flex justify-center items-center z-10"
                                                >
                                                    <img
                                                        src="/projects/prjecttest3.jpg"
                                                        alt="Project six"
                                                        className="w-72"
                                                    />
                                                </Link>
                                                <div className="textContainer flex flex-col justify-center items-center">
                                                    <h3 className="ProjectDescription mt-2 mb-2 text-center text-sm tracking-wider">
                                                        Project: The ideal lighting{" "}
                                                    </h3>
                                                    <h4 className="projectDate text-sm font-light text-muted-foreground mb-3">
                                                        More Details
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="projectCard  relative overflow-hidden">
                                            <div className="figureCard relative">
                                                <Link
                                                    scroll={true}
                                                    href=" /All-Projects/Project-five"
                                                    className="imageContainer relative flex justify-center items-center z-10"
                                                >
                                                    <img
                                                        src="/projects/projectImage 5.webp"
                                                        alt="Project five"
                                                        className="w-72 h-[10.4rem]"
                                                    />
                                                </Link>
                                                <div className="textContainer flex flex-col justify-center items-center">
                                                    <h3 className="ProjectDescription mt-2 mb-2 text-center text-sm tracking-wider">
                                                        Project: The ideal lighting{" "}
                                                    </h3>
                                                    <h4 className="projectDate text-sm font-light text-muted-foreground mb-3">
                                                        More Details
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="projectCard  relative overflow-hidden">
                                            <div className="figureCard relative">
                                                <Link
                                                    scroll={true}
                                                    href=" /All-Projects/Project-two"
                                                    className="imageContainer relative flex justify-center items-center z-10"
                                                >
                                                    <img
                                                        src="/projects/projectIamge 2.webp"
                                                        alt="Project two"
                                                        className="w-72"
                                                    />
                                                </Link>
                                                <div className="textContainer flex flex-col justify-center items-center">
                                                    <h3 className="ProjectDescription mt-2 mb-2 text-center text-sm tracking-wider">
                                                        Project: The ideal lighting{" "}
                                                    </h3>
                                                    <h4 className="projectDate text-sm font-light text-muted-foreground  ">
                                                        More Details
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="projectCard  relative overflow-hidden">
                                            <div className="figureCard relative">
                                                <Link
                                                    scroll={true}
                                                    href=" /All-Projects/Project-three"
                                                    className="imageContainer relative flex justify-center items-center z-10"
                                                >
                                                    <img
                                                        src="/projects/projectIamge 3.webp"
                                                        alt="Project three"
                                                        className="w-[290px]"
                                                    />
                                                </Link>
                                                <div className="textContainer flex flex-col justify-center items-center">
                                                    <h3 className="ProjectDescription mt-2 mb-2 text-center text-sm tracking-wider">
                                                        Project: The ideal lighting{" "}
                                                    </h3>
                                                    <h4 className="projectDate text-sm font-light text-muted-foreground ">
                                                        More Details
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="bg-transparent hover:bg-accent hover:text-accent-foreground">Products</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="grid w-[700px] grid-cols-3 gap-2 p-4 justify-items-center dark:bg-[#1c1a17]">
                                        <ul className="md:space-y-4 capitalize">
                                            <h4 className="font-bold my-2 text-primary text-xl">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/Balcom/Indoor"}
                                                >
                                                    Indoor
                                                </Link>
                                            </h4>
                                            <li className="inline-flex items-center gap-1 font-medium hover:underline  text-[17px] ">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/Balcom/Indoor/strip"}
                                                >
                                                    strip
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/Balcom/Indoor/linear"}
                                                >
                                                    Linear
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/Balcom/Indoor/family202"}
                                                >
                                                    family202
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/Balcom/Indoor/family500"}
                                                >
                                                    family500
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/Balcom/Indoor/family800"}
                                                >
                                                    family800
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/Balcom/Indoor/family900"}
                                                >
                                                    family900
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={
                                                        "/category/Balcom/Indoor/DoubleSpotlight"
                                                    }
                                                >
                                                    double spotlight
                                                </Link>
                                            </li>
                                        </ul>
                                        <ul className="md:space-y-4  capitalize">
                                            <h4 className="font-bold my-2 text-primary text-xl">
                                                <Link
                                                    scroll={true}
                                                    href={" /category/Balcom/Outdoor"}
                                                >
                                                    Outdoor
                                                </Link>
                                            </h4>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/Balcom/Outdoor/uplight"}
                                                >
                                                    uplight
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/Balcom/Outdoor/Floodlight"}
                                                >
                                                    flood light
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/Balcom/Outdoor/spikes"}
                                                >
                                                    spikes
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/Balcom/Outdoor/Bollard"}
                                                >
                                                    Bollard
                                                </Link>
                                            </li>
                                        </ul>
                                        <ul className="md:space-y-4 capitalize ">
                                            <h4 className="font-bold my-2 text-primary text-xl">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/MisterLed/Chandelier"}
                                                >
                                                    Chandelier
                                                </Link>
                                            </h4>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px] ">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/MisterLed/Chandelier/MC15C"}
                                                >
                                                    MC15C001
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/MisterLed/Chandelier/MC15CF"}
                                                >
                                                    MC15C001F
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/MisterLed/Chandelier/MC15G"}
                                                >
                                                    MC15G
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/MisterLed/Chandelier/MC15P"}
                                                >
                                                    MC15P
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/MisterLed/Chandelier/MC15E"}
                                                >
                                                    MC15E
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/MisterLed/Chandelier/MC1608"}
                                                >
                                                    MC1608
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={" /category/MisterLed/Chandelier/MC6014"}
                                                >
                                                    MC6014
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={" /category/MisterLed/Chandelier/MC6015"}
                                                >
                                                    MC6015
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={" /category/MisterLed/Chandelier/MC6031"}
                                                >
                                                    MC6031
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={" /category/MisterLed/Chandelier/MC6038"}
                                                >
                                                    MC6038
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={" /category/MisterLed/Chandelier/MC6041"}
                                                >
                                                    MC6041
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={" /category/MisterLed/Chandelier/MC6051"}
                                                >
                                                    MC6051
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={" /category/MisterLed/Chandelier/MC6091"}
                                                >
                                                    MC6091
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px] ">
                                                <Link
                                                    scroll={true}
                                                    href={" /category/MisterLed/Chandelier/MC6094"}
                                                >
                                                    MC6094
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <Link href={"/Blog"} prefetch={false}>
                                <NavigationMenuItem className="group inline-flex h-12 w-max items-center justify-center rounded-md px-5 py-3 text-[16px] font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                                    Blog
                                </NavigationMenuItem>
                            </Link>
                            <Link href={"/ContactUs"} prefetch={false}>
                                <NavigationMenuItem className="group inline-flex h-12 w-max items-center justify-center rounded-md px-5 py-3 text-[16px] font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                                    Contact
                                </NavigationMenuItem>
                            </Link>
                        </NavigationMenuList>
                    </NavigationMenu>
                    <div className="flex">
                        <ContainerAuthInDesktop>
                            <AuthInDesktop />
                        </ContainerAuthInDesktop>
                    </div>
                </nav>
                <div className="flex items-center gap-2 lg:hidden">
                    <Sheet>
                        <div className="order-1 flex items-center">
                            <UserButton afterSignOutUrl="/" />
                        </div>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="lg:hidden">
                                <MenuIcon className="h-6 w-6" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <nav className="grid gap-6 text-lg font-medium">
                                <Link
                                    href="/AboutUs"
                                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                    prefetch={false}
                                >
                                    <UserIcon className="h-5 w-5" />
                                    About Us
                                </Link>
                                <Link
                                    href="/All-Projects"
                                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                    prefetch={false}
                                >
                                    <BriefcaseIcon className="h-5 w-5" />
                                    Projects
                                </Link>
                                <Link
                                    href="/category"
                                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                    prefetch={false}
                                >
                                    <BoxIcon className="h-5 w-5" />
                                    Products
                                </Link>
                                <Link
                                    href="/Blog"
                                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                    prefetch={false}
                                >
                                    <NewspaperIcon className="h-5 w-5" />
                                    Blog
                                </Link>
                                <Link
                                    href="/ContactUs"
                                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                    prefetch={false}
                                >
                                    <MailIcon className="h-5 w-5" />
                                    Contact
                                </Link>
                                <ContainerAuthInMobile>
                                    <AuthInMobile />
                                </ContainerAuthInMobile>
                                <Button variant="outline" size="icon" className="relative">
                                    <ShoppingCartIcon className="h-5 w-5" />
                                    <span className="absolute -top-2 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                                        0
                                    </span>
                                </Button>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
