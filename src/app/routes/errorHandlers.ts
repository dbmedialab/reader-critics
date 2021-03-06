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

import { localizationService } from 'app/services';

import {
	InvalidRequestError,
	NotFoundError,
} from 'app/util/errors';

import * as app from 'app/util/applib';

const log = app.createLog();
const __ = localizationService.translate;

export function notFoundHandler(requ : Request, resp : Response) {
	send404Response(resp);
}

export function catchAllErrorHandler(
	err : Error,
	requ : Request,
	resp : Response,
	next : Function
) {
	log(`Catch-all got one ${Object.getPrototypeOf(err)}: ${err.message}`);

	if (err instanceof InvalidRequestError) {
		send400Response(resp, err.message);
	}
	else if (err instanceof NotFoundError) {
		send404Response(resp, err.message);
	}
	else {
		resp.status(500).set('Content-Type', 'text/plain').send(err.stack);
	}
}

function send400Response(resp : Response, message? : string) {
	let template = badRequestPage;

	if (message) {
		template = template
		.replace(/#main-title#/g, __('err.invalid-requ'))
		.replace(/#main-message#/g, __('err.invalid-param'))
		.replace(/#message#/g, message);
	}

	resp.status(404).send(template);
}

function send404Response(resp : Response, message? : string) {
	const msg = message || 'Resource not found';
	const template = notFoundPage
		.replace(/#main-title#/g, __('err.not-found'))
		.replace(/#message#/g, msg);

	resp.status(404).send(template);
}

const badRequestPage = `<html>\
<head>\
	<title>#main-title#</title>\
</head>\
<body>\
	<h1>#main-title#</h1>\
	<h2>#main-message#</h2>\
	<h3>#message#</h3>\
</body>\
</html>`;

const notFoundPage = '<html>\
<head>\
	<title>#main-title#</title>\
</head>\
<body>\
	<h1>#main-title#</h1>\
	<h3>#message#</h3>\
</body>\
</html>';
