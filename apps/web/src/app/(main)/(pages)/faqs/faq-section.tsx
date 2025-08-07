"use client";
import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import { motion } from "framer-motion";
import Link from "next/link";

export default function FAQs() {
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
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-16 lg:py-20 bg-background text-foreground">
        <div className="grid gap-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-muted-foreground ">
              Find answers to your most common questions about our lighting
              products, shipping, returns, and more.
            </p>
          </div>
          <div className="grid gap-8">
            <div>
              <h2 className="text-2xl font-bold">Products</h2>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">
                    What types of lighting do you offer?
                  </h3>
                  <p className="mt-2 text-muted-foreground ">
                    We offer a wide range of high-quality lighting solutions,
                    including LED bulbs, pendant lights, floor lamps, table
                    lamps, and more. Our products are designed to provide both
                    functional and aesthetic value, with a focus on energy
                    efficiency and modern, minimalist styles.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    Do you have any specialty or custom lighting options?
                  </h3>
                  <p className="mt-2 text-muted-foreground ">
                    Yes, we offer custom lighting solutions for both residential
                    and commercial spaces. Our team of lighting experts can work
                    with you to design and create unique fixtures that meet your
                    specific needs and preferences. Whether you&apos;re looking
                    for a one-of-a-kind chandelier or a custom-sized task light,
                    we&apos;re here to help bring your vision to life.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    How do I choose the right lighting for my space?
                  </h3>
                  <p className="mt-2 text-muted-foreground ">
                    Choosing the right lighting for your space can be a bit of a
                    challenge, but we&apos;re here to help. Consider factors
                    like the size and layout of the room, the desired mood and
                    ambiance, and the specific tasks or activities that will be
                    performed in the space. Our product pages include detailed
                    information to help you select the perfect lighting
                    solution, and our customer service team is always available
                    to provide personalized recommendations.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Shipping & Returns</h2>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">
                    How long does it take to receive my order?
                  </h3>
                  <p className="mt-2 text-muted-foreground ">
                    We strive to ship all orders within 1-2 business days of
                    receiving them. Delivery times can vary depending on your
                    location, but we typically see orders arrive within 3-7
                    business days for standard shipping. We also offer expedited
                    shipping options for those who need their items faster.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    What is your return policy?
                  </h3>
                  <p className="mt-2 text-muted-foreground ">
                    We stand behind the quality of our products and want you to
                    be completely satisfied with your purchase. If for any
                    reason you&apos;re not happy with your order, you can return
                    it within 14 days for a full refund. We&apos;ll even cover
                    the cost of return shipping, so you can shop with
                    confidence.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    Do you offer any warranty or guarantee on your products?
                  </h3>
                  <p className="mt-2 text-muted-foreground ">
                    Yes, all of our lighting products come with a 3-year
                    manufacturer&apos;s warranty. If you experience any issues
                    with your purchase, simply contact our customer support team
                    and we&apos;ll be happy to assist you. We&apos;re committed
                    to ensuring your complete satisfaction, and we&apos;ll work
                    with you to resolve any problems you may have.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Technical Support</h2>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">
                    How do I install my new lighting fixture?
                  </h3>
                  <p className="mt-2 text-muted-foreground ">
                    We understand that installing new lighting can be a bit
                    daunting, which is why we provide detailed installation
                    guides with every product. These guides walk you through the
                    step-by-step process, with clear instructions and diagrams
                    to ensure a smooth and successful installation. If you have
                    any questions or run into any issues, our customer support
                    team is always here to help.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    What if I need to replace a part or accessory?
                  </h3>
                  <p className="mt-2 text-muted-foreground ">
                    No problem! We stock a wide range of replacement parts and
                    accessories for all of our lighting products. Simply contact
                    our customer support team, and they&apos;ll be happy to help
                    you identify the specific part you need and walk you through
                    the replacement process. We&apos;re committed to ensuring
                    the longevity of our products and making it easy for you to
                    keep your lighting in top condition.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    How can I get in touch with your customer support team?
                  </h3>
                  <p className="mt-2 text-muted-foreground ">
                    We have a dedicated customer support team available to
                    assist you with any questions or concerns you may have. You
                    can reach us by phone at{" "}
                    <Link
                      href="tel:01154466259"
                      className="font-medium hover:text-[#ff8800] transition-colors"
                    >
                      +2 (011) 54466259
                    </Link>
                    , or by email at
                    <Link
                      href="mailto:smartlight.balocm@gamil.com?Subject=Contact "
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-[#ff8800] transition-colors"
                    >
                      {" "}
                      artlightingofficial@gamil.com{" "}
                    </Link>
                    We&apos;re available Saturday - Thursday, 9.30am to 5.30pm,
                    and we&apos;ll do our best to respond to your inquiry as
                    quickly as possible.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold">About Our Company</h2>
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">
                    What is your company&apos;s mission and values?
                  </h3>
                  <p className="mt-2 text-muted-foreground ">
                    At Art Lighting, our mission is to provide high-quality,
                    energy-efficient lighting solutions that enhance the beauty
                    and functionality of any space. We&apos;re passionate about
                    design, innovation, and sustainability, and we&apos;re
                    committed to delivering exceptional customer service and
                    support. Our core values include honesty, integrity, and a
                    deep respect for the environment.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    Do you have any certifications or awards?
                  </h3>
                  <p className="mt-2 text-muted-foreground ">
                    Yes, we&apos;re proud to be an Energy Star certified
                    partner, and many of our products have earned the Energy
                    Star label for their energy efficiency. We&apos;ve also been
                    recognized by various industry organizations for our
                    commitment to sustainability and design excellence. You can
                    learn more about our certifications and awards on our{" "}
                    <Link
                      href=" /AboutUs"
                      className="text-primary hover:underline"
                      prefetch={false}
                    >
                      About Us
                    </Link>{" "}
                    page.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    How can I get in touch with your team?
                  </h3>
                  <p className="mt-2 text-muted-foreground ">
                    We&apos;re always happy to hear from our customers! If you
                    have any questions, comments, or feedback, please don&apos;t
                    hesitate to reach out. You can contact us by phone at{" "}
                    <Link
                      href="tel:01154466259"
                      className="font-medium hover:text-[#ff8800] transition-colors"
                    >
                      +2 (011) 54466259
                    </Link>
                    , or by email at
                    <Link
                      href="mailto:smartlight.balocm@gamil.com?Subject=Contact "
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-[#ff8800] transition-colors"
                    >
                      {" "}
                      artlightingofficial@gamil.com{" "}
                    </Link>
                    on our website. Our team will be in touch as soon as
                    possible to assist you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
