import { atom } from 'jotai';
import { Folder } from './types/fs';

export enum CurrentTab {
    terminal = 'terminal',
    database = 'database',
}

export const currentTermTabAtom = atom<CurrentTab>(CurrentTab.terminal);
export const currentFileAtom = atom<File | undefined>(undefined);

export const fsAtom = atom<Folder>({
    name: 'root',
    path: '/',
});
