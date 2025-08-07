"use client";
import { Button } from "@repo/ui/button";
import { DASHBOARDS } from "@/constant";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { cn } from "@repo/ui";

const Layout = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = usePathname();
  const toggleSideBar = () => {
    setIsOpen(!isOpen);
  };
  const sidebarVariants = {
    open: {
      width: 250,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    closed: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  };
  return (
    <div className="relative z-50">
      <motion.aside
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed left-0 top-0 z-40 h-screen bg-white text-black shadow-lg overflow-hidden"
        style={{ width: isOpen ? 250 : 0, opacity: isOpen ? 1 : 0 }}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-bold">Dashboard</h2>
          </div>
          <nav className="flex-1 space-y-2 p-4">
            {DASHBOARDS.map((dash) => {
              const isCurrent = pathName.endsWith(dash.url);
              return (
                <Link
                  key={dash.name}
                  href={dash.url}
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-lg transition-colors",
                    {
                      "bg-primary text-white": isCurrent,
                      "hover:bg-primary/50": !isCurrent,
                    },
                  )}
                >
                  {dash.icon}
                  <span>{dash.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.aside>
      <Button
        onClick={toggleSideBar}
        className={cn(
          "fixed left-0 top-10 z-50 rounded-r-lg bg-primary p-2 text-white transition-all duration-300",
          { "left-[250px]": isOpen, "left-0": !isOpen },
        )}
        aria-label={isOpen ? "close sidebar" : "Open sidebar"}
      >
        {isOpen ? (
          <ChevronLeft className="w-6 h-6" />
        ) : (
          <ChevronRight className="w-6 h-6" />
        )}
      </Button>
      {children}
    </div>
  );
};

export default Layout;
