import { FileIcon } from '@radix-ui/react-icons';

type File = {
    name: string;
    path: string;
};

type Folder = { path: string; name: string; folders?: Folder[]; files?: File[] };

const useFs = (): Folder => {
    return {
        name: '/',
        path: '/',
        files: [
            {
                name: 'README.md',
                path: '/readme.md',
            },
        ],
        folders: [
            {
                name: 'src',
                path: '/src',
                files: [
                    {
                        name: 'index.tsx',
                        path: '/src/index.tsx',
                    },
                ],
            },
        ],
    };
};

const useFileLogo = (name: string) => {
    return <FileIcon></FileIcon>;
};

const File = ({ name }: File) => {
    const logo = useFileLogo(name);
    return (
        <div className="flex">
            {logo}
            {name}
        </div>
    );
};

const Folder = ({ name }: File) => {
    const logo = useFileLogo(name);
    return (
        <div className="flex">
            {logo}
            {name}
        </div>
    );
};

export function FileExplorer() {
    const fs = useFs();

    return (
        <div className="h-screen w-80 bg-stone-900 border-white/25  border-r text-white">
            {fs.folders?.length && fs.folders.map((file) => <Folder key={file.path} {...file} />)}
            {fs.files?.length && fs.files.map((file) => <File key={file.path} {...file} />)}
        </div>
    );
}
