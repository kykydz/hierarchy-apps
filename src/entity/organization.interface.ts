import { IEmployee } from './employee.interface';

export interface IOrganization extends IEmployee {
	employees: Map<number, IEmployee>;
}
