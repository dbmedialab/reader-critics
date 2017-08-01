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

import EndUser from 'base/EndUser';

import {
	EndUserDocument,
	EndUserModel
} from 'app/db/models';

import {
	wrapSave,
} from 'app/db/common';

import emptyCheck from 'app/util/emptyCheck';

import genericGetUser from '../user/dao/genericGetUser';

export function get(username : String|null, email? : String|null) : Promise <EndUser> {
	return genericGetUser<EndUserDocument, EndUser>(EndUserModel, username, email);
}

export function save(user : EndUser) : Promise <EndUser> {
	emptyCheck(user);
	return wrapSave<EndUser>(new EndUserModel(user).save());
}
