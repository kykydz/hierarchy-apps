import 'reflect-metadata';

import express, { Request, Response, Router } from 'express';

import bodyParser from 'body-parser';
import { OrganizationRepository } from './repository/organiaztion';
import { OrganizationService } from './service/organization';
import { OrganizationController } from './controller/organization';

import multer from 'multer';
import { FILE_TEMP_PATH } from './config';
import { fileUploadMiddleware } from './middleware/upload-file';
const upload = multer({ dest: FILE_TEMP_PATH });

const setupRoutes = async (app: any) => {
	// init DataSource
	const organizationRepository = new OrganizationRepository();

	const organizationService = new OrganizationService(organizationRepository);

	const organizationController = new OrganizationController(
		organizationService
	);

	app.use(
		'/api/employee',
		// upload.single('hierarchy'),
		fileUploadMiddleware,
		organizationController.router
	);

	app.use('*', (_: Request, res: Response) => {
		res.status(401).send('Unauthorized');
	});
};

export const createApp = async () => {
	const app = express();

	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	await setupRoutes(app);

	return app;
};
