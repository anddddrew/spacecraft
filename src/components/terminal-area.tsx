import clsx from 'clsx';
import { useAtom } from 'jotai';
import 'xterm/css/xterm.css';
import { CurrentTab, currentTermTabAtom } from '../atoms';
import { Button } from '../ds/button';
import { useTerminal } from '../hooks/use-term';

const openClass = `border-[E8198B] border-b-2`;
const closedClass = 'border-black border-b-2';

const DatabaseArea = () => {
    return <div className="absolute w-full h-full bg-zinc-900 z-10">db</div>;
};

export function TerminalArea() {
    const [currentTab, setCurrentTab] = useAtom(currentTermTabAtom);
    useTerminal();

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
