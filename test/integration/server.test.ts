import request from 'supertest';
import { createApp } from '../../src/app';
import fs from 'fs';
import { CORRECT_INPUT_FILE_PATH, FAULTY_1_INPUT_FILE_PATH } from '../config';
import { FILE_UPLOAD_CONFIG } from '../../src/config';
// import { describe, it } from 'node:test';
import assert from 'assert';
import { CorrectHierarchySchema } from '../fixture/output/hierarchy';

describe('Integration Tests', () => {
	describe('POST /api/employee', () => {
		describe('Success Case', () => {
			it('should respond with 200 OK and response with tree hierarchy', async () => {
				// Use fs.readFileSync to read the file
				const fileData = fs.readFileSync(CORRECT_INPUT_FILE_PATH);

				// Send a POST request with the defined body
				const app = await createApp();
				const response: any = await request(app)
					.post('/api/employee')
					.attach(FILE_UPLOAD_CONFIG.FIELD_NAME, fileData, 'correct.json');

				// Check the response status
				expect(response.status).toEqual(200);

				// Optionally, check other properties of the response
				expect(response.body).toEqual(CorrectHierarchySchema);
			});
		});

		describe('Fail Case', () => {
			it('should respond with 400 when hierachy is not valid', async () => {
				// Use fs.readFileSync to read the file
				const fileData = fs.readFileSync(FAULTY_1_INPUT_FILE_PATH);

				// Send a POST request with the defined body
				const app = await createApp();
				const response: any = await request(app)
					.post('/api/employee')
					.attach(FILE_UPLOAD_CONFIG.FIELD_NAME, fileData, 'incorrect.json');

				// Check the response status
				expect(response.status).toEqual(400);

				// Optionally, check other properties of the response
				expect(response.body.message).toEqual(
					'Can not parse the hierarchy. Employee must have managerId'
				);
			});
		});
	});
});
