import { WebSocketServer, WebSocket } from "ws";
import { spawn } from "node-pty";
import { env } from "process";
import { watch } from "chokidar";
import dirTree from "directory-tree";
import { readFile, writeFile } from "fs";

const socket = new WebSocketServer({ port: 8080 });
const shell = "bash";

interface DefinedEnvVars {
  [key: string]: string;
}

interface event {
    type: string;
    data: string;
  }
  

const definedEnv = (): DefinedEnvVars => {
  console.log("a");
  let vars: DefinedEnvVars = {};
  Object.keys(env).forEach(function (key) {
    vars[key] = env[key] ?? "";
  });
  return vars;
};

const home = "/workspace";

const ptyProcess = spawn(shell, [], {
  name: "xterm-256color",
  cols: 80,
  rows: 30,
  cwd: home,
  env: definedEnv(),
});

let state: string = "";

ptyProcess.onData((stdout) => {
  state += stdout;
  const tout: event = { type: "termOut", data: stdout };
  brodcast(JSON.stringify(tout));
});

let clients: WebSocket[] = [];

socket.on("connection", (ws) => {
  clients.push(ws);
  ws.send(JSON.stringify({ type: "termOut", data: state }));
  ws.send(
    JSON.stringify({ type: "tree", data: JSON.stringify(dirTree(home)) })
  );
  ws.on("message", (msg) => {
    try {
      const event: event = JSON.parse(msg.toString());
      if (event.type == "termIn") {
        ptyProcess.write(`${event.data}`);
      } else if (event.type == "fileQuery") {
        readFile(event.data, "utf8", (err, data) => {
          let res: event;
          if (err) {
            res = {
              type: "fileResponse",
              data: JSON.stringify({ path: event.data, content: "" }),
            };
            console.error(err);
          } else {
            res = {
              type: "fileResponse",
              data: JSON.stringify({ path: event.data, content: data }),
            };
          }
          ws.send(JSON.stringify(res));
        });
      } else if (event.type == "fileSave") {
        const data: { path: string; content: string } = JSON.parse(event.data);
        writeFile(data.path, data.content, (err) => {
          if (err) {
            console.error(err);
          }
        });
      } else if (event.type == "fileIn") {
        const fileOut: event = { type: "fileOut", data: event.data };
        brodcast(JSON.stringify(fileOut));
        const data: { path: string; content: string } = JSON.parse(event.data);
        writeFile(data.path, data.content, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
  });
});

socket.on("close", (ws) => {
  clients.splice(clients.indexOf(ws), 1);
});

function brodcast(message: string) {
  clients.forEach(function (client) {
    try {
      client.send(message);
    } catch (e) {
      console.error(e);
    }
  });
}

watch(home, { ignored: /(^|[\/\\])\../, persistent: true }).on(
  "all",
  (event, path) => {
    console.log(event, path);
    const tree: event = { type: "tree", data: JSON.stringify(dirTree(home)) };
    brodcast(JSON.stringify(tree));
  }
);
