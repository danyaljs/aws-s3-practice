import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum SignUrlReqMimeType {
  PNG = 'image/png',
  JPEG = 'image/jpeg',
  JPG = 'image/jpg',
}

export class GenerateSignedUrlReq {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description: string;

  @IsEnum(SignUrlReqMimeType)
  @IsNotEmpty()
  contentType: SignUrlReqMimeType;
}

export interface GetSignedUrlParam {
  userId: string;
  photoId: string;
  contentType: string;
}
