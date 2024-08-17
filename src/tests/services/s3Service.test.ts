import { S3Service } from '../../app/services/s3Service';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetSignedUrlParam, SignUrlReqMimeType } from '../../app/model/generateSignedUrl';
import { randomUUID } from 'crypto';

jest.mock('@aws-sdk/s3-request-presigner');
describe('S3Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should fetch object from S3', async () => {
      //given
      const url = 'dummy-url.com';
      const bucket = 'testBucket';
      const key = '/uploads/dummy/dummyfile.png';
      const getSignedUrlMock: jest.Mock = getSignedUrl as any;
      const metaData: GetSignedUrlParam = {
        contentType: SignUrlReqMimeType.PNG,
        photoId: randomUUID(),
        userId: randomUUID(),
      };
      getSignedUrlMock.mockResolvedValue(url);
      const s3Service = S3Service.instance();

      //when
      const response = await s3Service.getSignedUrl(bucket, key, metaData);

      //when
      expect(response).toEqual(url);
    });
  });
});
