import clsx from 'clsx';
import { atom, useAtom } from 'jotai';
import 'xterm/css/xterm.css';
import { CurrentTab, currentTermTabAtom } from '../atoms';
import { Button } from '../ds/button';
import { useTerminal } from '../hooks/use-term';

enum DbType {
    Postgres = 'postgres',
    Redis = 'redis',
}

const dbCommand: Record<string, string> = {
    redis: 'redis-cli -u redis://default:wzVWFk5ZiNpD8z1Ox8zQ@containers-us-west-80.railway.app:7116\r',
    postgres: 'PGPASSWORD=rIgYdOHEckAGFSQyiQqj psql -h containers-us-west-21.railway.app -U postgres -p 6074 -d railway\r',
};

type DbInfo = {
    type: DbType;
};

const dbInfoAtom = atom<DbInfo | undefined>(undefined);

const openClass = `border-[E8198B] border-b-2`;
const closedClass = 'border-transparent border-b-2';

const DbSetup = () => {
    const [, setDbInfo] = useAtom(dbInfoAtom);
    const selectDb = (type: DbType) => () => setDbInfo({ type });

    return (
        <div className="w-full h-full grid place-content-center">
            <div className="mb-4">Chose a database type:</div>

            <Button className="flex justify-center py-2 m-auto rounded-lg px-2" onClick={selectDb(DbType.Redis)}>
                <picture className="my-auto mr-2 w-4 aspect-square">
                    <img src="/redis.svg" alt="redis logo" />
                </picture>
                Redis
            </Button>
            <Button className="flex justify-center py-2 m-auto rounded-lg px-2" onClick={selectDb(DbType.Postgres)}>
                <picture className="my-auto mr-2 w-4 aspect-square">
                    <img src="/postgres.png" alt="redis logo" />
                </picture>
                postgres
            </Button>
        </div>
    );
};

const DbTerm = () => {
    const [dbInfo] = useAtom(dbInfoAtom);

    useTerminal('db-term', 'wss://example.com/', dbCommand[dbInfo?.type ?? '']);

    return <div id="db-term"></div>;
};
const DatabaseArea = () => {
    const [dbInfo] = useAtom(dbInfoAtom);

    return (
        <div className="absolute w-full h-[calc(100%-36px)] bg-zinc-900 z-10">
            {!dbInfo && <DbSetup />}
            {dbInfo && <DbTerm />}
        </div>
    );
};

export function TerminalArea() {
    const [currentTab, setCurrentTab] = useAtom(currentTermTabAtom);
    const repo = window.location.hash.substr(1);
    let initCmd = `\r`
    if(repo){
        initCmd = initCmd.concat("git clone ", repo, "\r")
    }
    const { fitAddon } = useTerminal('terminal', 'wss://example.com/', initCmd);

    const termOpen = currentTab === CurrentTab.terminal;
    const termCss = termOpen ? openClass : closedClass;
    const dbCss = !termOpen ? openClass : closedClass;
    const setTab = (tab: CurrentTab) => () => setCurrentTab(tab);
    fitAddon?.fit();
    return (
        <div className="relative ">
            <div className="border-white/25 border-b border-t flex bg-zinc-900 text-xs">
                <Button className={clsx('h-full px-4 py-2', termCss)} onClick={setTab(CurrentTab.terminal)}>
                    Terminal
                </Button>
                <Button className={clsx('h-full px-4 py-2', dbCss)} onClick={setTab(CurrentTab.database)}>
                    Database
                </Button>
            </div>
            {!termOpen && <DatabaseArea />}
            <div id="terminal" className="h-full" />
        </div>
    );
}

export default TerminalArea;
