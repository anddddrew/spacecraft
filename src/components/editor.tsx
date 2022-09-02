import { FileIcon } from '@/components/icons';
import '@fontsource/fira-mono';
import Editor from '@monaco-editor/react';
import { atom, useAtom } from 'jotai';
import { currentFileAtom, showTerminalAtom } from '../atoms';
import { Terminal } from './terminal';

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
    const [showTerminal] = useAtom(showTerminalAtom);
    const [editorContent] = useAtom(editorContentAtom);
    const [currentFile] = useAtom(currentFileAtom);
    return { currentFile, editorContent, showTerminal };
};

export function CodeEditor() {
    const { currentFile, editorContent, showTerminal } = useFileEditorAndFile();

    return (
        <div className="flex flex-col w-full text-white max-h-screen">
            <div className="flex  px-4 py-2 border-white/25 border-b">
                {currentFile && <FileIcon name={currentFile?.name} />} <div className="my-auto">{currentFile?.name ?? '​'} </div>
            </div>

            <Editor
                defaultValue={content ?? ''}
                path={currentFile?.path}
                options={{
                    theme: 'hc-black',
                    automaticLayout: true,
                }}
            />
            {showTerminal && <Terminal />}
        </div>
    );
}
