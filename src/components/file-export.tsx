import { FileIcon } from '@radix-ui/react-icons';
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

const useFileLogo = (name: string) => {
    return <FileIcon></FileIcon>;
};

const fileIcons: Record<string, string> = {
    src: 'folder-src',
};

const Icon = ({ src }: { src: string }) => (
    <picture className="flex">
        <img src={'/' + src + '.svg'} alt="" className="aspect-square w-4 mr-2 my-auto" />
    </picture>
);

const folderIcons: Record<string, string> = {
    src: 'folder-src',
};

const FolderLogo = ({ name, open }: { name: string; open?: boolean }) => {
    let iconName = folderIcons[name];

    if (open) {
        iconName = iconName + '-open';
    }

    console.log('aaa', iconName);
    return <Icon src={iconName ?? 'folder'} />;
};

const File = ({ name }: File) => {
    const logo = useFileLogo(name);
    return (
        <div className="flex w-full">
            {logo}
            {name}
        </div>
    );
};

const Folder = ({ name }: File) => {
    return (
        <div className="flex w-full">
            <FolderLogo name={name} />
            {name}
        </div>
    );
};

export function FileExplorer() {
    const fs = useFs();

    return (
        <div className="h-screen w-80 bg-stone-900 border-white/25  border-r text-white font-mono px-4 py-6">
            {fs.folders?.length && fs.folders.map((file) => <Folder key={file.path} {...file} />)}
            {fs.files?.length && fs.files.map((file) => <File key={file.path} {...file} />)}
        </div>
    );
}
