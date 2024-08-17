import { APIGatewayProxyEvent } from 'aws-lambda';
import { generatePhotoSignedUrl } from '../../app/controllers/userController';
import createEvent from '@serverless/event-mocks';
import { CommonErrors } from '../../app/model/commonErrors';
import { GenerateSignedUrlReq, SignUrlReqMimeType } from '../../app/model/generateSignedUrl';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ImageService } from '../../app/services/imageService';

jest.mock('@aws-sdk/s3-request-presigner');

describe('user Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generatePhotoSignedUrl', () => {
    it('should return 500 if an unexpected error occurs', async () => {
      //given
      const event = createEvent('aws:apiGateway', {
        body: JSON.stringify({
          contentType: SignUrlReqMimeType.PNG,
          description: 'dummy description',
          title: 'dummy title',
        } as GenerateSignedUrlReq),
      } as unknown as APIGatewayProxyEvent);

      jest.spyOn(ImageService.prototype, 'createPutObjSignedUrl').mockRejectedValueOnce(new Error('error'));
      //when
      const response = await generatePhotoSignedUrl(event);

      //then
      expect(response.statusCode).toEqual(500);
      const responseBody = JSON.parse(response.body);
      expect(responseBody.isFailed).toEqual(true);
    });

    it('should return 400 with error when event body is not passed', async () => {
      //given
      const event = createEvent('aws:apiGateway', {} as unknown as APIGatewayProxyEvent);

      //when
      const response = await generatePhotoSignedUrl(event);

      //then
      expect(response.statusCode).toEqual(400);
      const responseBody = JSON.parse(response.body);
      expect(responseBody.isFailed).toEqual(true);
      expect(responseBody.error).toEqual(CommonErrors.EMPTY_BODY);
    });

    it('should return 400 with errors when event body is empty ', async () => {
      //given
      const event = createEvent('aws:apiGateway', {
        body: JSON.stringify({}),
      } as unknown as APIGatewayProxyEvent);

      //when
      const response = await generatePhotoSignedUrl(event);

      //then
      expect(response.statusCode).toEqual(400);
      const responseBody = JSON.parse(response.body);
      expect(responseBody.isFailed).toEqual(true);
      expect(responseBody.errors).toEqual([
        { isNotEmpty: 'title should not be empty', isString: 'title must be a string' },
        {
          isEnum: 'contentType must be one of the following values: image/png, image/jpeg, image/jpg',
          isNotEmpty: 'contentType should not be empty',
        },
      ]);
    });

    it('should return 201 and return signedUrl', async () => {
      //given
      const getSignedUrlMock: jest.Mock = getSignedUrl as any;
      const event = createEvent('aws:apiGateway', {
        body: JSON.stringify({
          contentType: SignUrlReqMimeType.PNG,
          description: 'dummy description',
          title: 'dummy title',
        } as GenerateSignedUrlReq),
      } as unknown as APIGatewayProxyEvent);

      const url = 'dummy-example.com';
      getSignedUrlMock.mockResolvedValue(url);

      //when
      const response = await generatePhotoSignedUrl(event);

      //then
      expect(response.statusCode).toEqual(201);
      const responseBody = JSON.parse(response.body);
      expect(responseBody.isFailed).toEqual(false);
      expect(responseBody.signedUrl).toEqual(url);
    });
  });
});
