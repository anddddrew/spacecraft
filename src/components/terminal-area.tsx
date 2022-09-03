import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

const useTerminal = () => {
    const term = useRef<Terminal | undefined>(undefined);
    const fitAddon = useRef<FitAddon | undefined>(undefined);
    useEffect(() => {
        term.current = new Terminal({ cursorBlink: true, theme: {} });
        fitAddon.current = new FitAddon();
        term.current.loadAddon(fitAddon.current);

        const ws = new WebSocket('wss://h-production.up.railway.app');

        term.current.open(document.getElementById('terminal') ?? document.body);
        term.current.write('\r');
        term.current.onData((data) => {
            console.log('data');
            ws.send(data);
        });
        term.current.onResize(() => {
            fitAddon.current?.fit();
        });
        ws.addEventListener('message', (event) => {
            term.current?.write(event.data);
        });

        return () => {
            console.log('aaaa', term);
            term.current?.dispose();

            term.current = undefined;
            fitAddon.current?.dispose();
            fitAddon.current = undefined;
        };
    }, []);

    return { term, fitAddon };
};

export function TerminalArea() {
    const { fitAddon } = useTerminal();
    fitAddon.current?.fit();
    return (
        <div className="bg-zinc  border-white/25 border-t bg-black overflow-auto min-h-[20rem] h-2/3 max-h-2/3">
            <div className="border-white/25 border-b px-4 py-2 flex justify-between bg-zinc-900 text-xs">Terminal</div>
            <div id="terminal" className="" />
        </div>
    );
}

export default TerminalArea;
//
