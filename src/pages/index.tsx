import type { NextPage } from 'next';
import { trpc } from '../utils/trpc';

type TechnologyCardProps = {
    name: string;
    description: string;
    documentation: string;
};

const Home: NextPage = () => {
    const hello = trpc.useQuery(['example.hello', { text: 'from tRPC' }]);

    return <></>;
};

export default Home;
