import { createApp } from './app';
import { OrganizationRepository } from './repository/organiaztion';

// init DataSource
const dataSource = OrganizationRepository.initDatasource();

(async () => {
	const app = await createApp(dataSource);

	const SERVER_PORT = 4321;
	const server = app.listen(SERVER_PORT);

	console.log(`Server is start listening at port: ${SERVER_PORT}`);

	return server;
})();
