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

import * as path from 'path';
import * as convict from 'convict';
import { rootPath } from 'app/util/applib';
const config = convict({
	http: {
		port: {
			doc: 'Network port where the HTTP server is going to listen',
			format: 'port',
			default: 4000,
			env: 'HTTP_PORT',
		},
	},
	mongodb: {
		url: {
			doc: 'MongoDB connection URL for the main backend database',
			default: 'mongodb://localhost:27017/readercritics',
			env: 'MONGODB_URL',
		},
	},
	recaptcha: {
		key: {
			secret: {
				doc: 'Secret Google Recaptcha key',
				default: '',
				env: 'RECAPTCHA_SECRET_KEY',
			},
			public: {
				doc: 'Public Google Recaptcha key',
				default: '',
				env: 'RECAPTCHA_PUBLIC_KEY',
			},
		},
	},
});
try {
	config.loadFile(path.join(rootPath, 'config.json5'));
} catch (err) {
	console.log('Can\'t find file /config.json5. Server\'s setting will be apply');
}
config.validate();

export default config;
