import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { headers } from '../util/constant';
import { plainToInstance } from 'class-transformer';
import { GenerateSignedUrlReq } from '../model/generateSignedUrl';
import { validate } from 'class-validator';
import { extractErrorConstraints } from '../util/utils';
import { CommonErrors } from '../model/commonErrors';
import { ImageService } from '../services/imageService';
import { randomUUID } from 'crypto';

export const generatePhotoSignedUrl = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const response: APIGatewayProxyResult = { headers, body: JSON.stringify({ isFailed: true }), statusCode: 500 };

  console.log(`received a request to generate a signedUrl`);
  try {
    if (!event.body) {
      console.warn(`request to generate signed Url has error: body is empty`);

      return {
        ...response,
        statusCode: 400,
        body: JSON.stringify({ isFailed: true, error: CommonErrors.EMPTY_BODY }),
      };
    }

    const requestBody = plainToInstance(GenerateSignedUrlReq, JSON.parse(event.body));
    const errors = await validate(requestBody);

    if (errors?.length > 0) {
      const errorMessages = extractErrorConstraints(errors);
      console.log(`request to generate signed Url has error: ${JSON.stringify(errorMessages)}`);

      return {
        ...response,
        statusCode: 400,
        body: JSON.stringify({ isFailed: true, errors: errorMessages }),
      };
    }

    const imageService = ImageService.instance();
    // userId can be extract from header after using authorizer
    const result = await imageService.createPutObjSignedUrl(randomUUID(), requestBody);

    console.log(`Successfully generated signedUrl for user`);

    response.statusCode = 201;
    response.body = JSON.stringify({ signedUrl: result.signedUrl, isFailed: false });
  } catch (e) {
    console.error('generate signed Url failed with error:', e);
  }

  return response;
};
