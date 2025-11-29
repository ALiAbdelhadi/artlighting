import { Container } from "@/components/container";
import { useTranslations } from "next-intl";

export default function MissionAndVision() {
  const t = useTranslations("mission-vision");
  return (
    <div className="py-16">
      <Container>
        <div
          className={`flex my-0 flex-col md:max-w-5xl w-full space-y-12`}
        >
          <div className="space-y-4">
            <h2 className="md:text-4xl text-2xl text-primary font-semibold">
              {t('mission.title')}
            </h2>
            <h3 className="md:text-3xl text-2xl font-medium">
              {t('mission.description')}
            </h3>
          </div>
          <div className="space-y-4">
            <h2 className="md:text-4xl text-2xl text-primary font-semibold">
              {t('vision.title')}
            </h2>
            <h3 className="md:text-3xl text-2xl font-medium">
              {t('vision.description')}
            </h3>
          </div>
        </div>
      </Container>
    </div>
  );
}
