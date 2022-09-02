import { atom } from 'jotai';
import { File } from './types/fs';

export const showTerminalAtom = atom<boolean>(true);
export const currentFileAtom = atom<File | undefined>(undefined);
