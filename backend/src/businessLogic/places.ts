import * as uuid from 'uuid'
import { PlaceItem } from '../models/PlaceItem';
import { PlacesAccess } from '../dataLayer/placesAccess';
import { CreateWihbaRequest } from '../requests/CreateWihbaRequest';
import { parseUserId } from '../auth/utils';
import { UpdatePlaceRequest } from '../requests/UpdatePlaceRequest';
import { S3Access } from '../dataLayer/s3Access';

const groupAccess = new PlacesAccess();
const s3Access = new S3Access();

export async function getPlacesPerUser(jwtToken: string): Promise<PlaceItem[]> {
  const userId = parseUserId(jwtToken);
  return groupAccess.getPlacesPerUser(userId);
}

export async function createPlace(
  createWihbaRequest: CreateWihbaRequest,
  jwtToken: string
): Promise<PlaceItem> {

  const placeId = uuid.v4();
  const userId = parseUserId(jwtToken);
  const createdAt = new Date().toISOString();

  const item = {
    userId,
    placeId, 
    ...createWihbaRequest,
    createdAt,
  }

  return await groupAccess.createPlace(item);
}

export async function updateTodo(
    todoId: string,
    createTodoRequest: UpdatePlaceRequest,
    jwtToken: string
  ): Promise<void> {
    const userId = parseUserId(jwtToken);
    await groupAccess.updatePlace(userId, todoId, createTodoRequest);
}

export async function deleteTodo(
    todoId: string,
    jwtToken: string
  ): Promise<void> {
    const userId = parseUserId(jwtToken);
    await groupAccess.deletePlace(userId, todoId);
}

export async function updateTodoAttachment(
    todoId: string,
    jwtToken: string
  ): Promise<string> {
    const userId = parseUserId(jwtToken);
    const imageId = uuid.v4()
    const uploadUrl = s3Access.getUploadUrl(imageId);
    const attachmentUrl = `https://${s3Access.bucketName}.s3.amazonaws.com/${imageId}`;
    
    await groupAccess.updatePlaceImages(userId, todoId, attachmentUrl);
    
    return uploadUrl;
}