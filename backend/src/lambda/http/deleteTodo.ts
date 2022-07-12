import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodos } from '../../helpers/todos';
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // TODO: Remove a TODO item by id
    await deleteTodos(todoId, getUserId(event))
    return {
      statusCode: 201,
      body: JSON.stringify({
        "Message": "Todo item had been deleted!"
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
