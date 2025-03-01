
import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChandelierItems, IndoorItems, OutdoorItems } from "@/constants";
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
import projectsData from "../../../../data/project.json";
import { CartSidebar } from "../CartSidebar";
import AuthInDesktop from "./AuthInDesktop";
import AuthInMobile from "./AuthInMobile";
import ContainerAuthInDesktop from "./ContainerAuthInDesktop";
import ContainerAuthInMobile from "./ContainerAuthInMobile";
interface ProjectProps {
    ProjectId: string;
    ProjectName: string;
    ProjectDate: string;
    ProjectImages: string[];
    ProjectDescription: string;
}
interface ProjectsData {
    projects: {
        [key: string]: ProjectProps;
    };
}
const projectsDataTyped: ProjectsData = projectsData as ProjectsData;
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
                                <NavigationMenuItem className="group inline-flex h-12 w-max items-center justify-center rounded-md px-5 py-3 text-[16px] font-medium transition-all hover:underline ">
                                    About Us
                                </NavigationMenuItem>
                            </Link>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="bg-transparent hover:bg-transparent">Projects</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="grid w-[800px] grid-cols-3 gap-x-2 p-4 dark:bg-[#1c1a17]" >
                                        {Object.keys(projectsDataTyped.projects).slice(0, 6).map((projectKey) => {
                                            const project = projectsDataTyped.projects[projectKey]
                                            return (
                                                <div className="projectCard relative overflow-hidden" key={project.ProjectId}>
                                                    <div className="relative figureCard w-full h-full">
                                                        <Link href={`/all-projects/${project.ProjectId}`} className="relative block">
                                                            <Image width={300}
                                                                height={300}
                                                                className="h-44 rounded-md" src={project.ProjectImages[0]} alt={project.ProjectName} />
                                                        </Link>
                                                        <div className="flex flex-col items-center justify-center mt-4">
                                                            <h3 className="ProjectDescription  mt-2 mb-2 text-center text-sm tracking-wider">{project.ProjectDescription.slice(0, 26)}...</h3>
                                                            <Link href={`/all-projects/${project.ProjectId}`} className="projectDate text-sm font-light text-muted-foreground mb-3">
                                                                More Details
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="bg-transparent hover:bg-transparent">Products</NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <div className="grid w-[700px] grid-cols-3 gap-2 p-4 justify-items-center dark:bg-[#1c1a17]">
                                        <ul className="md:space-y-4  capitalize">
                                            <h4 className="font-bold my-2 text-primary text-xl">
                                                <Link
                                                    scroll={true}
                                                    href={" /category/balcom/indoor"}
                                                >
                                                    indoor
                                                </Link>
                                            </h4>
                                            {IndoorItems.map((IndoorItem) => (
                                                <li className="items-center gap-1 font-medium hover:underline  text-[17px]" key={IndoorItem.id}>
                                                    <Link
                                                        scroll={true}
                                                        href={IndoorItem.href}
                                                    >
                                                        {IndoorItem.spotlightType}
                                                    </Link>
                                                </li>
                                            ))}
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
                                            {OutdoorItems.map((outdoorItem) => (
                                                <li className="items-center gap-1 font-medium hover:underline  text-[17px]" key={outdoorItem.id}>
                                                    <Link
                                                        scroll={true}
                                                        href={outdoorItem.href}
                                                    >
                                                        {outdoorItem.spotlightType}
                                                    </Link>
                                                </li>
                                            ))}
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
                                            {ChandelierItems.slice(0, 12).map((ChandelierItem) => (
                                                <li className="items-center gap-1 font-medium hover:underline  text-[17px]" key={ChandelierItem.id}>
                                                    <Link
                                                        scroll={true}
                                                        href={ChandelierItem.href}
                                                    >
                                                        {ChandelierItem.spotlightType}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                            <Link href={"/blog"} prefetch={false}>
                                <NavigationMenuItem className="group inline-flex h-12 w-max items-center justify-center rounded-md px-5 py-3 text-[16px] font-medium transition-all  hover:underline">
                                    Blog
                                </NavigationMenuItem>
                            </Link>
                            <Link href={"/ContactUs"} prefetch={false}>
                                <NavigationMenuItem className="group inline-flex h-12 w-max items-center justify-center rounded-md px-5 py-3 text-[16px] font-medium transition-all  hover:underline ">
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
