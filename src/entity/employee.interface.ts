export interface IEmployee {
	id: number;
	name: string;
	managerId?: number | null;
	directReports?: IEmployee[];
}
