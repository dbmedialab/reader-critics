//
// LESERKRITIKK v2 (aka Reader Critics)
// Copyright (C) 2017 DB Medialab/Aller Media AS, Oslo, Norway
// https://github.com/dbmedialab/reader-critics/
//
// This program is free software: you can redistribute it and/or modify it under
// the terms of the GNU General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along with
// this program. If not, see <http://www.gnu.org/licenses/>.
//

import * as app from 'app/util/applib';
import * as cluster from 'cluster';
import * as colors from 'ansicolors';

import { initDatabase } from 'app/db';
import { initJobWorkerQueue } from 'app/queue';
import { initLocalizationStrings } from 'app/services/localization';
import { initParserResolver } from 'app/services/parser/common/parserResolver';
import { signal } from './clusterSignals';

import startupErrorHandler from './startupErrorHandler';

// Main function of worker process

export default function() {
	const log = app.createLog('worker');
	log('Starting %s worker - ID %d', colors.brightYellow('job'), cluster.worker.id);

	// Main application startup

	Promise.resolve()
		.then(initLocalizationStrings)
		.then(initDatabase)
		.then(initParserResolver)
		.then(initJobWorkerQueue)
	//	.then(mockFeedbackEvent)  -- only used for template testing
		.catch(startupErrorHandler)
		.then(signal.workerReady);
}
