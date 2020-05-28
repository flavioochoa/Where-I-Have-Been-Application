import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdatePlaceRequest } from '../../requests/UpdatePlaceRequest'
import { getToken } from '../helpers';
import { customHttpResponse } from '../helpers/customHttpResponse';
import { updateTodo } from '../../businessLogic/places';
import { createLogger } from '../../utils/logger';
const logger = createLogger('getTodos');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Caller event', event);
  const placeId = event.pathParameters.placeId;
  const updatedTodo: UpdatePlaceRequest = JSON.parse(event.body);
  const token = getToken(event.headers);
  await updateTodo(placeId, updatedTodo, token);
  return customHttpResponse({ statusCode: 200 });
}
