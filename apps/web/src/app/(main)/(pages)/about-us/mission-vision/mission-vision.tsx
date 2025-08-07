import { Container } from "@repo/ui"
export default function MissionAndVision() {
  return (
    <div className="py-16">
      <Container>
        <div
          className={`flex my-[0] flex-col md:max-w-screen-lg w-full space-y-12`}
        >
          <div className="space-y-4">
            <h2 className="md:text-4xl text-2xl text-primary font-semibold">
              Our Mission
            </h2>
            <h3 className="md:text-3xl text-2xl font-medium">
              Our mission is to recognize the world about the actual lighting
            </h3>
          </div>
          <div className="space-y-4">
            <h2 className="md:text-4xl text-3xl text-primary font-semibold">
              Our Vision
            </h2>
            <h3 className={"md:text-3xl text-2xl font-medium mt-[50px]"}>
              To be the leader in shaping human experience through innovative
              lighting solutions. We envision a world where light actively
              enhances environments, fostering well-being, productivity, and
              focus.
            </h3>
          </div>
        </div>
      </Container>
    </div>
  );
}
