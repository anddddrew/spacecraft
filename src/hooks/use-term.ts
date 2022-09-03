import { useEffect, useRef } from 'react';
import { ITheme, Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';

// hop auth login --token
// hop deploy

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

interface event {
    type: string;
    data: string;
}

export const useTerminal = (termId: string, wsUrl: string, initialCommand: string | undefined) => {
    const term = useRef<{
        terminal?: Terminal;
        fitAddon?: FitAddon;
        webLinkAddon?: WebLinksAddon;
        wsMessage?: EventListener;
        onOpen?: EventListener;
    }>({});

    useEffect(() => {
        if (initialCommand && termId && wsUrl) {
            term.current.terminal = new Terminal({
                cursorBlink: true,
                theme: termColors,
            });
            term.current.fitAddon = new FitAddon();
            term.current.webLinkAddon = new WebLinksAddon();
            const terminal = term.current.terminal;
            const fitAddon = term.current.fitAddon;
            const webLinkAddon = term.current.webLinkAddon;
            terminal.loadAddon(webLinkAddon);
            terminal.loadAddon(fitAddon);

            console.log('command is', initialCommand);
            const ws = new WebSocket(wsUrl);

            const handleMessage = (msg: MessageEvent<string>) => {
                const event: event = JSON.parse(msg.data);
                if (event.type == 'termOut') {
                    terminal?.write(event.data);
                }
            };

            const handleOpen = () => {
                console.log('ws opened');
                terminal.open(document.getElementById(termId) ?? document.body);
                ws.addEventListener('message', handleMessage, {});
                terminal.onData((data) => ws.send(JSON.stringify({ type: 'termIn', data: data })));
                ws.send(JSON.stringify({ type: 'termIn', data: initialCommand + '\r' }));
                terminal.onResize(() => term.current.fitAddon?.fit());
            };

            ws.addEventListener('open', handleOpen, {});

            return () => {
                terminal.dispose();
                fitAddon.dispose();
                ws.close();

                ws.removeEventListener('open', handleOpen, {});
                ws.removeEventListener('message', handleMessage, {});
            };
        }
    }, [initialCommand, termId, wsUrl]);
    term.current.fitAddon?.fit();
    return term.current;
};
