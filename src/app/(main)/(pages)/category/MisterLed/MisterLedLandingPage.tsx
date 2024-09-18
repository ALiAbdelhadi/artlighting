import Landing from "@/app/components/Landing/Landing";
function BalcomLandingPage() {
    const images = [
        "/misterLedLanding/landing1.jpg",
    ];
    return (
        <div>
            <Landing images={images} />
        </div>
    );
}

export default BalcomLandingPage;
