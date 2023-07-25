import cluster from "node:cluster";
import { once } from "node:events";
import { cpus } from "node:os";
import server from "./app.js";
import mongoose from "mongoose";

const port = Number.parseInt(process.env.PORT) || 3000;
const address = process.env.ADDRESS || "127.0.0.1";
const mongo_uri = process.env.MONGO_URI || "mongodb://localhost:27017/library";

if (cluster.isPrimary) {
  Object.values(cpus()).forEach((cpu) => cluster.fork());

  cluster.on("exit", (worker, code) => {
    if (!worker.exitedAfterDisconnect && code !== 0) {
      console.log(`Worker ${worker.process.pid} exited, starting a new worker`);
      cluster.fork();
    }
  });

  process.on("SIGUSR2", async () => {
    const workers = Object.values(cluster.workers);
    for (const worker of workers) {
      worker.disconnect();
      await once(worker, "exit");
      if (!worker.exitedAfterDisconnect) {
        continue;
      }

      const newWorker = cluster.fork();
      await once(newWorker, "listening");
    }
  });
} else {
  mongoose
    .connect(mongo_uri)
    .then(() => {
      server.listen({ port, host: address }, function (err) {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      });
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
