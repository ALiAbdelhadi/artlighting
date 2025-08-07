import { Container } from "@repo/ui";
import Button from "@/components/custom-button";
import Image from "next/image";
function Product() {
  return (
    <div className="pt-16 pb-16">
      <h2 className="text-center text-4xl md:text-5xl font-medium tracking-wide text-gray-800 dark:text-gray-100 mb-16">
        Products
      </h2>
      <Container>
        <div className="flex flex-col lg:flex-row items-start mt-24 pb-16 border-b border-gray-300 border-opacity-35">
          <div className="lg:w-1/4">
            <Image
              src="/indoor/products500/jy-535-5w/JY-535-5W (1).png"
              alt="indoor product jy-539-5w"
              width={500}
              height={500}
            />
          </div>
          <div className="lg:w-2/3 lg:ml-12 mt-2 lg:mt-0">
            <h3 className="sm:text-2xl md:text-3xl text-xl font-medium mb-2 text-primary">
              Indoor Lighting
            </h3>
            <p className="sm:text-lg md:text-xl text-base font-medium text-muted-foreground mb-4 leading-relaxed">
              Indoor lighting is more than just a source of light. It is also a
              powerful tool that can be used to create different moods and
              feelings. Lighting can make a space feel brighter or warmer, more
              formal or more relaxed.
            </p>
            <Button destination="./category/balcom/indoor" />
          </div>
        </div>
      </Container>
      <Container>
        <div className="flex flex-col lg:flex-row items-start mt-24 pb-16 border-b border-gray-300 border-opacity-35">
          <div className="lg:w-1/4">
            <Image
              src="/outdoor/Bollard/JY-BO-001-650MM-8W/JY-BO-001-650MM-8W (1).png"
              alt="outdoor product jy-bo-001-650mm-8w"
              width={500}
              height={500}
            />
          </div>
          <div className="lg:w-2/3 lg:ml-12 mt-2  lg:mt-0">
            <h3 className="sm:text-2xl md:text-3xl text-xl font-medium mb-2 text-primary">
              Outdoor Lighting
            </h3>
            <p className="sm:text-lg md:text-xl text-base font-medium text-muted-foreground mb-4 leading-relaxed">
              Outdoor lighting is more than just a way to see in the dark. It is
              also an important tool for creating ambiance, enhancing safety,
              and extending the use of outdoor spaces. Well-designed outdoor
              lighting can make a space feel more inviting, more secure, and
              more enjoyable.
            </p>
            <Button destination="./category/balcom/outdoor" />
          </div>
        </div>
      </Container>
      <Container>
        <div className="flex flex-col lg:flex-row items-start mt-24">
          <div className="lg:w-1/4">
            <Image
              src="/chandelier/MC6091/MC6091-H3.png"
              alt="chandelier product MC6091-H3"
              width={500}
              height={500}
            />
          </div>
          <div className="lg:w-2/3 lg:ml-12 mt-2 lg:mt-0">
            <h3 className="sm:text-2xl md:text-3xl text-xl font-medium mb-2 text-primary">
              Chandelier
            </h3>
            <p className="sm:text-lg md:text-xl text-base font-medium text-muted-foreground mb-4 leading-relaxed">
              Chandelier lighting is a type of lighting that utilizes a
              chandelier to provide illumination. Chandeliers are typically
              suspended from the ceiling and feature multiple arms that support
              light bulbs or candles. They can be crafted from a diverse range
              of materials, including crystal, glass, metal, and wood.
            </p>
            <Button destination="./category/mister-led/chandelier" />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default Product;
