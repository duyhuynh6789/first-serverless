import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

// import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { updateTodos } from '../../businessLogic/todos';
import { createLogger } from '../../utils/logger'

const logger = createLogger('updateTodos')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('## UPDATE TODOS ##')
    try {
      const todoId = event.pathParameters.todoId
      const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
      // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
      await updateTodos(updatedTodo, todoId, getUserId(event))
      logger.info('## Updated todos ##')
      return {
        statusCode: 201,
        body: JSON.stringify({
          "Message": "Todo item had been update!"
        })
      }
    } catch (e) {
      logger.error('## Update todo has errors: ', { error: e.message })
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
