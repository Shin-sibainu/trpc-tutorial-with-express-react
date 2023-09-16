import React from "react";
import { trpc } from "../utils/trpc";

const Test = () => {
  const hello = trpc.hello.useQuery();
  console.log(hello.data);
  const test = trpc.helloName.useQuery({ name: "youtube", age: 34 });
  console.log(test.data);
  const user = trpc.userById.useQuery("1");
  console.log(user.data);

  return (
    <div>
      hello : {hello.data}
      <hr />
      test: <br />
      name: {test.data?.name}, age: {test.data?.age}
      <hr />
      User:
      <br />
      id: {user.data?.id}, name: {user.data?.name}
    </div>
  );
};

export default Test;
