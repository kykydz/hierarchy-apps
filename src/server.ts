import { createApp } from './app';

(async () => {
	const app = await createApp();

	const SERVER_PORT = 4321;
	const server = app.listen(SERVER_PORT);

	console.log(`Server is start listening at port: ${SERVER_PORT}`);

	return server;
})();
