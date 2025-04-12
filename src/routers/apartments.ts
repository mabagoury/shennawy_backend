import express from 'express';
import * as controllers from '../controllers/apartments.js';
import * as validators from '../validators/apartments.js';
import paginationMiddleware from '../middlewares/pagination.js';

const apartments = express.Router();

apartments.post('/', validators.createApartment, controllers.createApartment);
apartments.get('/', validators.getApartments, paginationMiddleware, controllers.getApartments);
apartments.get('/:id', validators.getApartment, controllers.getApartment);

export default apartments;
