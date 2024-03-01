import 'reflect-metadata';

import express, { Request, Response, Router } from 'express';

import bodyParser from 'body-parser';
import { OrganizationRepository } from './repository/organiaztion';
import { OrganizationService } from './service/organization';
import { OrganizationController } from './controller/organization';

import { fileUploadMiddleware } from './middleware/upload-file';
import { dataSourceAvailabilityMiddleware } from './middleware/datasource-availability';

const setupRoutes = async (
	app: any,
	dataRepository: OrganizationRepository
) => {
	const organizationService = new OrganizationService(dataRepository);

	const organizationController = new OrganizationController(
		organizationService
	);

	app.use(
		'/api/organization/hierarchy',
		fileUploadMiddleware,
		organizationController.routerParser
	);

	app.use(
		'/api/employee',
		dataSourceAvailabilityMiddleware(dataRepository),
		organizationController.router
	);

	app.use('*', (_: Request, res: Response) => {
		res.status(401).send('Unauthorized');
	});
};

export const createApp = async (dataRepository: OrganizationRepository) => {
	const app = express();

	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	await setupRoutes(app, dataRepository);

	return app;
};
