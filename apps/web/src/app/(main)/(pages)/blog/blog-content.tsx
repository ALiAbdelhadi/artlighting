"use client";
import { motion } from "framer-motion";
import JetraArriving from "./jetra-arriving";
function BlogContent() {
  const variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.3,
      },
    },
  };
  return (
    <motion.div initial="hidden" animate="visible" variants={variants}>
      <JetraArriving />
    </motion.div>
  );
}

export default BlogContent;
