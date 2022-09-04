import { AlertDialog, Content, Overlay, Portal, Trigger } from '@radix-ui/react-alert-dialog';
import { atom, useAtom, useAtomValue } from 'jotai';
import { Logo } from '../ds/logo';
import { useWs } from '@/hooks/use-ws';
const deetsOpenAtom = atom(false);

const deploy = async (token: string) => {
    const ws = useWs()
    if (ws) {
        const handleOpen = () => {
            ws.send(JSON.stringify({ "type": "termIn", "data": `hop auth login --token ${token} && hop projects switch && hop deploy` }));
        };
        ws.addEventListener('open', handleOpen, {});
    }
};

const DeployBtn = () => {
    return (
        <div className="rounded-lg m-1 flex text-sm bg-gradient-to-r p-[2px] from-[#C7EAFD] to-[#E8198B] shake-btn mx-4">
            <div className="flex justify-between items-center h-full bg-zinc-900 text-white rounded-lg transition-all px-4 p-2 w-full hover:bg-zinc-900/[.9]">
                <div className="my-auto">Deploy to Hop</div> <Logo className="h-4 my-auto ml-1" />
            </div>
        </div>
    );
};

const DeetsOverlay = () => {
    const [isOpen, setIsOpen] = useAtom(deetsOpenAtom);
    return (
        <AlertDialog>
            <Trigger>
                <DeployBtn />
            </Trigger>

            <Portal>
                <Trigger>
                    <Overlay className="fixed inset-0 bg-black/[.5] absolute" onClick={() => setIsOpen((val) => !val)} />
                </Trigger>
                <Content>
                    <div className="flex flex-col bg-zinc-900 w-1/3 h-1/3 fixed m-auto top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2 rounded-lg">
                        <div className="text-white text-2xl mx-auto mt-12">Please enter your Hop Token</div>
                        <label htmlFor="hop-token" className="text-white text-sm mx-auto mt-12">
                            Hop token
                        </label>
                        <input
                            type="text"
                            id="hop-token"
                            className="bg-transparent text-white border-white/25 border rounded-md w-1/2 mx-auto mt-2"
                        />
                        <div className="mx-auto mt-4 cursor-pointer">
                            <DeployBtn />
                        </div>
                    </div>
                </Content>
            </Portal>
        </AlertDialog>
    );
};

export function Deploy() {
    const deetsOpen = useAtomValue(deetsOpenAtom);
    return (
        <>
            <DeetsOverlay />
        </>
    );
}
