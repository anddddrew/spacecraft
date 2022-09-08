import { atom, useAtomValue } from 'jotai';

const wsAtom = atom<WebSocket | undefined>(undefined);

let wsSet = false;

wsAtom.onMount = (setAtom) => {
    if (!wsSet && typeof window !== 'undefined') {
        wsSet = true;
        const ws = new WebSocket('wss://example.com/');
        ws.onopen = () => {
            setAtom(ws);
        };
    }
};

export function useWs() {
    return useAtomValue(wsAtom);
}
