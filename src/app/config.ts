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

// tslint:disable:max-line-length max-file-line-count

import * as path from 'path';
import * as convict from 'convict';

import {
	dbMessageQueue,
	dbSessionCache,
} from 'app/db/createRedisConnection';

import { rootPath } from 'app/util/applib';

import * as app from 'app/util/applib';

const log = app.createLog('config');

const isHexSecret = (val : any) => /^[a-fA-F0-9]{64}$/.test(val);

convict.addFormat({
	name: 'hex-secret',
	validate: (value) => {
		if (!isHexSecret(value)) {
			log(value);
			throw new Error('Must be a 64 character hex key');
		}
	},
});

const config = convict({
	http: {
		port: {
			doc: 'Network port where the HTTP server is going to listen',
			format: 'port',
			default: 4000,
			env: 'HTTP_PORT',
		},
	},
	db: {
		mongo: {
			url: {
				doc: 'MongoDB connection URL for the main backend database',
				format: String,
				default: 'mongodb://localhost:27017/readercritics',
				env: 'MONGODB_URL',
			},
		},
		redis: {
			url: {
				// See app/db/createRedisConnection for details about the constants
				[dbMessageQueue]: {
					doc: 'Redis URL for the database that holds the message queue',
					format: String,
					default: null,
					env: 'REDIS_URL_MESSAGE_QUEUE',
				},
				[dbSessionCache]: {
					doc: 'Redis URL for the database that holds the session cache',
					format: String,
					default: null,
					env: 'REDIS_URL_SESSION_CACHE',
				},
			},
		},
	},
	localization: {
		systemLocale: {
			doc: 'Default system locale that will be used when websites do not override',
			format: String,
			default: 'en',
			env: 'I18N_SYS_LOCALE',
		},
	},
	auth: {
		bcrypt: {
			rounds: {
				doc: 'Number of salt rounds when hashing passwords with BCrypt',
				// BCrypt documentation recommends chosing the number of salt rounds so
				// that the salting process takes about one second on the target machine.
				// The default of 14 rounds takes ~900ms on a Skylake E5v3 Xeon (tested)
				default: 14,
				env: 'AUTH_BCRYPT_ROUNDS',
			},
		},
		jwt: {
			secret: {
				default: null,
				doc: '64 character hexadecimal random sequence for signing JSON web tokens',
				format: 'hex-secret',
				env: 'AUTH_JWT_SECRET',
			},
			session: {
				default: true,
				format: Boolean,
				env: 'AUTH_JWT_SESSION',
			},
		},
		session: {
			secret: {
				default: null,
				doc: '64 character hexadecimal random sequence for signing session tokens',
				format: 'hex-secret',
				env: 'AUTH_SESSION_SECRET',
			},
			ttl: {
				default: 30,
				doc: 'Lifetime of a session in minutes',
				format: 'nat',
				env: 'AUTH_SESSION_TTL',
			},
		},
	},
	mail: {
		sender: {
			domain: {
				default: 'readercritics.com',
				format: String,
				env: 'MAIL_SENDER_DOMAIN',
			},
		},
		sendgrid: {
			api_key: {
				default: '',
				format: String,
				doc: 'API key for SendGrid mail service, used if no other service is configured',
				env: 'SENDGRID_API_KEY',
			},
		},
		bccRecipient: {
			default: '',
			format: String,
			doc: 'Set this to a valid e-mail address to BCC all outgoing mail to it.',
			env: 'MAIL_BCC_RECIPIENT',
		},
		testOverride: {
			default: '',
			format: String,
			doc: 'Set this to a valid e-mail address to direct ALL outgoing mail to it. Automatically disabled in production mode.',
			env: 'MAIL_TEST_OVERRIDE',
		},
	},
	slack: {
		channel: {
			default: '',
			format: String,
			doc: 'Channel name for the Slack integration to use for notifications. Overrides the Webhook configuration on the receiver.',
			env: 'SLACK_CHANNEL',
		},
		botname: {
			default: 'Reader Critics',
			format: String,
			doc: 'Bot name for the Slack integration.',
			env: 'SLACK_BOTNAME',
		},
		webhook: {
			default: '',
			format: String,
			doc: 'If set to a Slack webhook URL, warnings and errors will be posted to this integration',
			env: 'SLACK_WEBHOOK',
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
}
catch (err) {
	log('Can\'t find file /config.json5. Environment settings will apply.');
}

try {
	config.validate();

	if (config.get('auth.jwt.secret') === config.get('auth.session.secret')) {
		throw new Error('JWT and session secret are identical');
	}
}
catch (error) {
	log('Configuration error:', error.message);
	process.exit(128);
}

export default config;
