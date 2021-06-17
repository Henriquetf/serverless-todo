import { v4 as uuidV4 } from "uuid";

import { document } from "src/utils/dynamodbClient";
import { APIGatewayProxyHandler } from "aws-lambda";

interface ICreateTodo {
  title: string;
  done: boolean;
  deadline: number;
}

export const handle: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;
  const { title, done, deadline } = JSON.parse(event.body) as ICreateTodo;

  const todo = {
    id: uuidV4(),
    user_id,
    title,
    done: Boolean(done),
    deadline: new Date(deadline),
  };

  await document
    .put({
      TableName: "users_todos",
      Item: todo,
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: todo,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  };
};
