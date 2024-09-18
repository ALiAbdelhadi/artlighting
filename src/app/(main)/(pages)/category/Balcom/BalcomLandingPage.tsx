import Landing from "@/app/components/Landing/Landing";

function BalcomLandingPage() {
    const images = [
        "/balcomLanding/landing1.jpg",
        "/balcomLanding/landing2.png",
        "/balcomLanding/landing3.jpg",
    ];
    return (
        <div>
            <Landing images={images}   />
        </div>
    );
}

export default BalcomLandingPage;
