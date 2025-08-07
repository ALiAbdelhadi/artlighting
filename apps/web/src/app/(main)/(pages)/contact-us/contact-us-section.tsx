"use client";
import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import { Container } from "@repo/ui"
import { motion } from "framer-motion";
import { Check, Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";
export default function ContactUsSection() {
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
      <Breadcrumb />
      <section className="w-full px-4 md:px-6 py-12 md:py-16 lg:py-20 bg-background text-foreground">
        <Container className="max-w-6xl space-y-12 md:space-y-16 lg:space-y-20">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Contact Us
          </h1>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold ">
                  Get in touch
                </h2>
                <p className="text-muted-foreground tracking-wide leading-5">
                  Have a question or want to work with us? Reach out and
                  we&apos;ll get back to you as soon as we can.
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="md:text-xl text-lg font-semibold">Sales Team</h2>
                <div className="space-y-2">
                  <div className="flex flex-row items-center gap-4 ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-6 h-6 text-primary"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <div>
                      <p className="font-medium">
                        <span className="">Sales Manager</span>
                      </p>
                      <Link
                        className="font-medium hover:text-primary transition-colors"
                        href={"tel:+201102131731"}
                      >
                        +2 (011) 02131731
                      </Link>
                      <p className="text-sm text-muted-foreground">
                          Saturday - Thursday, 9.30am - 5.30pm
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-4 flex-wrap">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-6 h-6 text-primary"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <Link
                      className="font-medium hover:text-primary transition-colors"
                      href={"tel:+201154466259"}
                    >
                      +2 (011) 54466259
                    </Link>
                    <Link
                      className="flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#25D366] hover:bg-[#25D366]/90 h-10 px-4 py-2 text-sm text-white"
                      href="https://wa.me/201154466259"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-4 h-4 mr-2"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      24/7 WhatsApp support
                    </Link>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="md:text-xl text-lg font-semibold">Location</h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sm:w-8 sm:h-8 h-6 w-6 text-primary"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <div>
                      <Link
                        className="font-medium tracking-wide leading-5 hover:text-primary transition-colors text-wrap"
                        href="https://maps.app.goo.gl/dPppgdkCGUycMwJH6?g_st=aw"
                        target="_blank"
                      >
                        49 El Shaheed Sayed Zakaria, Sheraton Al Matar, El
                        Nozha, Cairo Governorate, EG
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        Saturday - Thursday, 9.30am - 5.30pm
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="md:text-xl text-lg font-semibold">Social</h2>
                <div className="flex items-center gap-4">
                  <Link
                    className="text-muted-foreground hover:text-primary transition-colors"
                    href="https://www.instagram.com/artlightingofficial"
                    target="_blank"
                  >
                    <Instagram size={24} />
                    <span className="sr-only">Instagram</span>
                  </Link>
                  <Link
                    className="text-muted-foreground hover:text-primary transition-colors"
                    href="https://www.facebook.com/ArtLightingOfficial/"
                    target="_blank"
                  >
                    <Facebook size={24} />
                    <span className="sr-only">Facebook</span>
                  </Link>
                  <Link
                    className="text-muted-foreground hover:text-primary transition-colors"
                    href="https://www.youtube.com/channel/UC__8-8U4dAIgK1JYWvqv5cQ"
                    target="_blank"
                  >
                    <Youtube size={24} />
                    <span className="sr-only">YouTube</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="md:text-xl text-lg font-semibold">About Us</h2>
                <p className="text-muted-foreground tracking-wide leading-5">
                  We are a team of passionate designers and developers who love
                  creating beautiful and functional products. Our mission is to
                  empower businesses of all sizes to create amazing digital
                  experiences.
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="md:text-xl text-lg font-semibold">Our Values</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="tracking-wide">
                    <Check className="w-5 h-5 mr-2 inline-block text-primary" />
                    Integrity: We are honest, ethical, and transparent in all
                    our dealings.
                  </li>
                  <li className="tracking-wide">
                    <Check className="w-5 h-5 mr-2 inline-block text-primary" />
                    Innovation: We are constantly exploring new ideas and
                    technologies to stay ahead of the curve.
                  </li>
                  <li>
                    <Check className="w-5 h-5 mr-2 inline-block text-primary" />
                    Collaboration: We believe in working together to achieve
                    greatness.
                  </li>
                  <li className="tracking-wide">
                    <Check className="w-5 h-5 mr-2 inline-block text-primary" />
                    Customer Focus: We are dedicated to providing exceptional
                    customer service and support.
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h2 className="md:text-xl text-lg font-semibold">Features</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="tracking-wide">
                    <Check className="w-5 h-5 mr-2 inline-block text-primary" />
                    High quality , durable material.
                  </li>
                  <li className="tracking-wide">
                    <Check className="w-5 h-5 mr-2 inline-block text-primary" />
                    <span>3</span> years warranty on all products.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </motion.div>
  );
}
