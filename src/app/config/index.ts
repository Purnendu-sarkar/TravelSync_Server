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
    bcrypt_salt_rounds: number;
    jwt_access_secret: string;
    jwt_refresh_secret: string;
    jwt_access_expires: string;
    jwt_refresh_expires: string;
    cloudinary: CloudinaryConfig;
}

const config: AppConfig = {
    node_env: process.env.NODE_ENV || "development",
    port: process.env.PORT || "5000",
    database_url: process.env.DATABASE_URL || "",
    bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET || "defaultAccessSecret",
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || "defaultRefreshSecret",
    jwt_access_expires: process.env.JWT_ACCESS_EXPIRES || "1h",
    jwt_refresh_expires: process.env.JWT_REFRESH_EXPIRES || "90d",
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
        api_key: process.env.CLOUDINARY_API_KEY || "",
        api_secret: process.env.CLOUDINARY_API_SECRET || "",
    },
};

export default config;