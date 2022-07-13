import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodos } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('## Create todo ##')
    try {
      const newTodo: CreateTodoRequest = JSON.parse(event.body)
      // TODO: Implement creating a new TODO item
      const newItem = await createTodos(newTodo, getUserId(event))
      logger.info('## Created todo ##')
      return {
        statusCode: 201,
        body: JSON.stringify({
          item: newItem
        })
      }
    } catch (e) {
      logger.error('## Create todo has errors: ', { error: e.message })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
