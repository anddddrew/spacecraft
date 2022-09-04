export type Folder = { path: string; name: string; children?: Folder[] };

export interface event {
    type: string;
    data: string;
}
