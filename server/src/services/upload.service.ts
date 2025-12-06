import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  resourceType: string;
  width?: number;
  height?: number;
  duration?: number;
  bytes: number;
}

export interface UploadOptions {
  folder?: string;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  transformation?: any[];
  allowedFormats?: string[];
}

/**
 * Upload a file to Cloudinary
 * @param file - Base64 string or file path
 * @param options - Upload options
 */
export async function uploadToCloudinary(
  file: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    const {
      folder = 'superheroes-del-corazon',
      resourceType = 'auto',
      transformation,
      allowedFormats
    } = options;

    const uploadOptions: any = {
      folder,
      resource_type: resourceType,
      allowed_formats: allowedFormats
    };

    // Add image transformations if provided
    if (transformation) {
      uploadOptions.transformation = transformation;
    }

    const result = await cloudinary.uploader.upload(file, uploadOptions);

    return {
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      resourceType: result.resource_type,
      width: result.width,
      height: result.height,
      duration: result.duration,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
}

/**
 * Upload challenge proof (photo, video, or audio)
 */
export async function uploadChallengeProof(
  file: string,
  childId: string,
  proofType: 'photo' | 'video' | 'audio'
): Promise<UploadResult> {
  const folder = `superheroes-del-corazon/challenges/${childId}`;

  let options: UploadOptions = {
    folder,
    resourceType: 'auto'
  };

  // Configure based on proof type
  switch (proofType) {
    case 'photo':
      options = {
        ...options,
        resourceType: 'image',
        allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
          { width: 1200, height: 1200, crop: 'limit', quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      };
      break;

    case 'video':
      options = {
        ...options,
        resourceType: 'video',
        allowedFormats: ['mp4', 'mov', 'avi', 'webm'],
        transformation: [
          { width: 1280, height: 720, crop: 'limit', quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      };
      break;

    case 'audio':
      options = {
        ...options,
        resourceType: 'video', // Cloudinary stores audio as video type
        allowedFormats: ['mp3', 'wav', 'ogg', 'm4a']
      };
      break;
  }

  return uploadToCloudinary(file, options);
}

/**
 * Upload child avatar
 */
export async function uploadChildAvatar(
  file: string,
  childId: string
): Promise<UploadResult> {
  const folder = `superheroes-del-corazon/avatars`;

  const options: UploadOptions = {
    folder,
    resourceType: 'image',
    allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto:good' },
      { radius: 'max' }, // Make it circular
      { fetch_format: 'auto' }
    ]
  };

  return uploadToCloudinary(file, options);
}

/**
 * Delete a file from Cloudinary
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'video' | 'raw' = 'image'
): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
}

/**
 * Upload multiple files
 */
export async function uploadMultipleFiles(
  files: string[],
  childId: string,
  proofType: 'photo' | 'video' | 'audio'
): Promise<UploadResult[]> {
  const uploadPromises = files.map(file =>
    uploadChallengeProof(file, childId, proofType)
  );

  return Promise.all(uploadPromises);
}

export default {
  uploadToCloudinary,
  uploadChallengeProof,
  uploadChildAvatar,
  deleteFromCloudinary,
  uploadMultipleFiles
};
