
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserButton } from "@clerk/nextjs";
import {
    BoxIcon,
    BriefcaseIcon,
    MailIcon,
    MenuIcon,
    NewspaperIcon,
    UserIcon
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CartSidebar } from "../CartSidebar";
import AuthInDesktop from "./AuthInDesktop";
import AuthInMobile from "./AuthInMobile";
import ContainerAuthInDesktop from "./ContainerAuthInDesktop";
import ContainerAuthInMobile from "./ContainerAuthInMobile";

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
                            <Link href={"/about-us"} prefetch={false}>
                                <NavigationMenuItem className="group inline-flex h-12 w-max items-center justify-center rounded-md px-5 py-3 text-[16px] font-medium ">
                                    About Us
                                </NavigationMenuItem>
                            </Link>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="bg-transparent">Projects</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="grid w-[800px] grid-cols-3 gap-x-2 p-4 dark:bg-[#1c1a17]" >
                                        <div className="projectCard relative overflow-hidden">
                                            <div className="figureCard relative">
                                                <Link
                                                    scroll={true}
                                                    href=" /all-projects/dar-misr"
                                                    className="imageContainer relative flex justify-center items-center z-10"
                                                >
                                                    <Image
                                                        src="/projects/dar-misr/dar-misr-1.jpg"
                                                        alt="Dar-Misr Project"
                                                        width={300}
                                                        height={300}
                                                        className="h-44"
                                                    />
                                                </Link>
                                                <div className="textContainer flex flex-col justify-center items-center">
                                                    <h3 className="ProjectDescription  mt-2 mb-2 text-center text-sm tracking-wider">
                                                        Dar-Misr Project{" "}
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
                                                    href=" /all-projects/tolip"
                                                    className="imageContainer relative flex justify-center items-center z-10"
                                                >
                                                    <Image
                                                        src="/projects/tolip/tolip-1.jpg"
                                                        alt="Tolip Project"
                                                        width={300}
                                                        height={300}
                                                        className="h-44"
                                                    />
                                                </Link>
                                                <div className="textContainer flex flex-col justify-center items-center">
                                                    <h3 className="ProjectDescription mt-2 mb-2 text-center text-sm tracking-wider">
                                                        Tolip Project{" "}
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
                                                    href="/all-projects/al-majd"
                                                    className="imageContainer relative flex justify-center items-center z-10"
                                                >
                                                    <Image
                                                        src="/projects/al-majd/al-majd-1.jpg"
                                                        alt="Al-Majd Project"
                                                        width={300}
                                                        height={300}
                                                        className="h-44"
                                                    />
                                                </Link>
                                                <div className="textContainer flex flex-col justify-center items-center">
                                                    <h3 className="ProjectDescription mt-2 mb-2 text-center text-sm tracking-wider">
                                                        Al-Majd Project{" "}
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
                                                    href=" /all-projects/Project-two"
                                                    className="imageContainer relative flex justify-center items-center z-10"
                                                >
                                                    <Image
                                                        src="/projects/projectIamge 2.webp"
                                                        alt="Project two"
                                                        width={300}
                                                        height={300}
                                                        className="h-44"
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
                                                    href=" /all-projects/Project-three"
                                                    className="imageContainer relative flex justify-center items-center z-10"
                                                >
                                                    <img
                                                        src="/projects/projectIamge 3.webp"
                                                        alt="Project three"
                                                        width={300}
                                                        height={300}
                                                        className="h-44"
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
                                                    href={"/category/balcom/indoor"}
                                                >
                                                    Indoor
                                                </Link>
                                            </h4>
                                            <li className="inline-flex items-center gap-1 font-medium hover:underline  text-[17px] ">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/balcom/indoor/strip"}
                                                >
                                                    strip
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/balcom/indoor/linear"}
                                                >
                                                    Linear
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/balcom/indoor/family202"}
                                                >
                                                    family202
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/balcom/indoor/family500"}
                                                >
                                                    family500
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/balcom/indoor/family800"}
                                                >
                                                    family800
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/balcom/indoor/family900"}
                                                >
                                                    family900
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={
                                                        "/category/balcom/indoor/DoubleSpotlight"
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
                                                    href={" /category/balcom/Outdoor"}
                                                >
                                                    Outdoor
                                                </Link>
                                            </h4>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/balcom/Outdoor/uplight"}
                                                >
                                                    uplight
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/balcom/Outdoor/Floodlight"}
                                                >
                                                    flood light
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/balcom/Outdoor/spikes"}
                                                >
                                                    spikes
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/balcom/Outdoor/Bollard"}
                                                >
                                                    Bollard
                                                </Link>
                                            </li>
                                        </ul>
                                        <ul className="md:space-y-4 capitalize ">
                                            <h4 className="font-bold my-2 text-primary text-xl">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/mister-led/chandelier"}
                                                >
                                                    Chandelier
                                                </Link>
                                            </h4>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px] ">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/mister-led/chandelier/MC15C"}
                                                >
                                                    MC15C001
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/mister-led/chandelier/MC15CF"}
                                                >
                                                    MC15C001F
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/mister-led/chandelier/MC15G"}
                                                >
                                                    MC15G
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/mister-led/chandelier/MC15P"}
                                                >
                                                    MC15P
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/mister-led/chandelier/MC15E"}
                                                >
                                                    MC15E
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={"/category/mister-led/chandelier/MC1608"}
                                                >
                                                    MC1608
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={" /category/mister-led/chandelier/MC6014"}
                                                >
                                                    MC6014
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={" /category/mister-led/chandelier/MC6015"}
                                                >
                                                    MC6015
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={" /category/mister-led/chandelier/MC6031"}
                                                >
                                                    MC6031
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={" /category/mister-led/chandelier/MC6038"}
                                                >
                                                    MC6038
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={" /category/mister-led/chandelier/MC6041"}
                                                >
                                                    MC6041
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={" /category/mister-led/chandelier/MC6051"}
                                                >
                                                    MC6051
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px]">
                                                <Link
                                                    scroll={true}
                                                    href={" /category/mister-led/chandelier/MC6091"}
                                                >
                                                    MC6091
                                                </Link>
                                            </li>
                                            <li className="items-center gap-1 font-medium hover:underline  text-[17px] ">
                                                <Link
                                                    scroll={true}
                                                    href={" /category/mister-led/chandelier/MC6094"}
                                                >
                                                    MC6094
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <Link href={"/blog"} prefetch={false}>
                                <NavigationMenuItem className="group inline-flex h-12 w-max items-center justify-center rounded-md px-5 py-3 text-[16px] font-medium ">
                                    Blog
                                </NavigationMenuItem>
                            </Link>
                            <Link href={"/ContactUs"} prefetch={false}>
                                <NavigationMenuItem className="group inline-flex h-12 w-max items-center justify-center rounded-md px-5 py-3 text-[16px] font-medium ">
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
                <div className="flex items-center gap-2 lg:hidden ">
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
                        <SheetContent side="right" className="w-[300px] sm:w-[400px] pt-12">
                            <nav className="grid gap-6 text-lg font-medium">
                                <SheetClose asChild>
                                    <Link
                                        href="/AboutUs"
                                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                        prefetch={false}
                                    >
                                        <UserIcon className="h-5 w-5" />
                                        About Us
                                    </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link
                                        href="/all-projects"
                                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                        prefetch={false}
                                    >
                                        <BriefcaseIcon className="h-5 w-5" />
                                        Projects
                                    </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link
                                        href="/category"
                                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                        prefetch={false}
                                    >
                                        <BoxIcon className="h-5 w-5" />
                                        Products
                                    </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link
                                        href="/blog"
                                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                        prefetch={false}
                                    >
                                        <NewspaperIcon className="h-5 w-5" />
                                        Blog
                                    </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                    <Link
                                        href="/ContactUs"
                                        className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                        prefetch={false}
                                    >
                                        <MailIcon className="h-5 w-5" />
                                        Contact
                                    </Link>
                                </SheetClose>
                                <ContainerAuthInMobile>
                                    <AuthInMobile />
                                </ContainerAuthInMobile>
                                <CartSidebar />
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
