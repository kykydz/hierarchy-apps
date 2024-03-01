import { EmployeeEntity } from '../../../src/entity/employee';
import { IEmployee } from '../../../src/entity/employee.interface';
import { EmployeeRepository } from '../../../src/repository/employee';
import { OrganizationRepository } from '../../../src/repository/organiaztion';
import { OrganizationService } from '../../../src/service/organization';
import {
	secondEmployeeSample,
	hierarchySample,
} from '../../fixture/input/organization';
import { CorrectHierarchySchema } from '../../fixture/output/hierarchy';

const DEFAULT_CORRECT_EMPLOYEE: IEmployee = secondEmployeeSample;

describe('Unit Test', () => {
	describe('OrganizationService', () => {
		let organizationService: OrganizationService;
		let organizationRepositoryMock: any;
		let employeeRepositoryMock: any;

		beforeEach(() => {
			organizationRepositoryMock = {
				addEmployee: jest.fn(),
				findOneEmployee: jest.fn(),
				findOneEmployeeByName: jest.fn(),
				entity: jest.fn(),
			};
			employeeRepositoryMock = {
				getDirectReportCount: jest.fn(),
			};

			organizationService = new OrganizationService(
				organizationRepositoryMock as unknown as OrganizationRepository,
				employeeRepositoryMock as unknown as EmployeeRepository
			);
		});

		describe('createEmployee', () => {
			it('should call return void when creation is succesful', async () => {
				const employee: EmployeeEntity = DEFAULT_CORRECT_EMPLOYEE;
				await organizationService.createEmployee(employee);

				expect(organizationRepositoryMock.addEmployee).toHaveBeenCalledWith(
					employee
				);
			});

			it('should throw an error "Failed to add Employee" when creation is failed', () => {
				organizationRepositoryMock.addEmployee.mockRejectedValue(
					new Error('Failed to add Employee')
				);
				const employee: EmployeeEntity = DEFAULT_CORRECT_EMPLOYEE;

				expect(organizationService.createEmployee(employee)).rejects.toThrow(
					'Failed to add Employee'
				);
			});
		});

		describe('findOneEmployee', () => {
			it('should return the employee if found', async () => {
				const employee: EmployeeEntity = DEFAULT_CORRECT_EMPLOYEE;
				organizationRepositoryMock.findOneEmployee.mockReturnValue(employee);

				const result = await organizationService.findOneEmployee(2);

				expect(result).toEqual(employee);
			});

			it('should return undefined if employee is not found', async () => {
				organizationRepositoryMock.findOneEmployee.mockReturnValue(undefined);

				const result = await organizationService.findOneEmployee(99);

				expect(result).toBeUndefined();
			});

			it('should throw an error "Failed to find Employee" when finding employee got error', async () => {
				organizationRepositoryMock.findOneEmployee.mockRejectedValue(
					new Error('Failed to find Employee')
				);

				expect(organizationService.findOneEmployee(999)).rejects.toThrow(
					'Failed to find Employee'
				);
			});
		});

		describe('getManagers', () => {
			it('should return all the managers of a given employee recursively', async () => {
				const currentEmployee = {
					id: 2,
					name: 'darin',
					managerId: 1,
				};
				(organizationRepositoryMock.entity as jest.Mock).mockReturnValue(
					CorrectHierarchySchema
				);
				(
					organizationRepositoryMock.findOneEmployeeByName as jest.Mock
				).mockResolvedValueOnce(currentEmployee);
				(
					organizationRepositoryMock.findOneEmployee as jest.Mock
				).mockResolvedValueOnce(CorrectHierarchySchema);

				const result = await organizationService.getManagersByName(
					currentEmployee.name
				);

				expect(result.employee.name).toEqual(currentEmployee.name);
				expect(result.upperManagers.length).toEqual(1);
			});
		});

		describe('getTotalDirectReports', () => {
			it('should return all the current employee direct report', async () => {
				const currentEmployee = CorrectHierarchySchema;
				(
					organizationRepositoryMock.findOneEmployeeByName as jest.Mock
				).mockResolvedValueOnce(currentEmployee);
				(
					employeeRepositoryMock.getDirectReportCount as jest.Mock
				).mockResolvedValueOnce(2);

				const result = await organizationService.getTotalDirectReports(
					currentEmployee.name
				);

				expect(result.directReportCount).toEqual(2);
			});
		});

		describe('getTotalIndirectReports', () => {
			it('should return all the current employee indirect report', async () => {
				const currentEmployee = CorrectHierarchySchema;
				(
					organizationRepositoryMock.findOneEmployeeByName as jest.Mock
				).mockResolvedValueOnce(currentEmployee);

				const result = await organizationService.getTotalIndirectReports(
					currentEmployee.name
				);

				expect(result.totalIndirectReports).toEqual(7);
			});
		});
	});
});
