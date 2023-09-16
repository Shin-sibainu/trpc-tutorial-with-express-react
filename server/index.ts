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

interface User {
  id: string;
  name: string;
}

const userList: User[] = [
  {
    id: "1",
    name: "ShinCode",
  },
];

const appRouter = router({
  hello: t.procedure.query(() => {
    return "Hello World";
  }),
  helloName: t.procedure
    .input(z.object({ name: z.string(), age: z.number() }))
    .query(({ input }) => {
      return {
        name: `Hello World ${input.name}`,
        age: input.age,
      };
    }),
  userById: publicProcedure
    .input((val: unknown) => {
      if (typeof val === "string") return val;
      throw new Error(`Invalid input: ${typeof val}`);
    })
    .query((req) => {
      const input = req.input;
      const user = userList.find((it) => it.id === input);
      return user;
    }),
  userCreate: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation((req) => {
      const id = `${Math.random()}`;
      const user: User = {
        id,
        name: req.input.name,
      };
      userList.push(user);
      return user;
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
