import { EmployeeEntity } from '../entity/employee';

export class EmployeeRepository {
	private entity: EmployeeEntity;

	constructor(data: EmployeeEntity) {
		this.entity = new EmployeeEntity(data);
	}

	addDirectReports(report: EmployeeEntity): void {
		if (report.managerId !== this.entity.managerId) {
			throw new Error(
				'Employee cannot be added as a direct report if it has a different manager.'
			);
		}
		this.entity.directReports.push(report);
		report.managerId = this.entity.id;
	}

	async getDirectReportCount(entity: EmployeeEntity): Promise<number> {
		return entity.directReports.length;
	}
}
