import { UploadResponse } from '@/types';

export class UploadService {
  // Mock S3 upload function - replace with real AWS S3 implementation
  static async uploadToS3(file: File, path?: string): Promise<UploadResponse> {
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate a mock URL - replace this with actual S3 upload logic
      const timestamp = Date.now();
      const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const mockUrl = `https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=${encodeURIComponent(fileName)}`;
      
      // In real implementation, you would:
      // 1. Upload file to S3 bucket
      // 2. Return the actual S3 URL
      // 3. Handle errors appropriately
      
      return {
        success: true,
        url: mockUrl,
        key: `uploads/${path || 'images'}/${timestamp}_${fileName}`
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload file');
    }
  }

  // Upload multiple files
  static async uploadMultipleFiles(files: File[], path?: string): Promise<UploadResponse[]> {
    const uploadPromises = files.map(file => this.uploadToS3(file, path));
    return Promise.all(uploadPromises);
  }

  // Validate file before upload
  static validateFile(file: File, options: {
    maxSize?: number; // in MB
    allowedTypes?: string[];
    maxWidth?: number;
    maxHeight?: number;
  } = {}): { isValid: boolean; error?: string } {
    const {
      maxSize = 10, // 10MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxWidth = 4000,
      maxHeight = 4000
    } = options;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return {
        isValid: false,
        error: `File size must be less than ${maxSize}MB`
      };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    return { isValid: true };
  }

  // Compress image before upload
  static async compressImage(file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  // Generate thumbnail
  static async generateThumbnail(file: File, size: number = 200): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = size;
        canvas.height = size;

        ctx?.drawImage(img, 0, 0, size, size);
        const thumbnailUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(thumbnailUrl);
      };

      img.onerror = () => reject(new Error('Failed to generate thumbnail'));
      img.src = URL.createObjectURL(file);
    });
  }

  // Delete file from S3 (mock implementation)
  static async deleteFromS3(key: string): Promise<boolean> {
    try {
      // Simulate delete delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In real implementation, you would:
      // 1. Delete file from S3 bucket using AWS SDK
      // 2. Return success/failure status
      
      console.log(`Mock delete: ${key}`);
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  }

  // Get file info
  static getFileInfo(file: File): {
    name: string;
    size: number;
    type: string;
    lastModified: Date;
    sizeFormatted: string;
  } {
    const formatBytes = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified),
      sizeFormatted: formatBytes(file.size)
    };
  }
}
