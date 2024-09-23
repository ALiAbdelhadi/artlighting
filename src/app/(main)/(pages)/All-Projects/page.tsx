import Breadcrumb from '@/app/components/Breadcrumb/Breadcrumb';
import { constructMetadata } from '@/lib/utils';
import AllProjectPage from './AllProjectPage';

const Page = () => {
    return (
        <AllProjectPage>
            <Breadcrumb/>
        </AllProjectPage>
    );
};
export const metadata = constructMetadata({
    title: "Explore all recent projects that we do in the last years",
    description: "Explore all recent projects that we do in the last years",
})
export default Page;
