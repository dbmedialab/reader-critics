import * as bluebird from 'bluebird';
import * as express from 'express';
import * as http from 'http';
import * as mysql from 'mysql';
import * as path from 'path';
import * as util from 'util';

import axios from 'axios';

import * as api from './apilib';

import config from './config';
import router from './routes';

global.Promise = bluebird;

const log = api.createLog();
log('Starting Reader Critics webservice');

// Create Express application
const app = express();
const httpPort = config.get('http.port') || 4001;
const httpServer = http.createServer(app);

// Main application startup

Promise.resolve()  // This will be replaced by other initialization calls, e.g. database and such
	.then(startHTTP)
	.catch(startupErrorHandler);

app.use('/static/react', express.static(path.join(__dirname, '..', 'node_modules/react/dist/')));
app.use('/static/react', express.static(path.join(__dirname, '..', 'node_modules/react-dom/dist/')));

app.use('/static', express.static(path.join(__dirname, '..', 'frontend')));

app.use('/', router);

// Starting the HTTP server

function startHTTP() {
	httpServer.on('error', startupErrorHandler);

	return new Promise((resolve) => {
		httpServer.listen(httpPort, () => {
			log(`Reader Critics webservice running on port ${httpPort} in ${config.get('env')} mode`);
			return resolve();
		});
	});
}

// Error handling during startup

function startupErrorHandler(error : Error) {
	log(error.stack || error.toString());
	process.exit(-128);
}

// TODO Graceful shutdown
