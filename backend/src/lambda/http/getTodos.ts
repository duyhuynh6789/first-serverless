import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

// import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from '../utils';
import { getTodosForUser } from '../../businessLogic/todos';
import { createLogger } from '../../utils/logger';

const logger = createLogger('getTodos')
// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('## GET TODOS ##')
    // Write your code here
    try {
      console.log(event)
      const userId = getUserId(event)
      logger.info('## GET User Id ##')
      const todos = await getTodosForUser(userId)
      logger.info('## Get todos successfully ##')
      return {
        statusCode: 200,
        body: JSON.stringify({
          "items": todos
        })
      }
    } catch (e) {
      logger.error('## Get todo has errors: ', { error: e.message })
    }
  })

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
