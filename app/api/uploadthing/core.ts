import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from '@/lib/auth';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Room image uploader - allows multiple images
  roomImage: f({ image: { maxFileSize: '4MB', maxFileCount: 10 } })
    .middleware(async () => {
      // Authenticate user
      const session = await auth();

      // If user is not authenticated, throw error
      if (!session?.user) throw new Error('Unauthorized');

      // Return user info to be available in onUploadComplete
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code runs on your server after upload
      console.log('Upload complete for userId:', metadata.userId);
      console.log('File URL:', file.url);

      // Return data to the client
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Gallery image uploader
  galleryImage: f({ image: { maxFileSize: '8MB', maxFileCount: 20 } })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user) throw new Error('Unauthorized');
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Gallery upload complete for userId:', metadata.userId);
      console.log('File URL:', file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
