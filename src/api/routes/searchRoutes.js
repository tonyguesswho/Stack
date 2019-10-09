import express from 'express';
import searchController from '../controllers/searchController';

const searchRouter = express.Router();

searchRouter.get('/', searchController.search);

export default searchRouter;
