type File = {
    name: string;
    size: number;
};

type Folder = { name: string; folders?: Folder; files?: File[] }[];

const useFs = (): Folder => {
    return [
        {
            name: '/',
            files: [
                {
                    name: 'README.md',

                    size: 1000,
                },
            ],
        },
    ];
};

export function FileExplorer() {
    return <></>;
}
