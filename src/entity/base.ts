import { IOrganization } from './organization.interface';
import { IEmployee } from './employee.interface';

// Implement the base model abstraction class
export class BaseModelAbstraction {
	public db: IOrganization | IEmployee;

	constructor(data: IOrganization | IEmployee) {
		this.db = data;
	}
}
