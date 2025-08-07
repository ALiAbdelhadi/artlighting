"use client";
import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import { Container } from "@repo/ui"
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PrivacySection() {
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
  const [lastUpdate, setLastUpdate] = useState<string>("");
  useEffect(() => {
    const date = new Date();
    const formateDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
    setLastUpdate(formateDate);
  }, []);
  return (
    <motion.div initial="hidden" animate="visible" variants={variants}>
      <Breadcrumb />
      <div className="w-full py-12 md:py-16 lg:py-20 bg-background text-foreground">
        <Container className=" max-w-6xl">
          <div className="grid gap-12">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Privacy Policy
              </h1>
              <p className="mt-4 text-muted-foreground">
                Last updated: {lastUpdate}
              </p>
            </div>
            <div className="grid gap-8">
              <div>
                <h2 className="text-2xl font-bold">
                  1. Personal Data Collection
                </h2>
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">
                      What personal information do we collect?
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      We collect personal information when you create an account
                      or make a purchase on our website. This may include:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-muted-foreground">
                      <li>Names</li>
                      <li>Email addresses</li>
                      <li>Shipping addresses</li>
                      <li>Payment information</li>
                      <li>
                        Any other personal information provided during account
                        creation or purchases
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">2. Use of Personal Data</h2>
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">
                      How do we use your personal data?
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      We use the personal data we collect for the following
                      purposes:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-muted-foreground">
                      <li>To process and fulfill your orders</li>
                      <li>To improve your user experience on our website</li>
                      <li>
                        To send promotional offers and updates about our
                        products (with your consent)
                      </li>
                      <li>
                        To communicate with you about your orders or account
                      </li>
                      <li>
                        To analyze and improve our services and product
                        offerings
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  3. Sharing Data with Third Parties
                </h2>
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">
                      When do we share your data with third parties?
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      We may share your personal data with third parties under
                      the following circumstances:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-muted-foreground">
                      <li>With shipping companies to deliver your orders</li>
                      <li>With payment processors to complete transactions</li>
                      <li>
                        With service providers who assist us in operating our
                        website and conducting our business
                      </li>
                      <li>
                        When required by law or to respond to legal processes
                      </li>
                    </ul>
                    <p className="mt-2 text-muted-foreground">
                      We ensure that any third parties we share data with are
                      bound by confidentiality agreements and are required to
                      respect the security of your personal data.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">4. Data Protection</h2>
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">
                      How do we protect your data?
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      We implement appropriate technical and organizational
                      measures to protect your personal data against
                      unauthorized access, alteration, disclosure, or
                      destruction. These measures include:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-muted-foreground">
                      <li>Encryption of sensitive data</li>
                      <li>Regular security assessments</li>
                      <li>
                        Limited access to personal information by our employees
                      </li>
                      <li>
                        Strict confidentiality agreements with any third parties
                        who may have access to your data
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">5. Your Rights</h2>
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">
                      What rights do you have regarding your personal data?
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      You have the following rights regarding your personal
                      data:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-muted-foreground">
                      <li>The right to access your personal data</li>
                      <li>
                        The right to request correction of inaccurate data
                      </li>
                      <li>The right to request deletion of your data</li>
                      <li>
                        The right to object to or restrict processing of your
                        data
                      </li>
                      <li>The right to data portability</li>
                    </ul>
                    <p className="mt-2 text-muted-foreground">
                      To exercise these rights, please contact us using the
                      information provided at the end of this policy.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">6. Contact Us</h2>
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">
                      How can you contact us about this policy?
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      If you have any questions about this privacy policy or our
                      data practices, please don&apos;t hesitate to contact us:
                    </p>
                    <p className="mt-2 text-muted-foreground">
                      You can reach us by phone at{" "}
                      <Link
                        href="tel:01154466259"
                        className="font-medium hover:text-[#ff8800] transition-colors"
                      >
                        +2 (011) 54466259
                      </Link>
                      , or by email at
                      <Link
                        href="mailto:smartlight.balocm@gamil.com?Subject=Privacy Policy Inquiry"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-[#ff8800] transition-colors"
                      >
                        {" "}
                        artlightingofficial@gamil.com{" "}
                      </Link>
                    </p>
                    <p className="mt-2 text-muted-foreground">
                      We&apos;re available Saturday - Thursday, 9.30am to 5.30pm, and
                      we&apos;ll do our best to respond to your inquiry as quickly as
                      possible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </motion.div>
  );
}
