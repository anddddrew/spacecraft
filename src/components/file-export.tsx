import { ChevronRightIcon } from '@radix-ui/react-icons';
import { Button } from '../ds/button';

type File = {
    name: string;
    path: string;
};

type Folder = { path: string; name: string; folders?: Folder[]; open: boolean; files?: File[] };

const useFs = (): Folder => {
    return {
        name: '/',
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
                open: false,
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

const Icon = ({ src }: { src: string }) => (
    <picture className="flex">
        <img src={'/icons/' + src + '.svg'} alt="" className="aspect-square w-4 mr-2 my-auto" />
    </picture>
);

const fileIcons: Record<string, string> = {
    md: 'markdown',
};
const folderIcons: Record<string, string> = {
    src: 'folder-src',
};

const FolderLogo = ({ name, open }: { name: string; open?: boolean }) => {
    let iconName = folderIcons[name];

    if (!open) {
        iconName = iconName + '-open';
    }

    console.log('aaa', iconName);
    return <Icon src={iconName ?? 'folder'} />;
};

const FileIcon = ({ name }: { name: string }) => {
    const fileExt = name.split('.').pop();
    const fileIcon = fileIcons[fileExt ?? ''] ?? 'file';

    return <Icon src={fileIcon} />;
};

const File = ({ name }: File) => {
    return (
        <Button className="flex w-full px-4 py-1 text-sm">
            <FileIcon name={name} />
            {name}
        </Button>
    );
};

const Folder = ({ name }: File) => {
    return (
        <Button className="flex w-full px-4 py-1 text-sm">
            <ChevronRightIcon className="mr-1" />
            <FolderLogo name={name} />
            {name}
        </Button>
    );
};

export function FileExplorer() {
    const fs = useFs();

    return (
        <div className="h-screen w-80 bg-stone-900 border-white/25  border-r text-white font-mono py-6">
            {fs.folders?.length && fs.folders.map((file) => <Folder key={file.path} {...file} />)}
            {fs.files?.length && fs.files.map((file) => <File key={file.path} {...file} />)}
        </div>
    );
}
