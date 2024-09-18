
"use client"
import { motion } from "framer-motion";
import EventOfTheYear from "./EventOfTheYear";
import Explore from "./Explore";
import JetraArriving from "./JetraArriving";
import PastEvents from "./PastEvents";
function BlogContent() {
    const variants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.3
            }
        }
    };
    const targetDate = new Date('2025-03-01T23:59:59');
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={variants}
        >
            <PastEvents />
            <JetraArriving />
            <EventOfTheYear
                targetDate={targetDate}
                eventName="Next Ramadan Eftar"
                eventDescription="Join us for our annual Ramadan Eftar celebration. Experience the joy of breaking fast together with delicious food and great company."
                imageUrl="placeholder.svg"
            />
            <Explore />
        </motion.div>
    )
}

export default BlogContent;