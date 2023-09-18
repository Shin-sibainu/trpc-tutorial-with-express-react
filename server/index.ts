// https://qiita.com/hitakeuc/items/1e9e132eb1a44256ff1d
// https://zenn.dev/knaka0209/books/7922ed2c2326b0/viewer/1ba892
// https://trpc.io/docs/example-apps
import express from "express";
import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { z } from "zod";

const app = express();
const PORT = 5000;
app.use(cors());

const t = initTRPC.create();
const router = t.router;
const publicProcedure = t.procedure;

// interface User {
//   id: string;
//   name: string;
// }

// const userList: User[] = [
//   {
//     id: "1",
//     name: "ShinCode",
//   },
// ];

interface Todo {
  id: string;
  content: string;
}

const todoList: Todo[] = [
  {
    id: "1",
    content: "散歩",
  },
  {
    id: "2",
    content: "TRPCの勉強",
  },
];

const appRouter = router({
  test: publicProcedure.query(() => {
    return "TRPC TEST";
  }),
  getTodos: publicProcedure.query(() => {
    return todoList;
  }),
  addTodo: publicProcedure.input(z.string()).mutation((req) => {
    const id = `${Math.random()}`;
    const todo: Todo = {
      id,
      content: req.input,
    };
    todoList.push(todo);
    return todoList;
  }),
  deleteTodo: publicProcedure.input(z.string()).mutation((req) => {
    const idToDelete = req.input;
    const indexToDelete = todoList.findIndex((todo) => todo.id === idToDelete);

    if (indexToDelete === -1) {
      throw new Error(`Todo with id ${idToDelete} not found`);
    }

    todoList.splice(indexToDelete, 1);
    return todoList;
  }),
});

app.get("/", (req, res) => res.send("hello"));

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

+app.listen(PORT, () => console.log("running on PORT " + PORT));

export type AppRouter = typeof appRouter;
