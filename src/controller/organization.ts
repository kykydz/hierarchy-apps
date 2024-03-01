import { Router, Request, Response } from 'express';
import { OrganizationService } from '../service/organization';
import { dataSourceAvailabilityMiddleware } from '../middleware/datasource-availability';

export class OrganizationController {
	organizationService: OrganizationService;
	routerParser: Router;
	router: Router;

	constructor(organizationService: OrganizationService) {
		this.organizationService = organizationService;

		this.routerParser = Router();
		this.routerParser.post('/', this.parseHierarchy.bind(this));

		this.router = Router();
		this.router.get('/managers/:name', this.displayManager.bind(this));
		this.router.get(
			'/report/direct/count/:name',
			this.countDirectReports.bind(this)
		);
		this.router.get(
			'/report/indirect/count/:name',
			this.countIndirectReports.bind(this)
		);
	}

	async parseHierarchy(req: Request, res: Response) {
		try {
			const treeHierarchies = this.organizationService.parseEmployeeHierarchy(
				req.body.hierarchies
			);
			return res.status(200).json(treeHierarchies);
		} catch (error) {
			// TODO: Create middleware for error handler and mapping

			console.log(error);
			const err = JSON.parse(error.message);
			if (err.statusCode === 400) {
				return res.status(400).json(err);
			} else {
				return res.status(500).send({
					message: 'Something unexpected happening, we are looking on it',
				});
			}
		}
	}

	async displayManager(req: Request, res: Response) {
		try {
			const manager = this.organizationService.getManagersByName(
				req.params.name
			);
			return res.status(200).json(manager);
		} catch (error) {
			// TODO: Create middleware for error handler and mapping

			console.log(error);
			const err = JSON.parse(error.message);
			if (err.statusCode === 400) {
				return res.status(400).json(err);
			} else {
				return res.status(500).send({
					message: 'Something unexpected happening, we are looking on it',
				});
			}
		}
	}

	async countDirectReports(req: Request, res: Response) {
		try {
			const directReport = await this.organizationService.getTotalDirectReports(
				req.params.name
			);
			return res.status(200).json(directReport);
		} catch (error) {
			// TODO: Create middleware for error handler and mapping

			console.log(error);
			const err = JSON.parse(error.message);
			if (err.statusCode === 400) {
				return res.status(400).json(err);
			} else {
				return res.status(500).send({
					message: 'Something unexpected happening, we are looking on it',
				});
			}
		}
	}

	async countIndirectReports(req: Request, res: Response) {
		try {
			const manager = await this.organizationService.getTotalIndirectReports(
				req.params.name
			);
			return res.status(200).json(manager);
		} catch (error) {
			// TODO: Create middleware for error handler and mapping

			console.log(error);
			const err = JSON.parse(error.message);
			if (err.statusCode === 400) {
				return res.status(400).json(err);
			} else {
				return res.status(500).send({
					message: 'Something unexpected happening, we are looking on it',
				});
			}
		}
	}
}
