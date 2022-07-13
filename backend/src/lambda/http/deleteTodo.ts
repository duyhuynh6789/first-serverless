import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodos } from '../../businessLogic/todos';
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger';

const logger = createLogger('deleteTodo')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('## Delete todo ##')
    try {
      const todoId = event.pathParameters.todoId
      // TODO: Remove a TODO item by id
      await deleteTodos(todoId, getUserId(event))
      logger.info('## Deleted todo ##')
      return {
        statusCode: 201,
        body: JSON.stringify({
          "Message": "Todo item had been deleted!"
        })
      }
    } catch (e) {
      logger.error('## Delete todo has errors: ', { error: e.message })
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
