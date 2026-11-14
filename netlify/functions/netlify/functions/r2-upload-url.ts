import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { fileName, fileType } = await req.json();

    if (!fileName) {
      return new Response(JSON.stringify({ error: 'Missing fileName' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME || 'djemmapro';
    const publicUrl = (process.env.R2_PUBLIC_URL || '').replace(/\/$/, '');

    if (!accountId || !accessKeyId || !secretAccessKey || !publicUrl) {
      return new Response(
        JSON.stringify({ error: 'Cloudflare R2 environment variables are not configured on Netlify.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    const cleanName = String(fileName).replace(/[^a-zA-Z0-9.-]/g, '_');
    const objectKey = `mixes/${Date.now()}_${cleanName}`;
    const contentType = fileType || 'audio/mpeg';

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    const fileUrl = `${publicUrl}/${objectKey}`;

    return new Response(
      JSON.stringify({
        success: true,
        uploadUrl,
        fileUrl,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Failed to generate upload permission' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
