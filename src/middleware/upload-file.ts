import { NextFunction, Request, Response } from 'express';
import multer, { diskStorage } from 'multer';
import fs from 'fs/promises'; // Using promises for cleaner async/await syntax
import { FILE_TEMP_PATH } from '../config';

const storage = diskStorage({
	destination: FILE_TEMP_PATH,
	filename: (req, file, cb) => {
		cb(null, `hierarchies_${Date.now()}.json`);
	},
});

const upload = multer({ storage });

export const fileUploadMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		upload.single('hierarchy')(req, res, async (err: any) => {
			if (err) {
				console.log(err);
				throw new Error('Unable to process the upload file');
			}

			const jsonData = await fs.readFile(req.file.path, 'utf-8');
			req.body.hierarchies = JSON.parse(jsonData);
			next();
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Error processing JSON file' });
	}
};
