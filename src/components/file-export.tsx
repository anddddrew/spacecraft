import { ChevronDownIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import { atom, useAtom } from 'jotai';
import { currentFileAtom } from '../atoms';
import { Button } from '../ds/button';
import { File, Folder } from '../types/fs';
import { FileIcon, FolderLogo } from './icons';

const fsAtom = atom<Folder>({
    name: 'root',
    path: '/',
    open: true,
    files: [
        {
            name: 'README.md',
            path: '/readme.md',
        },
    ],
    folders: [
        {
            name: 'src',
            open: true,
            path: '/src',
            files: [
                {
                    name: 'index.tsx',
                    path: '/src/index.tsx',
                },
                {
                    name: 'button.tsx',
                    path: '/src/button.tsx',
                },
            ],
            folders: [
                {
                    name: 'cool-things',
                    open: true,
                    path: '/src/cool-things',
                    files: [
                        {
                            name: 'very-cool.scss',
                            path: '/src/cool-things/index.tsx',
                        },
                        {
                            name: 'also-cool.tsx',
                            path: '/src/cool-things/button.tsx',
                        },
                    ],
                },
            ],
        },
    ],
});

const File = (file: File) => {
    const [currentFile, setCurrentFileAtom] = useAtom(currentFileAtom);
    const isCurrentFileClass = currentFile?.path === file.path ? 'bg-black text-white' : '  hover:bg-black/[.05] dark:hover:bg-white/[.05]';

    return (
        <button
            className={clsx('flex w-full px-2 py-1 text-sm cursor-pointer select-none transition-colors', isCurrentFileClass)}
            onClick={() => setCurrentFileAtom(() => file)}
        >
            <FileIcon name={file.name} />
            {file.name}
        </button>
    );
};

function findFolder(path: string, folder: Folder): Folder | undefined {
    if (folder.path === path) {
        return folder;
    } else {
        for (const subFolder of folder.folders ?? []) {
            const foundFolder = findFolder(path, subFolder);
            if (foundFolder) {
                return foundFolder;
            }
        }
    }
}

const Folder = ({ folder, hideName, pathToFolder }: { folder: Folder; hideName?: boolean; pathToFolder: string }) => {
    const [, setFs] = useAtom(fsAtom);

    const toggleFolder = () => {
        setFs((prev) => {
            const newFs = { ...prev };
            const currentFolder = findFolder(folder.path, newFs);
            if (currentFolder) {
                currentFolder.open = !currentFolder.open;
            }
            return newFs;
        });
    };

    const containerClassName = (folder.open && folder.files?.length) || folder.folders?.length ? 'border-l border-white/[.15]' : '';

    return (
        <div className={containerClassName}>
            {!hideName && (
                <Button className="flex py-1 text-sm w-full" onClick={toggleFolder}>
                    {!folder.open && <ChevronRightIcon className="mr-1" />}
                    {folder.open && <ChevronDownIcon className="mr-1" />}
                    <FolderLogo name={folder.name} open={folder.open} />
                    {folder.name}
                </Button>
            )}
            {folder.open && (
                <div className="pl-2">
                    {folder.folders?.map((file) => (
                        <Folder key={file.path} folder={file} pathToFolder={pathToFolder + '.' + file.name} />
                    ))}
                    {folder.files?.map((file) => (
                        <File key={file.path} {...file} />
                    ))}
                </div>
            )}
        </div>
    );
};

export function FileExplorer() {
    const [fs] = useAtom(fsAtom);

    return (
        <div className="h-screen min-w-80 w-80 bg-stone-900 border-white/25 border-r text-white text-xs font-mono py-6 px-2">
            <Folder folder={fs} hideName={true} pathToFolder="" />
        </div>
    );
}
