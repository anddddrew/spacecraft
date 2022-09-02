import { ChevronDownIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { atom, useAtom } from 'jotai';
import { Button } from '../ds/button';

type File = {
    name: string;
    path: string;
};

type Folder = { path: string; name: string; folders?: Folder[]; open: boolean; files?: File[] };

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
                            path: '/src/index.tsx',
                        },
                        {
                            name: 'also-cool.tsx',
                            path: '/src/button.tsx',
                        },
                    ],
                },
            ],
        },
    ],
});

const Icon = ({ src }: { src: string }) => (
    <picture className="flex">
        <img src={'/icons/' + src + '.svg'} alt="" className="aspect-square w-4 mr-2 my-auto" />
    </picture>
);

const fileIcons: Record<string, string> = {
    md: 'markdown',
    tsx: 'react_ts',
    jsx: 'react',
    scss: 'sass',
};
const folderIcons: Record<string, string> = {
    src: 'folder-src',
};

const FolderLogo = ({ name, open }: { name: string; open?: boolean }) => {
    let iconName = folderIcons[name];

    if (!open) {
        iconName = iconName + '-open';
    }

    return <Icon src={iconName ?? 'folder'} />;
};

const FileIcon = ({ name }: { name: string }) => {
    const fileExt = name.split('.').pop();
    const fileIcon = fileIcons[fileExt ?? ''] ?? 'file';

    return <Icon src={fileIcon} />;
};

const File = ({ name }: File) => {
    return (
        <Button className="flex w-full px-2 py-1 text-sm">
            <FileIcon name={name} />
            {name}
        </Button>
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
    const [fs, setFs] = useAtom(fsAtom);

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

    return (
        <>
            {!hideName && (
                <Button className="flex py-1 text-sm" onClick={toggleFolder}>
                    {!folder.open && <ChevronRightIcon className="mr-1" />}
                    {folder.open && <ChevronDownIcon className="mr-1" />}
                    <FolderLogo name={folder.name} />
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
        </>
    );
};

export function FileExplorer() {
    const [fs] = useAtom(fsAtom);

    return (
        <div className="h-screen w-80 bg-stone-900 border-white/25 border-r text-white font-mono py-6 px-2">
            <Folder folder={fs} hideName={true} pathToFolder="" />
        </div>
    );
}
