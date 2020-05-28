import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deleteTodo } from '../../businessLogic/places';
import { createLogger } from '../../utils/logger';
import { customHttpResponse } from '../helpers/customHttpResponse';
import { getToken } from '../helpers';
const logger = createLogger('delete');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing event: ', event)
  const placeId = event.pathParameters.placeId;
  const token = getToken(event.headers);
  await deleteTodo(placeId, token);
  return customHttpResponse({ statusCode: 200 });
}
