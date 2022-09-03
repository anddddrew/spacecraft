import { useEffect, useRef } from "react";
import { ITheme, Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";

const termColors: ITheme = {
  background: "#000",
  foreground: "#E8198B",
  black: "#000",
  red: "#E8198B",
  green: "#29D398",
  yellow: "#FFD866",
  blue: "#1E90FF",
  magenta: "#FF0080",
  cyan: "#1E90FF",
  white: "#E5E5E5",
  brightBlack: "#7F7F7F",
  brightRed: "#FF0080",
  brightGreen: "#29D398",
  brightYellow: "#FFD866",
  brightBlue: "#1E90FF",
  brightMagenta: "#FF0080",
  brightCyan: "#1E90FF",
  brightWhite: "#FFFFFF",
  cursor: "#29D398",
};

interface event {
  type: string;
  data: string;
}

export const useTerminal = (termId: string) => {
  const term = useRef<{
    terminal?: Terminal;
    fitAddon?: FitAddon;
    webLinkAddon?: WebLinksAddon;
    wsMessage?: EventListener;
  }>({});

  useEffect(() => {
    term.current.terminal = new Terminal({
      cursorBlink: true,
      theme: termColors,
    });
    term.current.fitAddon = new FitAddon();
    term.current.webLinkAddon = new WebLinksAddon();
    const terminal = term.current.terminal;
    const fitAddon = term.current.fitAddon;
    const webLinkAddon = term.current.webLinkAddon;
    terminal.loadAddon(webLinkAddon);
    terminal.loadAddon(fitAddon);

    const ws = new WebSocket("wss://h-production.up.railway.app/");

    terminal.open(document.getElementById(termId) ?? document.body);
    terminal.write("\r");

    terminal.onData((data) =>
      ws.send(JSON.stringify({ type: "termIn", data: data }))
    );
    terminal.onResize(() => term.current.fitAddon?.fit());
    const handleMessage = (msg: MessageEvent<string>) => {
      const event: event = JSON.parse(msg.data);
      if (event.type == "termOut") {
        terminal?.write(event.data);
      }
    };
    ws.addEventListener("message", handleMessage, {});

    return () => {
      terminal.dispose();
      fitAddon.dispose();
      ws.close();

      ws.removeEventListener("message", handleMessage, {});
    };
  }, []);
  term.current.fitAddon?.fit();
  return term.current;
};
