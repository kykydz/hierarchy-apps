export const isObjectNotEmpty = (obj: Record<string, any>) => {
	return obj && Object.keys(obj).length > 0;
};
