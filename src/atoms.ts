import { atom } from 'jotai';
import { File } from './types/fs';

export enum CurrentTab {
    terminal = 'terminal',
    database = 'database',
}

export const currentTermTabAtom = atom<CurrentTab>(CurrentTab.terminal);
export const currentFileAtom = atom<File | undefined>(undefined);
