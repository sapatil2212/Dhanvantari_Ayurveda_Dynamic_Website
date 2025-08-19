import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dlixo8apy',
  api_key: process.env.CLOUDINARY_API_KEY || '687936323745745',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'csfBoi7kRhLAuY9vBc5CJ35oXjI',
});

export default cloudinary;
