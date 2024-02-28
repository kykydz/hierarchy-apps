import { IEmployee } from './src/entity/employee.interface';

type Employee = {
	id: number;
	name: string;
	managerId: number | null;
	directReports?: Employee[];
};

function parseEmployeeHierarchy2(employees: Employee[]): Employee[] {
	const managerMap = new Object({});

	for (const employee of employees) {
		managerMap.set(employee.id, employee);
	}

	for (const employee of employees) {
		if (employee.managerId !== null) {
			const manager = managerMap.get(employee.managerId);
			if (manager) {
				manager.directReports = manager.directReports || [];
				manager.directReports.push(employee);
			}
		}
	}

	// Remove any employees without a manager (top-level employees)
	return employees.filter((employee) => employee.managerId === null);
}

function findTopLevelManager(hierarchies: IEmployee[]) {
	for (const employee of hierarchies) {
	}
}

const employeeData2 = [
	{ id: 1, name: 'raelynn', managerId: null },
	{ id: 2, name: 'darin', managerId: 1 },
	{ id: 3, name: 'kacie', managerId: 1 },
	{ id: 4, name: 'jordana', managerId: 2 },
	{ id: 5, name: 'everett', managerId: 2 },
	{ id: 6, name: 'bertha', managerId: 2 },
	{ id: 7, name: 'peg', managerId: 3 },
	{ id: 8, name: 'hugh', managerId: 3 },
	{ id: 9, name: 'eveleen', managerId: 3 },
	{ id: 10, name: 'evelina', managerId: 9 },
];

const correctJsonHierarchy = require('./src/fixture/correct-employees.json');
const employeesParsed = parseEmployeeHierarchy2(employeeData2);
console.log(employeesParsed);
