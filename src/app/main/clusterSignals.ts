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

import * as cluster from 'cluster';

export enum ClusterSignal {
	WorkerReady = 'worker-ready',
	WorkerDeadOnArrival = 'worker-doa',
}

export interface ClusterMessage {
	pid : number,
	type : ClusterSignal,
}

function send(sign : ClusterSignal) {
	process.send({
		pid: typeof cluster.worker.id === 'number'
			? cluster.worker.id
			: parseInt(cluster.worker.id),
		type: sign.toString(),
	} as ClusterMessage);
}

export const signal = Object.freeze({
	workerDOA:
		() => send(ClusterSignal.WorkerDeadOnArrival),
	workerReady:
		() => send(ClusterSignal.WorkerReady),
});
