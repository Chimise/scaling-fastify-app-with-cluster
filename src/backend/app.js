import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import React from "react";
import ReactDOMServer from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router-dom/server.js";
import routes from "../frontend/routes.js";
import createFetchRequest from "./utils/request.js";
import Author from './models/Author.js';
import Book from "./models/Book.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const handler = createStaticHandler(routes);

const template = ({ content }) => `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>My library</title>
</head>
<body>
<div id="root">${content}</div>
<script type="text/javascript" src="/public/main.js"></script>
</body>
</html>`;

const server = fastify({ logger: true });

server.register(fastifyStatic, {
  root: resolve(__dirname, "../..", "public"),
  prefix: "/public/",
});

server.get(
  "/api/authors", // ③
  async function (req, reply) {
    const authors = await Author.find({}).populate('books');
    return authors;
  }
);

server.get(
  "/api/authors/:authorId", // ④
  async function (req, reply) {
    const author = await Author.findOne({_id: req.params.authorId});
    if (!author) {
      reply.code(404);
      return { error: "Author not found" };
    }
    await author.populate('books');
    return author;
  }
);

server.get("*", async (req, reply) => {
  const request = createFetchRequest(req);
  let context = await handler.query(request);

  let router = createStaticRouter(handler.dataRoutes, context);

  const content = ReactDOMServer.renderToString(
    <StaticRouterProvider router={router} context={context} />
  );

  const responseHtml = template({ content });

  const code =
    context?.errors?.code ?? context?.status ?? context?.statusCode ?? 200;
  reply.code(code).type("text/html").send(responseHtml);
});



export default server;