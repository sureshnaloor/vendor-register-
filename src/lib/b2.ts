import B2 from 'backblaze-b2';

const b2 = new B2({
  applicationKeyId: process.env.B2_APPLICATION_KEY_ID || '',
  applicationKey: process.env.B2_APPLICATION_KEY || '',
});

let authorizationCache: { authorizationToken: string; apiUrl: string; downloadUrl: string; recommendedPartSize: number } | null = null;

async function getB2() {
  if (!authorizationCache) {
    const response = await b2.authorize();
    authorizationCache = response.data;
  }
  return b2;
}

export async function uploadFile(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
) {
  try {
    await getB2();
    const bucketId = process.env.B2_BUCKET_ID;

    if (!bucketId) {
      throw new Error('B2_BUCKET_ID is not defined in environment variables');
    }

    // Get upload URL
    const uploadUrlResponse = await b2.getUploadUrl({ bucketId });
    const { uploadUrl, authorizationToken } = uploadUrlResponse.data;

    // Upload file
    const uploadResponse = await b2.uploadFile({
      uploadUrl,
      uploadAuthToken: authorizationToken,
      fileName,
      data: fileBuffer,
      mime: contentType,
    });

    return uploadResponse.data;
  } catch (error: any) {
    console.error('Error uploading file to B2:', error.response?.data || error.message);
    throw error;
  }
}

export async function saveVendorData(vendorCode: string, data: any) {
  try {
    const fileName = `vendors/${vendorCode}/profile.json`;
    const buffer = Buffer.from(JSON.stringify(data, null, 2));
    return await uploadFile(buffer, fileName, 'application/json');
  } catch (error) {
    console.error('Error saving vendor data:', error);
    throw error;
  }
}

export async function getVendorData(vendorCode: string) {
  try {
    await getB2();
    const fileName = `vendors/${vendorCode}/profile.json`;

    // Download file by name
    const bucketName = await getBucketName();

    if (!bucketName) {
      console.error(`Could not determine Bucket Name for ID: ${process.env.B2_BUCKET_ID}`);
      throw new Error('Bucket Name not found');
    }

    console.log(`[getVendorData] downloading ${fileName} from bucket: ${bucketName}`);

    const response = await b2.downloadFileByName({
      bucketName: bucketName,
      fileName,
      responseType: 'arraybuffer'
    });

    const data = JSON.parse(Buffer.from(response.data).toString('utf-8'));
    return data;
  } catch (error) {
    // If file not found, return null
    // @ts-ignore
    if (error && error.response && error.response.status === 404) {
      return null;
    }
    console.error('Error getting vendor data:', error);
    throw error;
  }
}

async function getBucketName() {
  // Helper to get bucket name if not in env
  if (process.env.B2_BUCKET_NAME) return process.env.B2_BUCKET_NAME;
  // Otherwise list buckets and find by ID? Too slow.
  // Best to ask user to provide B2_BUCKET_NAME in env 
  // But for now I will assume it is provided or I will try to find it.
  await getB2();
  const response = await b2.listBuckets();
  const bucket = response.data.buckets.find((b: any) => b.bucketId === process.env.B2_BUCKET_ID);
  return bucket ? bucket.bucketName : '';
}

export async function getFile(fileName: string) {
  try {
    await getB2();
    const bucketName = await getBucketName();

    if (!bucketName) {
      throw new Error('Bucket Name not found');
    }

    const response = await b2.downloadFileByName({
      bucketName: bucketName,
      fileName,
      responseType: 'arraybuffer'
    });

    return {
      data: response.data,
      contentType: response.headers['content-type'],
      contentLength: response.headers['content-length']
    };
  } catch (error) {
    console.error('Error getting file:', error);
    throw error;
  }
}

export async function deleteFile(fileName: string) {
  try {
    await getB2();
    const bucketName = await getBucketName();

    // 1. We need to find the file ID to delete it (deleteFileVersion)
    // B2 doesn't have a simple "delete by name" that wipes all versions easily in one go via this lib?
    // Actually, listFileNames with prefix might help.

    // However, usually we can just hide it, but let's try to find and delete.
    // For simplicity in this specific app context where we just uploaded it:

    const response = await b2.listFileNames({
      bucketId: process.env.B2_BUCKET_ID!,
      startFileName: fileName,
      maxFileCount: 1,
      prefix: fileName,
      delimiter: ''
    });

    if (response.data.files.length > 0 && response.data.files[0].fileName === fileName) {
      const fileId = response.data.files[0].fileId;
      await b2.deleteFileVersion({
        fileId,
        fileName
      });
      return true;
    }

    return false; // File not found
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

export async function listAllVendors() {
  try {
    await getB2();
    const bucketId = process.env.B2_BUCKET_ID;

    if (!bucketId) {
      throw new Error('B2_BUCKET_ID is not defined');
    }

    let allFiles: any[] = [];
    let nextFileName: string | null = null;

    do {
      const response = await b2.listFileNames({
        bucketId: bucketId as string,
        startFileName: nextFileName || '',
        maxFileCount: 1000,
        prefix: 'vendors/',
        delimiter: '',
      });

      allFiles = allFiles.concat(response.data.files);
      nextFileName = response.data.nextFileName;
    } while (nextFileName);

    // Filter for profile.json files
    const profiles = allFiles.filter((f: any) => f.fileName.endsWith('/profile.json'));

    // Fetch details for each profile
    const vendorDetails = await Promise.all(
      profiles.map(async (f: any) => {
        try {
          const vendorCode = f.fileName.split('/')[1];
          const data = await getVendorData(vendorCode);
          return data;
        } catch (e) {
          console.error(`Error fetching vendor ${f.fileName}:`, e);
          return null;
        }
      })
    );

    return vendorDetails.filter((v: any) => v !== null);
  } catch (error) {
    console.error('Error listing all vendors:', error);
    throw error;
  }
}

