import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { useAuth } from "@clerk/nextjs";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  // Define file routes
  pdfUploader: f({ pdf: { maxFileSize: "32MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // Get user from clerk
      const { userId } = useAuth();
 
      // If no user, throw error
      if (!userId) throw new UploadThingError("Unauthorized");
 
      // Return user id to be used in onUploadComplete
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code runs after upload is complete
      console.log("Upload complete for userId:", metadata.userId);
 
      // Return data to be accessed in onClientUploadComplete
      return { uploadedBy: metadata.userId, fileUrl: file.url };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;