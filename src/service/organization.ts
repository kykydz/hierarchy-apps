import { EmployeeEntity } from '../entity/employee';
import { IEmployee } from '../entity/employee.interface';
import { OrganizationEntity } from '../entity/organization';
import { EmployeeRepository } from '../repository/employee';
import { OrganizationRepository } from '../repository/organiaztion';

interface IValidationHierarchyResult {
	cleanHierarchy: IEmployee[];
	topLevelEmployee?: IEmployee | null;
}

export class OrganizationService {
	organizationRepository: OrganizationRepository;
	employeeRepository: EmployeeRepository;

	constructor(organizationRepository: OrganizationRepository) {
		this.organizationRepository = organizationRepository;
	}

	initOrganizationHierarchy(): OrganizationEntity {
		return new OrganizationEntity();
	}

	createEmployee(employee: EmployeeEntity) {
		try {
			return this.organizationRepository.addEmployee(employee);
		} catch (error) {
			throw new Error('Failed to add Employee');
		}
	}

	findOneEmployee(id: number): EmployeeEntity | undefined {
		try {
			const employee = this.organizationRepository.findOneEmployee(id);

			if (!employee) {
				return;
			}

			return employee;
		} catch (error) {
			throw new Error('Failed to find Employee');
		}
	}

	getManagers(employee: EmployeeEntity): EmployeeEntity[] {
		const managers: EmployeeEntity[] = [];
		let currentEmployee = employee;

		while (currentEmployee.managerId !== null) {
			managers.push(currentEmployee);
			currentEmployee = this.organizationRepository.findOneEmployee(
				currentEmployee.id
			);
		}

		return managers;
	}

	getTotalDirectReports(employee: EmployeeEntity): number {
		return this.employeeRepository.getDirectReportCount(employee);
	}

	getTotalIndirectReports(employee: EmployeeEntity): number {
		let totalIndirectReports = 0;

		function countIndirectReports(employee: EmployeeEntity) {
			employee.directReports.forEach((report: EmployeeEntity) => {
				totalIndirectReports++;
				countIndirectReports(report);
			});
		}

		countIndirectReports(employee);
		return totalIndirectReports;
	}

	parseEmployeeHierarchy(hierarchies: IEmployee[]): IEmployee {
		// validate hierarchies
		const validationResult = this._validateHierarchies(hierarchies);
		const employees = validationResult.cleanHierarchy;

		// parse clean hierarchy using hash map storage
		for (const employee of employees) {
			this.organizationRepository.addEmployee(employee);
		}

		const buildHierarchy = (
			employee: IEmployee,
			restOfEmployees: IEmployee[]
		): IEmployee => {
			const currentEmployeeDirectReports = restOfEmployees.filter(
				(emp) => emp.managerId === employee.id
			);

			if (currentEmployeeDirectReports.length === 0) {
				return employee;
			} else {
				employee.directReports = [];
				for (const directReport of currentEmployeeDirectReports) {
					const updatedRestOfEmployees = restOfEmployees.filter(
						(emp) => emp.id !== directReport.id
					);
					employee.directReports.push(
						buildHierarchy(directReport, updatedRestOfEmployees)
					);
				}
				return employee;
			}
		};

		// Build hierarchy for each employee
		const result = buildHierarchy(validationResult.topLevelEmployee, employees);

		return result;
	}

	/***
	 * @description This function is aim to validate employee hierarchy and return it top level manager
	 */
	_validateHierarchies(hierarchies: IEmployee[]): IValidationHierarchyResult {
		const cleanEmployees: IEmployee[] = [];
		let topLevelEmployee: IEmployee;

		// check foreach employee if it has correct structure
		for (const currentEmployee of hierarchies) {
			// check if it has duplicate id from cleanEmployees
			const exists = cleanEmployees.some(
				(emp) => emp.id === currentEmployee.id
			);
			if (exists) {
				throw new Error(
					`Can not parse the hierarchy. "${currentEmployee}" is duplicated`
				);
			}

			// check if id = 1 => managerId should be null
			if (currentEmployee.id === 1) {
				// throw error if invalid employee entity (it is manager but managerId is not nll)
				if (currentEmployee.managerId !== null) {
					throw new Error(
						`Can not parse the hierarchy. "${currentEmployee.name}" dont have proper hierarchy`
					);
				} else {
					// it is valid top level manager
					// store top level manager
					topLevelEmployee = currentEmployee;
				}
			}

			// push as clean employee
			cleanEmployees.push(currentEmployee);
		}

		return {
			cleanHierarchy: cleanEmployees,
			topLevelEmployee,
		};
	}
}
