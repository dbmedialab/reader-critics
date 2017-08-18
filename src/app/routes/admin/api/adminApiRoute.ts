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
	Router,
} from 'express';

import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';

import {
	apiLoginHandler
} from 'app/routes/admin/api/handlers';

import * as  userHandler from 'app/routes/admin/api/usersHandler';
import * as feedbacksHandler from 'app/routes/admin/api/feedbacksHandler';

import { errorResponse } from 'app/routes/api/apiResponse';

import isAuthenticatedApi from 'app/middleware/policies/isAuthenticatedApi';

const adminApiRoute : Router = Router();

adminApiRoute.use(bodyParser.json({
	inflate: true,
	limit: '512kb',
	strict: true,
}));

adminApiRoute.use(cookieParser());

/**
 * All api request that have to pass without authentication have to be placed here
 */
adminApiRoute.post('/login', apiLoginHandler);

// Protecting routes with jwt
// adminApiRoute.use('/*', passport.authenticate('jwt', {session: false}));
/**
 * All api request that have NOT to to pass without authentication have to be placed here
 */
adminApiRoute.get('/users', isAuthenticatedApi, userHandler.list);
adminApiRoute.post('/users', isAuthenticatedApi, userHandler.create);
adminApiRoute.delete('/users/:id', isAuthenticatedApi, userHandler.doDelete);
adminApiRoute.put('/users/:id', isAuthenticatedApi, userHandler.update);
adminApiRoute.get('/fb', isAuthenticatedApi, feedbacksHandler.list);
adminApiRoute.get('/*', defaultHandler);

export default adminApiRoute;

function defaultHandler(requ: Request, resp: Response) : void {
	errorResponse(resp, undefined, 'Unknown API endpoint', { status: 404 });
}
