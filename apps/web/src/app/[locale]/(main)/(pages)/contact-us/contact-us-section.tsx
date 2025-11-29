  "use client";
import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/container";
import { motion } from "framer-motion";
import { Check, Facebook, Instagram, Youtube } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function ContactUsSection() {
  const t = useTranslations('contact');

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
      <section className={`w-full px-4 md:px-6 py-12 md:py-16 lg:py-20 bg-background text-foreground`}>
        <Container className="max-w-6xl space-y-12 md:space-y-16 lg:space-y-20">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            {t('title')}
          </h1>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">
                  {t('getInTouch')}
                </h2>
                <p className="text-muted-foreground tracking-wide leading-5">
                  {t('getInTouchDescription')}
                </p>
              </div>
              <div className="space-y-4">
                <h2 className="md:text-xl text-lg font-semibold">{t('salesTeam')}</h2>
                <div className="space-y-2">
                  <div className={`flex flex-row items-center gap-4`}>
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
                        <span>{t('salesManager')}</span>
                      </p>
                      <Link
                        className="font-medium hover:text-primary transition-colors"
                        href={"tel:+201102131731"}
                        dir="ltr"
                      >
                        +2 (011) 02131731
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {t('workingHours')}
                      </p>
                    </div>
                  </div>

                  <div className={`flex flex-row items-center gap-4 flex-wrap`}>
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
                      dir="ltr"
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
                        className={`w-4 h-4 rtl:ml-2 mr-2`}
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      {t('whatsappSupport')}
                    </Link>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="md:text-xl text-lg font-semibold">{t('location')}</h2>
                <div className="space-y-2">
                  <div className={`flex items-center gap-4`}>
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
                        {t('locationAddress')}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {t('workingHours')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="md:text-xl text-lg font-semibold">{t('social')}</h2>
                <div className={`flex items-center gap-4`}>
                  <Link
                    className="text-muted-foreground hover:text-primary transition-colors"
                    href="https://www.instagram.com/artlightingofficial"
                    target="_blank"
                  >
                    <Instagram size={24} />
                    <span className="sr-only">{t('socialLinks.instagram')}</span>
                  </Link>
                  <Link
                    className="text-muted-foreground hover:text-primary transition-colors"
                    href="https://www.facebook.com/ArtLightingOfficial/"
                    target="_blank"
                  >
                    <Facebook size={24} />
                    <span className="sr-only">{t('socialLinks.facebook')}</span>
                  </Link>
                  <Link
                    className="text-muted-foreground hover:text-primary transition-colors"
                    href="https://www.youtube.com/channel/UC__8-8U4dAIgK1JYWvqv5cQ"
                    target="_blank"
                  >
                    <Youtube size={24} />
                    <span className="sr-only">{t('socialLinks.youtube')}</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="md:text-xl text-lg font-semibold">{t('aboutUs')}</h2>
                <p className="text-muted-foreground tracking-wide leading-5">
                  {t('aboutUsDescription')}
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="md:text-xl text-lg font-semibold">{t('ourValues')}</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="tracking-wide">
                    <Check className={`w-5 h-5 inline-block text-primary  rtl:ml-2 mr-2`} />
                    {t('values.integrity')}
                  </li>
                  <li className="tracking-wide">
                    <Check className={`w-5 h-5 inline-block text-primary  rtl:ml-2 mr-2`} />
                    {t('values.innovation')}
                  </li>
                  <li>
                    <Check className={`w-5 h-5 inline-block text-primary  rtl:ml-2 mr-2`} />
                    {t('values.collaboration')}
                  </li>
                  <li className="tracking-wide">
                    <Check className={`w-5 h-5 inline-block text-primary  rtl:ml-2 mr-2`} />
                    {t('values.customerFocus')}
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h2 className="md:text-xl text-lg font-semibold">{t('features')}</h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="tracking-wide">
                    <Check className={`w-5 h-5 inline-block text-primary  rtl:ml-2 mr-2`} />
                    {t('featuresItems.highQuality')}
                  </li>
                  <li className="tracking-wide">
                    <Check className={`w-5 h-5 inline-block text-primary  rtl:ml-2 mr-2`} />
                    {t('featuresItems.warranty')}
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