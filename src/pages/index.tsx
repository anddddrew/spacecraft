import type { NextPage } from 'next';
import { CodeEditor } from '../components/editor';
import { FileExplorer } from '../components/file-export';

const Home: NextPage = () => {
    return (
        <div className="flex">
            <FileExplorer />
            <CodeEditor />
        </div>
    );
};

export default Home;
