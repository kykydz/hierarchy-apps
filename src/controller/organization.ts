import { Router, Request, Response } from 'express';
import { OrganizationService } from '../service/organization';

export class OrganizationController {
	organizationService: OrganizationService;
	router: Router;

	constructor(organizationService: OrganizationService) {
		this.organizationService = organizationService;

		this.router = Router();
		this.router.post('/', this.parseHierarchy.bind(this));
	}

	async parseHierarchy(req: Request, res: Response) {
		try {
			const treeHierarchies = this.organizationService.parseEmployeeHierarchy(
				req.body.hierarchies
			);
			return res.status(200).json(treeHierarchies);
		} catch (error) {
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
