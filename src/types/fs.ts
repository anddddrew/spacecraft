export type File = {
    name: string;
    path: string;
};

export type Folder = { path: string; name: string; folders?: Folder[]; open: boolean; files?: File[] };
