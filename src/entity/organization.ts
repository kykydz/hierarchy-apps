import { EmployeeEntity } from './employee';

export class OrganizationEntity {
	public employees: Map<string, EmployeeEntity>;

	constructor() {
		this.employees = new Map();
	}

	set(employee: EmployeeEntity) {
		return this.employees.set(String(employee.id), employee);
	}

	get(id: number): EmployeeEntity | undefined {
		return this.employees.get(String(id));
	}
}
