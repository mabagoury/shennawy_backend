import express from 'express';
import * as controllers from '../controllers/files.js';
import * as validators from '../validators/files.js';

const files = express.Router();

files.post('/get-upload-url', validators.getUploadUrl, controllers.getUploadUrl);

export default files;
