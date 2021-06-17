import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  const response = await document
    .query({
      TableName: "users_todos",
      IndexName: 'UserIdIndex',
      KeyConditionExpression: "#UI = :user_id",
      ExpressionAttributeValues: {
        ":user_id": user_id,
      },
      ExpressionAttributeNames: {
        "#UI": "user_id",
      }
    })
    .promise();

  const todos = response.Items;

  return {
    statusCode: 200,
    body: JSON.stringify({
      todos,
    }),
  };
};
