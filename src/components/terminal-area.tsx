import React, { useEffect } from "react";
import { Terminal } from "xterm";

export function TerminalArea() {
  useEffect(() => {
    const term = new Terminal();
    const ws = new WebSocket("wss://h-production.up.railway.app");
    term.open(document.getElementById("terminal") ?? document.body);
    term.write("\r");
    term.onData((data) => {
      ws.send(data);
    });
    ws.addEventListener("message", (event) => {
      term.write(event.data);
    });
  });
  return (
    <div className="bg-zinc min-h-[20rem] h-1/3  border-white/25 border-t bg-black">
      <div className="border-white/25 border-b px-4 py-2 flex justify-between bg-zinc-900">
        Terminal
      </div>
      <div id="terminal" />
    </div>
  );
}

export default TerminalArea;
