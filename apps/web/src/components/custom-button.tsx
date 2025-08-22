"use client";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

const Button = ({ destination }: { destination: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations("discover-more");
  return (
    <span className="grid my-6">
      <Link
        href={destination}
        className="relative flex justify-center items-center w-full max-w-[200px] h-[45px] hover:text-primary text-base font-semibold uppercase transition-all duration-800 ease-in cursor-pointer"
        scroll={true}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <svg className="absolute left-0 top-[-1.5px] w-full h-[45px]">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="none"
            stroke={isHovered ? "#f59e0b" : "#9ca3af"}
            strokeWidth={isHovered ? "5" : "2"}
            strokeDasharray={isHovered ? "20, 330" : "450, 0"}
            strokeDashoffset={isHovered ? "20" : "0"}
            className="transition-all duration-800"
            style={{
              transition: isHovered
                ? "all 0.8s cubic-bezier(0.22, 1, 0, 25, 1)"
                : "all var(--transition-time) linear",
            }}
          />
        </svg>
        {t('text')}
      </Link>
    </span>
  );
};

export default Button;
