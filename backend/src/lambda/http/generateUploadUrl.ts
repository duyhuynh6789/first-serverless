import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createTodosImagePreSignedURL } from '../../businessLogic/todos';
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger';

const logger = createLogger('generateUpdateUrl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('## Generate Upload URL ##')
    try {
      const todoId = event.pathParameters.todoId
      // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
      const url = await createTodosImagePreSignedURL(todoId, getUserId(event))
      logger.info('## Generate Upload URL sucessfully ##')
      return {
        statusCode: 201,
        body: JSON.stringify({
          uploadUrl: url
        })
      }
    } catch (e) {
      logger.error('## Create todo has errors: ', { error: e.message })
      return {
        statusCode: 500,
        body: JSON.stringify({
          "message": "System errors"
        })
      }
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
