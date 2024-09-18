import Landing from '@/app/components/Landing/Landing';

function LandingPage() {
    const images = [
        "/mainLanding/landing1.png",
        "/mainLanding/landing2.jpg",
        "/mainLanding/landing3.jpg",
    ];
    return (
        <div>
            <Landing images={images}  />
        </div>
    );
}

export default LandingPage;
