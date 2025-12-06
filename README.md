# AWS S3 Practice - Serverless Image Upload API

A serverless API built with **AWS Lambda**, **S3**, and the **Serverless Framework** that generates pre-signed URLs for secure, direct-to-S3 image uploads.

## 🏗️ Architecture

```
┌─────────────┐      ┌─────────────────┐      ┌──────────────┐
│   Client    │ ──▶  │  API Gateway    │ ──▶  │   Lambda     │
└─────────────┘      └─────────────────┘      └──────┬───────┘
                                                     │
                                                     ▼
                                              ┌──────────────┐
                                              │     S3       │
                                              │   (signed    │
                                              │    URL)      │
                                              └──────────────┘
```

**Flow:**
1. Client requests a signed URL with image metadata (title, description, contentType)
2. Lambda generates a pre-signed PUT URL with a 1-hour expiry
3. Client uploads the image directly to S3 using the signed URL

## 🛠️ Tech Stack

- **Runtime:** Node.js 18
- **Language:** TypeScript
- **Framework:** Serverless Framework v3
- **Cloud Provider:** AWS (Lambda, S3, API Gateway)
- **Validation:** class-validator + class-transformer
- **Testing:** Jest (85% coverage threshold)
- **Bundling:** Webpack + esbuild

## 📁 Project Structure

```
src/
├── app/
│   ├── controllers/    # Lambda handlers
│   │   └── userController.ts
│   ├── services/       # Business logic
│   │   ├── imageService.ts
│   │   └── s3Service.ts
│   ├── model/          # DTOs & interfaces
│   │   ├── generateSignedUrl.ts
│   │   └── commonErrors.ts
│   └── util/           # Constants & utilities
│       ├── constant.ts
│       └── utils.ts
└── tests/              # Unit tests (mirrors app structure)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- AWS CLI configured with appropriate credentials
- Serverless Framework CLI (`npm install -g serverless`)

### Installation

```bash
npm install
```

### Run Locally

```bash
npm start -- --stage test
```

The API will be available at `http://localhost:3000/test/`

### Run Tests

```bash
npm test
```

### Deploy to AWS

```bash
npm run deploy -- --stage dev
```

## 📡 API Endpoints

### Generate Signed URL for Image Upload

**POST** `/user/image/initiate-upload`

Generates a pre-signed S3 URL for uploading an image.

#### Request Body

```json
{
  "title": "profile_photo",
  "description": "My profile picture",
  "contentType": "image/png"
}
```

| Field         | Type   | Required | Description                                          |
|---------------|--------|----------|------------------------------------------------------|
| `title`       | string | ✅       | Title/name of the image                              |
| `description` | string | ❌       | Optional description                                 |
| `contentType` | enum   | ✅       | `image/png`, `image/jpeg`, or `image/jpg`            |

#### Response (201 Created)

```json
{
  "isFailed": false,
  "signedUrl": "https://your-bucket.s3.eu-west-1.amazonaws.com/uploads/user_xxx/..."
}
```

#### Error Response (400 Bad Request)

```json
{
  "isFailed": true,
  "errors": [
    { "isNotEmpty": "title should not be empty" }
  ]
}
```

### Using the Signed URL

After receiving the signed URL, upload your image directly to S3:

```bash
curl -X PUT \
  -H "Content-Type: image/png" \
  --data-binary @your-image.png \
  "SIGNED_URL_HERE"
```

## 🔧 Configuration

### Environment Variables

| Variable              | Description                    |
|-----------------------|--------------------------------|
| `AWS_S3_IMAGE_BUCKET` | S3 bucket name for image uploads |

Environment variables are configured per stage in `serverless-env.yml`.

## 📖 API Documentation

OpenAPI specification is available in `openapi.yml`. You can view it using [Swagger Editor](https://editor.swagger.io/).

## 🧪 Testing

Tests are located in `src/tests/` and mirror the app structure. The project enforces 85% code coverage.

```bash
# Run tests with coverage
npm test

# Run specific test file
npx jest src/tests/controllers/userController.test.ts
```

## 📝 Git Hooks

This project uses git hooks for quality control:

- **pre-push:** Validates branch naming convention and runs tests

Branch naming must follow: `feature|bugfix|improvement|library|release|hotfix/branch-name`

## 📄 License

ISC
