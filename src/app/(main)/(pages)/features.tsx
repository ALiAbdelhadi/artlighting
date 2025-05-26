import Container from "@/components/Container"
import { Badge } from "@/components/ui/badge"
import { Crown, HandCoins, Lightbulb, Truck } from "lucide-react"

export default function Features() {
    const features = [
        {
            icon: Lightbulb,
            title: "Premium Spotlights",
            description: "Professional-grade indoor and outdoor spotlights engineered for superior illumination. Weather-resistant designs with precision beam control for architectural and landscape applications.",
        },
        {
            icon: Crown,
            title: "LED & Lamps Chandeliers",
            description: "Luxury chandelier collections combining timeless elegance with cutting-edge LED technology. Transform any space with sophisticated lighting solutions that deliver both beauty and efficiency.",
        },
        {
            icon: Truck,
            title: "Express 4-Day Delivery",
            description: "Fast-track logistics ensuring your premium lighting solutions arrive within 4 business days. Secure packaging and professional handling guarantee perfect condition upon arrival.",
        },
        {
            icon: HandCoins,
            title: "Cash On Delivery",
            description: "Enjoy hassle-free payments with our Cash on Delivery option. Pay only when your lighting products arrive safely at your doorstep—no cards, no worries.",
        }
    ]

    return (
        <section className="w-full py-12">
            <Container className="max-w-5xl">
                <div className="mb-16 text-center space-y-3">
                    <Badge className="text-sm space-x-3 rounded-xl">
                        Premium Lighting Solutions
                    </Badge>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Illuminate Your Vision
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Experience the perfect fusion of cutting-edge technology and sophisticated design.
                        Our curated collection delivers professional-grade illumination solutions.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="rounded-xl p-6 hover:shadow-md border border-black border-opacity-30 transition-shadow duration-200"
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
    )
}
