import { useEffect, useRef } from 'react';
import { ITheme, Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';

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

export const useTerminal = () => {
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
    term.current.fitAddon?.fit();
    return term.current;
};
