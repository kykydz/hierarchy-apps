import { IEmployee } from '../entity/employee.interface';

export const getUniqueEmployeeById = (
	hierarchies: IEmployee[]
): IEmployee[] => {
	// const seenIds = new Set<number>();
	const uniqueEmployees: IEmployee[] = [];
	const duplicateEmployeeIds: IEmployee[] = [];

	for (const currentEmployee of hierarchies) {
		// check if id = 1 => managerId should be null
		if (currentEmployee.id === 1 && currentEmployee.managerId !== null) {
			throw new Error(
				`Can not parse the hierarchy. "${currentEmployee.name}" dont have proper hierarchy`
			);
		}

		// check if it has duplicate id from uniqueEmployees
		const exists = uniqueEmployees.some((emp) => emp.id === currentEmployee.id);
		if (exists) {
			duplicateEmployeeIds.push(currentEmployee);
		}

		// push as unique employee
		uniqueEmployees.push(currentEmployee);
	}

	return uniqueEmployees;
};
