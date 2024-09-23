import Breadcrumb from '@/app/components/Breadcrumb/Breadcrumb';
import { constructMetadata } from '@/lib/utils';
import AboutLanding from './AboutLanding/AboutLanding';
import Achievements from './achievements/achievements';
import Mission from './MissionAndVision/Mission';
import Product from './product/product';
const AboutUsPage = () => {
    return (
        <div>
            <Breadcrumb />
            <AboutLanding />
            <Achievements />
            <Mission />
            <Product />
        </div>
    );
};
export const metadata = constructMetadata({
    title: "About Us - Art lighting | Your Lighting Store",
    description: "About our Company, what we serve , Mission and Vision",
})
export default AboutUsPage;