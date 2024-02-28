export const FILE_UPLOAD_CONFIG = {
	FIELD_NAME: 'hierarchy',
	TEMP_PATH: process.env.FILE_TEMP_PATH || 'uploads/temp',
	DEFAULT_NAMING: () => `hierarchies_${Date.now()}.json`,
};
