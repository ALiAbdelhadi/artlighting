import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

const PastEvents = () => {
  return (
    <>
      <Breadcrumb />
      <section className="w-full py-10 md:py-12 lg:py-16">
        <div className="container grid gap-6 px-4 md:px-6">
          <div className="grid gap-2">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
              Previous Events
            </h2>
            <p className="text-muted-foreground md:text-lg">
              Check out our past events showcasing our lighting solutions.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div className="relative group overflow-hidden rounded-lg">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View Event</span>
              </Link>
              <Image
                src="/placeholder.svg"
                alt="Event Image"
                width={400}
                height={300}
                className="object-cover w-full aspect-[4/3] group-hover:opacity-50 transition-opacity"
              />
              <div className="absolute inset-0 bg-black/70 group-hover:opacity-90 transition-opacity p-4 flex flex-col justify-end gap-2">
                <div className="font-medium text-white">
                  Lighting Solutions Showcase
                </div>
                <div className="text-sm text-muted-foreground">
                  June 15, 2023
                </div>
                <p className="text-sm text-white">
                  Discover our latest lighting innovations at this exclusive
                  event.
                </p>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-lg">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View Event</span>
              </Link>
              <Image
                src="/placeholder.svg"
                alt="Event Image"
                width={400}
                height={300}
                className="object-cover w-full aspect-[4/3] group-hover:opacity-50 transition-opacity"
              />
              <div className="absolute inset-0 bg-black/70 group-hover:opacity-90 transition-opacity p-4 flex flex-col justify-end gap-2">
                <div className="font-medium text-white">
                  Outdoor Lighting Showcase
                </div>
                <div className="text-sm text-muted-foreground">
                  April 20, 2023
                </div>
                <p className="text-sm text-white">
                  Explore our cutting-edge outdoor lighting solutions at this
                  event.
                </p>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-lg">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View Event</span>
              </Link>
              <Image
                src="/placeholder.svg"
                alt="Event Image"
                width={400}
                height={300}
                className="object-cover w-full aspect-[4/3] group-hover:opacity-50 transition-opacity"
              />
              <div className="absolute inset-0 bg-black/70 group-hover:opacity-90 transition-opacity p-4 flex flex-col justify-end gap-2">
                <div className="font-medium text-white">
                  Smart Lighting Innovation Summit
                </div>
                <div className="text-sm text-muted-foreground">
                  November 10, 2022
                </div>
                <p className="text-sm text-white">
                  Discover the future of intelligent lighting at our annual
                  summit.
                </p>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-lg">
              <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View Event</span>
              </Link>
              <Image
                src="/placeholder.svg"
                alt="Event Image"
                width={400}
                height={300}
                className="object-cover w-full aspect-[4/3] group-hover:opacity-50 transition-opacity"
              />
              <div className="absolute inset-0 bg-black/70 group-hover:opacity-90 transition-opacity p-4 flex flex-col justify-end gap-2">
                <div className="font-medium text-white">
                  Architectural Lighting Expo
                </div>
                <div className="text-sm text-muted-foreground">
                  September 5, 2022
                </div>
                <p className="text-sm text-white">
                  Explore our latest lighting solutions for architectural
                  projects.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PastEvents;
