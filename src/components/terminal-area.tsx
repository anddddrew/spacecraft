import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const useTerminal = () => {
    const term = useRef<Terminal | undefined>(undefined);
    useEffect(() => {
        term.current = new Terminal({ cursorBlink: true, cols: 90, rows: 10 });
        const fitAddon = new FitAddon();
        term.current.loadAddon(fitAddon);

        const ws = new WebSocket('wss://h-production.up.railway.app');

        term.current.open(document.getElementById('terminal') ?? document.body);
        term.current.write('\r');
        term.current.onData((data) => {
            ws.send(data);
        });
        term.current.onResize(() => {
            fitAddon.fit();
        });
        ws.addEventListener('message', (event) => {
            term.current?.write(event.data);
        });

        return () => {
            term.current?.dispose();
            term.current = undefined;
        };
    }, []);

    return term;
};

export function TerminalArea() {
    useTerminal();
    console.log('render');
    return (
        <div className="bg-zinc min-h-[20rem] h-1/3  border-white/25 border-t bg-black">
            <div className="border-white/25 border-b px-4 py-2 flex justify-between bg-zinc-900">Terminal</div>
            <div id="terminal" />
        </div>
    );
}

export default TerminalArea;
