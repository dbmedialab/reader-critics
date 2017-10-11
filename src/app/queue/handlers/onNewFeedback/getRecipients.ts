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

import { uniq } from 'lodash';

import Feedback from 'base/Feedback';
import Person from 'base/zz/Person';
import Website from 'base/Website';

import { EmptyError } from 'app/util/errors';

const msgNoRcpt = 'Could not determine recipients for feedback notification e-mail';

export default function (website : Website, feedback : Feedback) : Promise <Array <string>> {
	let recipients : Array <string> = filterForMailAddr(feedback.article.authors);

	if (recipients.length <= 0) {
		recipients = filterForMailAddr(website.chiefEditors);
	}

	// If the list of recipients is still empty here then we can't really do
	// anything about that. The caller function will have to deal with it.
	if (recipients.length <= 0) {
		return Promise.reject(new EmptyError(msgNoRcpt));
	}

	return Promise.resolve(uniq(recipients));
}

const filterForMailAddr = (people : Array <Person>) : Array <string> =>
	people.filter((p : Person) => p.email.length > 0)
	.map((author : Person) => author.email);
