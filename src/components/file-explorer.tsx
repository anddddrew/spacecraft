import { ChevronDownIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';
import { atom, useAtom } from 'jotai';
import Image from 'next/image';
import { useEffect } from 'react';
import { currentFileAtom, fsAtom } from '../atoms';
import { Button } from '../ds/button';
import { useWs } from '../hooks/use-ws';
import { event, Folder } from '../types/fs';
import { FileIcon, FolderLogo } from './icons';

const folderFoldingAtom = atom<Record<string, boolean>>({});

const File = (file: Folder) => {
    const [currentFile, setCurrentFileAtom] = useAtom(currentFileAtom);
    const isCurrentFileClass = currentFile?.path === file.path ? 'bg-black text-white' : '  hover:bg-black/[.05] dark:hover:bg-white/[.05]';

    return (
        <button
            className={clsx('flex w-full px-2 py-1 text-sm cursor-pointer select-none transition-colors', isCurrentFileClass)}
            onClick={() => setCurrentFileAtom(() => file)}
        >
            <FileIcon name={file.name} />
            {file.name}
        </button>
    );
};

const Folder = ({ folder, hideName, pathToFolder, topLevel }: { folder: Folder; hideName?: boolean; pathToFolder: string; topLevel?: true }) => {
    const [folding, setFolding] = useAtom(folderFoldingAtom);

    const toggleFolder = () => {
        setFolding((prev) => {
            const newFs = { ...prev };
            newFs[folder.path] = !newFs[folder.path];
            return newFs;
        });
    };

    const folderOpen = folding[folder.path] || topLevel;

    const containerClassName = !hideName && folderOpen && folder.children?.length ? 'border-l border-white/[.15]' : '';

    const folders = folder.children?.filter((file) => !!file.children);
    const files = folder.children?.filter((file) => !file.children);

    return (
        <div className={containerClassName}>
            {!hideName && (
                <Button className="flex py-1 text-sm w-max" onClick={toggleFolder}>
                    {!folderOpen && <ChevronRightIcon className="mr-1" />}
                    {folderOpen && <ChevronDownIcon className="mr-1" />}
                    <FolderLogo name={folder.name} open={folderOpen} />
                    {folder.name}
                </Button>
            )}
            {folderOpen && (
                <div className="pl-2">
                    {folders?.map((file) => (
                        <Folder key={file.path} folder={file} pathToFolder={pathToFolder + '.' + file.name} />
                    ))}
                    {files?.map((file) => (
                        <File key={file.path} {...file} />
                    ))}
                </div>
            )}
        </div>
    );
};

const useFs = () => {
    const ws = useWs();
    const [fs, setFs] = useAtom(fsAtom);
    useEffect(() => {
        if (!ws) {
            return;
        }
        const handleMessage = (wsEvent: MessageEvent<string>) => {
            const msg: event = JSON.parse(wsEvent.data);
            if (msg.type !== 'tree') {
                return;
            }
            setFs(() => JSON.parse(msg.data));
        };
        ws.addEventListener('message', handleMessage, {});

        return () => {
            ws?.removeEventListener('message', handleMessage);
        };
    }, [setFs, ws]);

    return fs;
};

export function FileExplorer() {
    const fs = useFs();

    return (
        <div className="h-screen min-w-80 w-80 bg-zinc-900 border-white/25 border-r text-white text-xs font-mono">
            <div className="flex  border-white/25 border-b mt-3 pb-3 px-3">
                <div className="w-4 aspect-square relative mr-2">
                    <Image src="/logo.svg" alt="" layout="fill"></Image>
                </div>
                SpaceShip
            </div>
            <div>
                <div className="min-w-80 w-max overflow-x px-2">{fs && <Folder folder={fs} hideName={true} pathToFolder="" topLevel={true} />}</div>
            </div>
        </div>
    );
}
