import { v2 as cloudinary } from "cloudinary";

// Var names match what's already used elsewhere in this project (see
// apps/web/.env) rather than the SDK's own CLOUDINARY_* convention.
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

export { cloudinary };
