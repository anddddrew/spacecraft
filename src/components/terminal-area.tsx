import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { ITheme, Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';
import { CurrentTab, currentTermTabAtom } from '../atoms';
import { Button } from '../ds/button';

const openClass = `border-[E8198B] border-b-2`;
const closedClass = 'border-black border-b-2';

const termColors: ITheme = {
    background: '#000',
    foreground: '#E8198B',
    black: '#000',
    red: '#E8198B',
    green: '#29D398',
    yellow: '#FFD866',
    blue: '#1E90FF',
    magenta: '#FF0080',
    cyan: '#1E90FF',
    white: '#E5E5E5',
    brightBlack: '#7F7F7F',
    brightRed: '#FF0080',
    brightGreen: '#29D398',
    brightYellow: '#FFD866',
    brightBlue: '#1E90FF',
    brightMagenta: '#FF0080',
    brightCyan: '#1E90FF',
    brightWhite: '#FFFFFF',
    cursor: '#29D398',
};

const useTerminal = () => {
    const term = useRef<{ terminal?: Terminal; fitAddon?: FitAddon; webLinkAddon?: WebLinksAddon; wsMessage?: EventListener }>({});

    useEffect(() => {
        term.current.terminal = new Terminal({ cursorBlink: true, theme: termColors });
        term.current.fitAddon = new FitAddon();
        const terminal = term.current.terminal;
        const fitAddon = term.current.fitAddon;
        const webLinkAddon = new WebLinksAddon();
        terminal.loadAddon(webLinkAddon);
        term.current.terminal.loadAddon(term.current.fitAddon);

        const ws = new WebSocket('wss://h-production.up.railway.app');

        terminal.open(document.getElementById('terminal') ?? document.body);
        terminal.write('\r');

        terminal.onData((data) => ws.send(data));
        terminal.onResize(() => term.current.fitAddon?.fit());

        const handleMessage = (event: MessageEvent<string | Uint8Array>) => term.current.terminal?.write(event.data);
        ws.addEventListener('message', handleMessage, {});

        return () => {
            terminal.dispose();
            fitAddon.dispose();
            ws.close();

            ws.removeEventListener('message', handleMessage, {});
        };
    }, []);

    return term.current;
};

const DatabaseArea = () => {
    return <div className="absolute w-full h-full bg-zinc-900 z-10">db</div>;
};

export function TerminalArea() {
    const [currentTab, setCurrentTab] = useAtom(currentTermTabAtom);
    const term = useTerminal();
    term.fitAddon?.fit();

    const termOpen = currentTab === CurrentTab.terminal;
    const termCss = termOpen ? openClass : closedClass;
    const dbCss = !termOpen ? openClass : closedClass;
    const setTab = (tab: CurrentTab) => () => setCurrentTab(tab);

    return (
        <div className="relative h-1/3">
            <div className="border-white/25 border-b  border-t flex  bg-zinc-900 text-xs">
                <Button className={clsx('h-full px-4 py-2', termCss)} onClick={setTab(CurrentTab.terminal)}>
                    Terminal
                </Button>
                <Button className={clsx('h-full px-4 py-2', dbCss)} onClick={setTab(CurrentTab.database)}>
                    Database
                </Button>
            </div>
            {!termOpen && <DatabaseArea />}
            <div id="terminal" />
        </div>
    );
}

export default TerminalArea;
