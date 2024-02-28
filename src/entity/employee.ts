import { IEmployee } from './employee.interface';

export class EmployeeEntity {
	id: number;
	name: string;
	managerId?: number | null;
	directReports?: IEmployee[];

	constructor(data: IEmployee) {
		this.id = data.id;
		this.name = data.name;
		this.managerId = data.managerId || null;
		this.directReports = data.directReports || [];
	}
}
