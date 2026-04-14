import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { env } from '../config/env'

function ensureR2Configured() {
  const cfg = env.r2
  if (!cfg.accountId || !cfg.accessKeyId || !cfg.secretAccessKey || !cfg.bucket) {
    throw new Error(
      'R2 is not fully configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET.',
    )
  }
}

function createR2Client() {
  ensureR2Configured()
  return new S3Client({
    region: 'auto',
    endpoint: `https://${env.r2.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.r2.accessKeyId,
      secretAccessKey: env.r2.secretAccessKey,
    },
  })
}

function buildPublicUrl(objectKey: string) {
  if (env.r2.publicBaseUrl) {
    return `${env.r2.publicBaseUrl.replace(/\/$/, '')}/${objectKey}`
  }
  return `https://${env.r2.accountId}.r2.cloudflarestorage.com/${env.r2.bucket}/${objectKey}`
}

export async function signUploadUrl(objectKey: string, contentType: string) {
  const client = createR2Client()
  const command = new PutObjectCommand({
    Bucket: env.r2.bucket,
    Key: objectKey,
    ContentType: contentType,
  })

  const uploadUrl = await getSignedUrl(client, command, {
    expiresIn: Math.max(60, Math.min(3600, env.r2.signExpiresSeconds)),
  })

  return {
    upload_url: uploadUrl,
    public_url: buildPublicUrl(objectKey),
  }
}

export async function directUpload(objectKey: string, body: Buffer | Uint8Array, contentType: string) {
  const client = createR2Client()
  await client.send(
    new PutObjectCommand({
      Bucket: env.r2.bucket,
      Key: objectKey,
      Body: body,
      ContentType: contentType,
    }),
  )
  return buildPublicUrl(objectKey)
}

import { GetObjectCommand } from '@aws-sdk/client-s3'
export async function getDownloadStream(objectKey: string) {
  const client = createR2Client()
  const res = await client.send(
    new GetObjectCommand({
      Bucket: env.r2.bucket,
      Key: objectKey,
    }),
  )
  return res.Body
}
