import type { NextPage } from 'next';
import { FileExplorer } from '../components/file-export';

const Home: NextPage = () => {
    return (
        <>
            <FileExplorer></FileExplorer>
        </>
    );
};

export default Home;
