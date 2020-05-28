import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { PlaceItem } from '../models/PlaceItem';
import { PlaceUpdate } from '../models/PlaceUpdate';

export class PlacesAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly placestable = process.env.WIHBA_TABLE) {

    }

    async getPlacesPerUser(userId: string): Promise<PlaceItem[]> {
        const result = await this.docClient.query({
            TableName: this.placestable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false
        }).promise()

        return result.Items as PlaceItem[];
    }

    async createPlace(item: PlaceItem): Promise<PlaceItem> {
        await this.docClient.put({
            TableName: this.placestable,
            Item: item
        }).promise();

        return item
    }

    async updatePlace(userId: string, placeId: string, placeUpdate: PlaceUpdate): Promise<void> {
        const { markerName, markerText, lng, lat } = placeUpdate;
        const params = {
            TableName: this.placestable,
            Key: {
                userId,
                placeId
            },
            UpdateExpression: 'set markerName = :markerName, markerText=:markerText, lng=:lng, lat=:lat ',
            ConditionExpression: 'placeId = :placeId',
            ExpressionAttributeValues: {
                ':markerName': markerName,
                ':markerText': markerText,
                ':lng': lng,
                ':lat': lat,
            },
            ReturnValues: 'UPDATED_NEW'
        };

        await this.docClient.update(params).promise();
    }

    async deletePlace(userId: string, placeId: string, ): Promise<void> {
        const params = {
            TableName: this.placestable,
            Key: {
                userId,
                placeId
            },
            ConditionExpression: 'placeId = :placeId',
            ExpressionAttributeValues: {
                ':placeId': placeId
            }
        };

        await this.docClient.delete(params).promise();
    }

    async updatePlaceImages(userId: string, placeId: string, attachmentUrl: string): Promise<void> {
        const params = {
            TableName: this.placestable,
            Key: {
              userId,
              placeId
            },
            UpdateExpression: 'set images = :images',
            ConditionExpression:'placeId = :placeId',
            ExpressionAttributeValues: {
              ':images': attachmentUrl,
              ':placeId': placeId,
            },
            ReturnValues: 'UPDATED_NEW'
          };
        
        await this.docClient.update(params).promise();
    }
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}