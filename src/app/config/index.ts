import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
}

interface AppConfig {
  node_env: string;
  port: string;
  database_url: string;
  cloudinary: CloudinaryConfig;
}

const config: AppConfig = {
  node_env: process.env.NODE_ENV || "development",
  port: process.env.PORT || "5000",
  database_url: process.env.DATABASE_URL || "",
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
  },
};

export default config;