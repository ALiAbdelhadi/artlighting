import { Container } from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { HandCoins, LampCeiling, Lightbulb, Truck } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Features() {
    const t = useTranslations('features');

    const features = [
        {
            icon: Lightbulb,
            title: t("feature-spotlights-title"),
            description: t("feature-spotlights-description"),
        },
        {
            icon: LampCeiling,
            title: t("feature-chandeliers-title"),
            description: t("feature-chandeliers-description"),
        },
        {
            icon: Truck,
            title: t("feature-delivery-title"),
            description: t("feature-delivery-description"),
        },
        {
            icon: HandCoins,
            title: t("feature-cash-title"),
            description: t("feature-cash-description"),
        }
    ];

    return (
        <section className="w-full py-12">
            <Container>
                <div className="mb-16 space-y-3">
                    <Badge className="text-sm space-x-3 rounded-xl">
                        {t("features-badge")}
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        {t("features-title")}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        {t("features-description")}
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="rounded-xl p-6 hover:shadow-md bg-muted/20 border border-border transition-shadow duration-200"
                        >
                            <div className="h-12 w-12 rounded-lg flex items-center justify-center mb-5 bg-muted/30">
                                <feature.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-semibold text-primary mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
