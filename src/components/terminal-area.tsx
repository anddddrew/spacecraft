import clsx from 'clsx';
import { atom, useAtom } from 'jotai';
import 'xterm/css/xterm.css';
import { CurrentTab, currentTermTabAtom } from '../atoms';
import { Button } from '../ds/button';
import { useTerminal } from '../hooks/use-term';

enum DbType {
    Postgres = 'postgres',
    Mysql = 'mysql',
}

type DbInfo = {
    type: DbType;
};

const dbInfoAtom = atom<DbInfo | undefined>(undefined);

const openClass = `border-[E8198B] border-b-2`;
const closedClass = 'border-black border-b-2';

const DbSetup = () => {
    return <div className="flex flex-col w-full h-full">Setup db </div>;
};

const DatabaseArea = () => {
    const [dbInfo] = useAtom(dbInfoAtom);

    return <div className="absolute w-full h-[calc(100%-36px)] bg-zinc-900 z-10"></div>;
};

export function TerminalArea() {
    const [currentTab, setCurrentTab] = useAtom(currentTermTabAtom);
    useTerminal();

    const termOpen = currentTab === CurrentTab.terminal;
    const termCss = termOpen ? openClass : closedClass;
    const dbCss = !termOpen ? openClass : closedClass;
    const setTab = (tab: CurrentTab) => () => setCurrentTab(tab);

    return (
        <div className="relative">
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
