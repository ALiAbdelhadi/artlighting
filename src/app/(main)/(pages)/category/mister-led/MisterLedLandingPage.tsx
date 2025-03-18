import Landing from "@/app/components/Landing/Landing";
function BalcomLandingPage() {
  const images = [
    "/misterled-landing/landing-2.png",
    "/misterled-landing/landing-1.jpg",
  ];
  return (
    <div>
      <Landing images={images} />
    </div>
  );
}

export default BalcomLandingPage;
