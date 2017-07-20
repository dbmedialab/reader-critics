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

import {
	Request,
	Response,
} from 'express';

import {
	Article,
	ArticleURL,
	Website,
} from 'base';

import {
	articleService,
	websiteService,
} from 'app/services';

import { EmptyError } from 'app/util/errors';

import {
	errorResponse,
	okResponse,
	ResponseOptions,
} from './apiResponse';

import * as app from 'app/util/applib';

const log = app.createLog();

// Main handler, checks for URL parameter and invalid requests

export default function(requ : Request, resp : Response) : void {
	try {
		const articleURL = new ArticleURL(requ.query.url);
		const version = requ.query.version;

		let website : Website;
		let wasFetched = false;

		log(articleURL.href);

		// Fetch the article from the database. If not stored, will return undefined
		articleService.load(articleURL, version)
		.then((article : Article) => {
			// Article is not in the database, fetch a fresh version from the web
			if (article === undefined) {
				wasFetched = true;
				return websiteService.identify(articleURL).then((w : Website) => {
					if (website === undefined) {
						return Promise.reject(new Error('Could not identify website'));
					}

					website = w;
					return articleService.fetch(website, articleURL);
				});
			}
			return article;
		})
		.then((article : Article) => {
			// Deliver the API response ...
			okResponse(resp, { article });
			return article;
		})
		.then((article : Article) => {
			// After serving the request: if the article is fresh, store it it
			// the database now
			if (!wasFetched) {
				return null;
			}

			return articleService.save(website, article);
		})
		.catch(error => errorResponse(resp, error));
	}
	catch (error) {
		const options : ResponseOptions = {
			status: 400,  // "Bad Request" in any case
		};

		if (error instanceof EmptyError) {
			errorResponse(resp, error, 'Mandatory URL parameter is missing or empty', options);
		}
		else {
			errorResponse(resp, error, 'URL parameter invalid', options);
		}
	}
}
