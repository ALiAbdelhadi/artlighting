import { Container } from "@repo/ui";
import { brands } from "@/constants";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge"

export default function Brand() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <Container>
        <h2 className="font-bold text-2xl md:text-3xl tracking-tight text-center mb-12">
          Our Featured Brands
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((brand) =>
            brand.name === "Balcom" || brand.name === "Mister LED" ? (
              <Link
                href={brand.link}
                key={brand.name}
                className="relative flex flex-col items-center p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  width={250}
                  height={100}
                  className="md:mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{brand.name}</h3>
                <p className="text-muted-foreground text-center mb-4 leading-relaxed">
                  {brand.description}
                </p>
                <span className="inline-flex items-center text-primary font-medium hover:text-primary-dark">
                  Shop {brand.name} <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Link>
            ) : (
              <div
                key={brand.name}
                className="relative flex flex-col items-center p-6 bg-muted/10 rounded-lg shadow-md"
              >
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  width={250}
                  height={100}
                  className="mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{brand.name}</h3>
                <p className="text-muted-foreground text-center mb-4 leading-relaxed">
                  {brand.description}
                </p>
                {brand.name === "Jetra" && (
                  <Badge
                    variant={"destructive"}
                    className="absolute top-0 left-0 rounded-none"
                  >
                    Coming Soon
                  </Badge>
                )}
              </div>
            ),
          )}
        </div>
      </Container>
    </section>
  )
}

