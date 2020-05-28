import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateWihbaRequest } from '../../requests/CreateWihbaRequest'
import { customHttpResponse } from '../helpers/customHttpResponse'
import { createPlace } from '../../businessLogic/places';
import { createLogger } from '../../utils/logger';
import { getToken } from '../helpers';
const logger = createLogger('createTodo');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const newTodo: CreateWihbaRequest = JSON.parse(event.body)
  const token = getToken(event.headers);
  const item = await createPlace(newTodo, token);
  return customHttpResponse({ statusCode: 201, body:{ item } });
}
