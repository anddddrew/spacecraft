import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const useTerminal = () => {
    const term = useRef<{ terminal?: Terminal; fitAddon?: FitAddon; wsMessage?: EventListener }>({});

    useEffect(() => {
        term.current.terminal = new Terminal({ cursorBlink: true, theme: {} });
        term.current.fitAddon = new FitAddon();
        const terminal = term.current.terminal;
        const fitAddon = term.current.fitAddon;

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
            ws.removeEventListener('message', handleMessage, {});
        };
    }, []);

    return term.current;
};

export function TerminalArea() {
    const term = useTerminal();
    term.fitAddon?.fit();

    return (
        <div className="bg-zinc  border-white/25 border-t bg-black overflow-auto min-h-[20rem] h-2/3 max-h-2/3">
            <div className="border-white/25 border-b px-4 py-2 flex justify-between bg-zinc-900 text-xs">Terminal</div>
            <div id="terminal" className="" />
        </div>
    );
}

export default TerminalArea;
//
