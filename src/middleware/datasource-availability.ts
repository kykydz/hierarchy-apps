import { OrganizationRepository } from '../repository/organiaztion';
import { OrganizationService } from '../service/organization';
import { isObjectNotEmpty } from '../utils/object-modifier';
import { Request, Response, NextFunction } from 'express';

export const dataSourceAvailabilityMiddleware = (
	dataRepository: OrganizationRepository
) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const employeeEntityHierarchies = dataRepository.entity.hierarchies;
		const isHierarchyNotEmpty = isObjectNotEmpty(employeeEntityHierarchies);

		if (isHierarchyNotEmpty) {
			next();
		} else {
			res.status(401).send({
				message:
					'Data is not yet initialized, please initialized through POST /api/employee',
			});
		}
	};
};
