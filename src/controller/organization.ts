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
		const treeHierarchies = this.organizationService.parseEmployeeHierarchy(
			req.body.hierarchies
		);
		return res.status(200).json(treeHierarchies);
	}
}
