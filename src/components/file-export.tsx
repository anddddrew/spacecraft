import { FileIcon } from '@radix-ui/react-icons';

type File = {
    name: string;
    path: string;
};

type Folder = { path: string; name: string; folders?: Folder; files?: File[] }[];

const useFs = (): Folder => {
    return [
        {
            name: '/',
            path: '/',
            files: [
                {
                    name: 'README.md',
                    path: '/readme.md',
                },
            ],
        },
    ];
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

export function FileExplorer() {
    return <></>;
}
