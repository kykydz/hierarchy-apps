import { OrganizationEntity } from '../entity/organization';
import { EmployeeEntity } from '../entity/employee';

export class OrganizationRepository {
	entity: OrganizationEntity;

	constructor() {
		this.entity = new OrganizationEntity();
	}

	addEmployee(employee: EmployeeEntity) {
		return this.entity.set(employee);
	}

	findOneEmployee(id: number): EmployeeEntity | undefined {
		return this.entity.get(id);
	}
}
