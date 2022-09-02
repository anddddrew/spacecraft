import { atom } from 'jotai';
import { File } from './types/fs';

export const currentFileAtom = atom<File | undefined>(undefined);
