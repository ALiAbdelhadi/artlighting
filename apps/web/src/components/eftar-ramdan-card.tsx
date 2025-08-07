import { cn } from "@repo/ui"
import { motion } from "framer-motion";
import Image from "next/image";
import { fadeIn } from "../lib/motion";

interface EftarRamdanCardProps {
  id: string;
  imgUrl: string;
  title: string;
  index: number;
  active: string;
  handleActive: (id: string) => void;
}
export default function EftarRamdanCard({
  id,
  imgUrl,
  title,
  index,
  active,
  handleActive,
}: EftarRamdanCardProps) {
  return (
    <motion.div
      variants={fadeIn("right", "spring", index * 0.3, 0.75)}
      className={cn(
        "relative flex items-center justify-center min-w-[150px] h-[400px] sm:h-[500px] md:h-[600px] transition-[flex] duration-500 ease-out cursor-pointer",
        active === id ? "lg:flex-[3.5] flex-[10]" : "lg:flex-[0.2] flex-[1.5]",
      )}
      onClick={() => handleActive(id)}
      animate="show"
      initial="hidden"
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Image
        fill
        src={imgUrl}
        alt={title}
        className="absolute h-full object-cover rounded-[20px] sm:rounded-[24px]"
      />
      {active !== id ? (
        <h3 className="font-semibold sm:text-[26px] text-[18px] text-white absolute z-0 lg:bottom-20 lg:rotate-[-90deg] lg:origin-[0,0]">
          {title}
        </h3>
      ) : (
        <div className="absolute bottom-0 p-4 sm:p-6 flex justify-start w-full flex-col bg-black/70 backdrop-blur-[5px] rounded-b-[20px] sm:rounded-b-[24px]">
          <div className="w-[50px] h-[30px] sm:w-[60px] sm:h-[50px] rounded-[20px] sm:rounded-[24px] mb-[12px] sm:mb-[16px]" />
          <h2 className=" font-semibold text-[20px] sm:text-[28px] md:text-[32px] text-white">
            {title}
          </h2>
        </div>
      )}
    </motion.div>
  );
}
