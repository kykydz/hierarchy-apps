import { OrganizationEntity } from '../entity/organization';
import { EmployeeEntity } from '../entity/employee';

export class OrganizationRepository {
	entity: OrganizationEntity;

	constructor() {
		this.entity = new OrganizationEntity();
	}

	async addEmployee(employee: EmployeeEntity) {
		return this.entity.set(employee);
	}

	async findOneEmployee(id: number) {
		return this.entity.get(id);
	}

	async findOneEmployeeByName(name: String) {
		const hierarchies = this.entity.employees;
		for (const key in hierarchies) {
			const employee = hierarchies[key];
			if (employee.name === name) {
				return employee;
			}
		}
		return null;
	}
}
