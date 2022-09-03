import { Logo } from '../ds/logo';

export function Deploy() {
    return (
        <button className="rounded-lg m-1 flex text-sm bg-gradient-to-r p-[2px] from-[#C7EAFD]  to-[#E8198B] shake-btn mx-4">
            <div className="flex justify-between items-center h-full bg-zinc-900 text-white  rounded-lg px-4 p-2 w-full hover:bg-zinc-900/[.9]">
                <div className="my-auto">Deploy to Hop</div> <Logo className="h-4 my-auto ml-1 " />
            </div>
        </button>
    );
}
