import { FileIcon } from '@/components/icons';
import '@fontsource/fira-mono';
import Editor from '@monaco-editor/react';
import { atom, useAtom } from 'jotai';
import { currentFileAtom } from '../atoms';

const editorContentAtom = atom<string | undefined>(undefined);

const useFileEditorAndFile = () => {
    const [editorContent] = useAtom(editorContentAtom);
    const [currentFile] = useAtom(currentFileAtom);
    return { currentFile, editorContent };
};

export function CodeEditor() {
    const { currentFile, editorContent } = useFileEditorAndFile();
    return (
        <div className="flex flex-col w-full text-white">
            <div className="flex h-[4vh] px-4 py-2">
                {currentFile && (
                    <>
                        <FileIcon name={currentFile?.name} /> {currentFile?.name}
                    </>
                )}
            </div>

            <Editor
                height="100%"
                defaultLanguage="javascript"
                defaultValue={editorContent}
                options={{
                    theme: 'hc-black',
                }}
            />
        </div>
    );
}
