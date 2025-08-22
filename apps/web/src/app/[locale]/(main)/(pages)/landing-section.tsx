import Landing from "@/components/landing";

function LandingPage() {
  const images = [
    "/main-landing/landing-4.png",
    "/main-landing/landing-5.jpg",
    "/main-landing/landing-1.png",
    "/main-landing/landing-2.png",
    "/main-landing/landing-3.png",
  ];
  return (
    <div>
      <Landing images={images} />
    </div>
  );
}

export default LandingPage;
