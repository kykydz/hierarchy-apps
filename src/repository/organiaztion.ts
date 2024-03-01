import { OrganizationEntity } from '../entity/organization';
import { EmployeeEntity } from '../entity/employee';

export class OrganizationRepository {
	private static database: OrganizationRepository;
	entity: OrganizationEntity;

	private constructor() {
		this.entity = new OrganizationEntity();
	}

	static initDatasource() {
		if (!OrganizationRepository.database) {
			OrganizationRepository.database = new OrganizationRepository();
		}
		return OrganizationRepository.database;
	}

	async addEmployee(employee: EmployeeEntity) {
		return this.entity.set(employee);
	}

	async findOneEmployee(id: number) {
		return this.entity.get(id);
	}

	async findOneEmployeeByName(name: String) {
		const employees = this.entity.employees;
		for (let index = 1; index <= employees.size; index++) {
			const employee = employees.get(String(index));
			if (employee.name === name) {
				return employee;
			}
		}
		return null;
	}
}
