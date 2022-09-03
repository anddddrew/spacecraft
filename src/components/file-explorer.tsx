import { ChevronDownIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import { atom, useAtom } from 'jotai';
import Image from 'next/image';
import { currentFileAtom } from '../atoms';
import { Button } from '../ds/button';
import { Folder } from '../types/fs';
import { FileIcon, FolderLogo } from './icons';

const fsAtom = atom<Folder>({
    name: 'root',
    path: '/',
    open: true,
    children: [
        {
            name: 'README.md',
            path: '/readme.md',
        },
        {
            name: 'cover.png',
            path: '/cover.png',
        },
        {
            name: 'LICENSE.txt',
            path: '/LICENSE.txt',
        },
        {
            name: 'src',
            open: true,
            path: '/src',
            children: [
                {
                    name: 'index.tsx',
                    path: '/src/index.tsx',
                },
                {
                    name: 'button.tsx',
                    path: '/src/button.tsx',
                },
                {
                    name: 'cool-things',
                    open: true,
                    path: '/src/cool-things',
                    children: [
                        {
                            name: 'very-cool.scss',
                            path: '/src/cool-things/very-cool.scss',
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

const File = (file: Folder) => {
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
        return folder as Folder;
    } else {
        for (const subFolder of folder.children ?? []) {
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
        setFs((prev: Folder) => {
            const newFs = { ...prev };
            const currentFolder = findFolder(folder.path, newFs);
            if (currentFolder) {
                currentFolder.open = !currentFolder.open;
            }
            return newFs;
        });
    };

    const containerClassName = !hideName && folder.open && folder.children?.length ? 'border-l border-white/[.15]' : '';

    const folders = folder.children?.filter((file) => !!file.children);
    const files = folder.children?.filter((file) => !file.children);

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
                    {folders?.map((file) => (
                        <Folder key={file.path} folder={file} pathToFolder={pathToFolder + '.' + file.name} />
                    ))}
                    {files?.map((file) => (
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
        <div className="h-screen min-w-80 w-80 bg-zinc-900 border-white/25 border-r text-white text-xs font-mono">
            <div className="flex  border-white/25 border-b mt-3 pb-3 px-3">
                <div className="w-4 aspect-square relative mr-2">
                    <Image src="/logo.svg" alt="" layout="fill"></Image>
                </div>
                SpaceShip
            </div>
            <div className=" px-2">
                <Folder folder={fs} hideName={true} pathToFolder="" />
            </div>
        </div>
    );
}
