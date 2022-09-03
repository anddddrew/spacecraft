import { FileIcon } from '@/components/icons';
import '@fontsource/fira-code';
import Editor from '@monaco-editor/react';
import { atom, useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import { currentFileAtom } from '../atoms';
import { Deploy } from './deploy';

const content = `
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { prisma } from "../db/client";

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
type CreateContextOptions = Record<string, never>;

/** Use this helper for:
 * - testing, where we dont have to Mock Next.js' req/res
 * - trpc's \`createSSGHelpers\` where we don't have req/res
 **/
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    prisma,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
export const createContext = async (
  opts: trpcNext.CreateNextContextOptions,
) => {
  return await createContextInner({});
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
`;

const editorContentAtom = atom<string | undefined>(undefined);

const useFileEditorAndFile = () => {
    const [editorContent] = useAtom(editorContentAtom);
    const [currentFile] = useAtom(currentFileAtom);
    return { currentFile, editorContent };
};

const DynamicTerminal = dynamic(() => import('../components/terminal-area'), {
    ssr: false,
});

export function CodeEditor() {
    const { currentFile } = useFileEditorAndFile();

    return (
        <div className="w-full text-white h-screen">
            <div className="flex border-white/25 border-b w-full justify-between">
                <div className="flex px-4 py-2">
                    {currentFile && <FileIcon name={currentFile?.name} />} <div className="my-auto">{currentFile?.name ?? '​'} </div>
                </div>
                <Deploy />
            </div>

            <Editor
                defaultValue={content ?? ''}
                path={currentFile?.path}
                height="calc(70vh)"
                theme="hc-black"
                options={{
                    automaticLayout: true,
                }}
            />
            <DynamicTerminal />
        </div>
    );
}
