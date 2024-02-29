import fs from 'fs';

export const CorrectHierarchySchema = {
	id: 1,
	name: 'raelynn',
	managerId: null,
	directReports: [
		{
			id: 2,
			name: 'darin',
			managerId: 1,
			directReports: [
				{
					id: 4,
					name: 'jordana',
					managerId: 2,
				},
				{
					id: 5,
					name: 'everett',
					managerId: 2,
				},
				{
					id: 6,
					name: 'bertha',
					managerId: 2,
				},
			],
		},
		{
			id: 3,
			name: 'kacie',
			managerId: 1,
			directReports: [
				{
					id: 7,
					name: 'peg',
					managerId: 3,
				},
				{
					id: 8,
					name: 'hugh',
					managerId: 3,
				},
				{
					id: 9,
					name: 'eveleen',
					managerId: 3,
					directReports: [
						{
							id: 10,
							name: 'evelina',
							managerId: 9,
						},
					],
				},
			],
		},
	],
};

export const incorrectHierarchyOne = JSON.parse(
	fs.readFileSync('test/fixture/input/faulty-employees.json', {
		encoding: 'utf-8',
	})
);

export const incorrectHierarchyTwo = JSON.parse(
	fs.readFileSync('test/fixture/input/another-faulty-employees.json', {
		encoding: 'utf-8',
	})
);
