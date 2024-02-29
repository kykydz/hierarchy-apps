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

	constructor(
		organizationRepository: OrganizationRepository,
		employeeRepository?: EmployeeRepository
	) {
		this.organizationRepository = organizationRepository;
		this.employeeRepository = employeeRepository;
	}

	async createEmployee(employee: EmployeeEntity) {
		try {
			return await this.organizationRepository.addEmployee(employee);
		} catch (error) {
			throw new Error('Failed to add Employee');
		}
	}

	async findOneEmployee(id: number): Promise<EmployeeEntity | undefined> {
		try {
			const employee = await this.organizationRepository.findOneEmployee(id);

			if (!employee) {
				return;
			}

			return employee;
		} catch (error) {
			throw new Error('Failed to find Employee');
		}
	}

	async getManagersByName(employeeName: String): Promise<any> {
		const upperManagers: EmployeeEntity[] = [];
		let employee = await this.organizationRepository.findOneEmployeeByName(
			employeeName
		);
		if (!employee) {
			return;
		}

		let currentEmployee: EmployeeEntity = employee;

		while (currentEmployee.managerId !== null) {
			currentEmployee = await this.organizationRepository.findOneEmployee(
				employee.managerId
			);
			upperManagers.push(currentEmployee);
			console.log(currentEmployee);
		}

		return {
			employee,
			upperManagers,
		};
	}

	async getTotalDirectReports(
		employeeName: String
	): Promise<number | undefined> {
		let employee = await this.organizationRepository.findOneEmployeeByName(
			employeeName
		);
		if (!employee) {
			return;
		}
		return await this.employeeRepository.getDirectReportCount(employee);
	}

	async getTotalIndirectReports(employeeName: String): Promise<any> {
		let employee = await this.organizationRepository.findOneEmployeeByName(
			employeeName
		);
		if (!employee) {
			return;
		}

		let totalIndirectReports = 0;
		const indirectReports: EmployeeEntity[] = [];

		function countIndirectReports(currentEmployee: EmployeeEntity) {
			if (!currentEmployee.directReports) {
				return;
			}
			currentEmployee.directReports.forEach((report: EmployeeEntity) => {
				if (report.managerId !== employee.id) {
					totalIndirectReports++;
					indirectReports.push(report);
				}
				countIndirectReports(report);
			});
		}

		countIndirectReports(employee);
		return {
			totalIndirectReports,
			indirectReports,
		};
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
					JSON.stringify({
						statusCode: 400,
						ccontext: currentEmployee,
						message: `Can not parse the hierarchy. Some employee data is duplicated`,
					})
				);
			}

			// check if id = 1 => managerId should be null
			if (currentEmployee.id === 1) {
				// throw error if invalid employee entity (it is manager but managerId is not nll)
				if (currentEmployee.managerId !== null) {
					throw new Error(
						JSON.stringify({
							statusCode: 400,
							context: currentEmployee,
							message: `Can not parse the hierarchy. Top manager can not have managerId`,
						})
					);
				} else {
					// it is valid top level manager
					// store top level manager
					topLevelEmployee = currentEmployee;
				}
			} else {
				if (currentEmployee.managerId === null) {
					throw new Error(
						JSON.stringify({
							statusCode: 400,
							context: currentEmployee,
							message: `Can not parse the hierarchy. Employee must have managerId`,
						})
					);
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
