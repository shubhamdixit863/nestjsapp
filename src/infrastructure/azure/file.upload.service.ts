import { Injectable } from '@nestjs/common';
import { BlobHTTPHeaders, BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';
import { BlobUploadCommonResponse } from '@azure/storage-blob';
import * as path from 'path';
import { configData } from 'src/config';


@Injectable()
export class FileUploadService {
  private blobServiceClient: BlobServiceClient;
  private containerName: string;

  constructor() {
    // Replace with your connection string and container name
    
    this.containerName = configData.containerName;

    this.blobServiceClient = BlobServiceClient.fromConnectionString(configData.AZURE_STORAGE_CONNECTION_STRING);
  }

  async uploadFileToBlobStorage(file: Express.Multer.File): Promise<any> {
    const blobName = uuidv4(); // Generate a unique name for the blob
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const originalName = file.originalname;
    const extension = path.extname(originalName);
     // Set the content type based on the file extension
      // Set the Content-Type property based on the file extension
      const contentType = this.getContentType(originalName);
      const blobHTTPHeaders: BlobHTTPHeaders = { blobContentType: contentType };
  
      // Upload the file to Azure Blob Storage
      await blockBlobClient.upload(file.buffer, file.buffer.length, { blobHTTPHeaders });
  
      // Return the URL of the uploaded file with the file extension
      return blobName
  }

  async getfileStream(fileName: string){
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    var blobDownloaded = await blockBlobClient.download();
    return blobDownloaded.readableStreamBody;
  }

  private getContentType(filename: string): string {
    const extension = filename.split('.').pop();
    switch (extension.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'pdf':
        return 'application/pdf';
      default:
        return 'application/octet-stream';
    }
  }
}
