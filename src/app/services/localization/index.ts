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

import { flatten } from 'flat';

import {
	isEmpty,
	isObject,
	isString,
	throttle,
} from 'lodash';

import Website from 'base/Website';
import config from 'app/config';
import * as app from 'app/util/applib';

const log = app.createLog();

const languageFile = 'resources/localization.json5';

export const systemLocale : string = config.get('localization.systemLocale');

interface Strings {
	app? : object;
	common? : object;
	frontend? : object;
}

let strings : Strings;

export function initLocalizationStrings() : Promise <void> {
	return installWatcher().then(loadLanguageFile);
}

function installWatcher() : Promise <void> {
	if (app.isProduction) {
		return Promise.resolve();
	}

	const throttledHandler = throttle(watchHandler, 1000, {
		leading: false,
		trailing: true,
	});

	return app.watchFile(languageFile, throttledHandler).then(watcher => {
		log(`Watching ${languageFile} for changes`);
	});
}
function loadLanguageFile() : Promise <void> {
	return app.loadJSON(languageFile).then(data => {
		strings = Object.freeze(data);
		log('Localization strings loaded');
	});
}

function watchHandler(eventType, filename) {
	if (eventType !== 'change') {
		return;
	}

	loadLanguageFile();
}

export function getFrontendStrings(website? : Website) : Promise <Object> {
	const allStrings = Object.assign({}, strings.common, strings.frontend);
	const locale = website ? website.locale : systemLocale;
	return Promise.resolve(flatten(applyLocale(allStrings, locale)));
}

export type TranslateOptions = {
	locale? : string
	values? : {}
};

export function translate(id : string, options? : string|TranslateOptions) : string {
	let usedLocale;

	// A single string value in "options" means to override the system default locale
	if (isString(options)) {
		usedLocale = options;
	}
	else if (isObject(options)) {
		usedLocale = options.locale || systemLocale;
	}

	const allStrings = Object.assign({}, strings.common, strings.app);
	const flattened = flatten(applyLocale(allStrings, usedLocale));

	if (!flattened[id]) {
		return id;
	}

	const replaceValues = (() => {
		if ((isEmpty(options) || isString(options)) ? true : isEmpty(options.values)) {
			return {};
		}

		return ((options as TranslateOptions).values || {});
	})();

	const replacer = (match : string) => {
		const index = match.substring(1, match.length - 1);
		return replaceValues[index] || '--';
	};

	return flattened[id].replace(/({\w+})/g, replacer);
}

function applyLocale(input : any, locale : string) : any {
	const a = {};

	Object.keys(input).forEach(key => {
		const o = input[key];

		if (isAllStrings(o)) {
			if (o[locale] !== undefined) {
				a[key] = o[locale];
			}
			else if (o[systemLocale] !== undefined) {
				a[key] = o[systemLocale];
			}
			else {
				a[key] = o['en'];
			}
		}
		else {
			a[key] = applyLocale(o, locale);
		}
	});

	return a;
}

const isAllStrings = (o : any) => {
	return 0 >= Object.values(o).filter(a => typeof a !== 'string').length;
};
