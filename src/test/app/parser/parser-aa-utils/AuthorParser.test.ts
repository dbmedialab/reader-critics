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

import 'mocha';

import { assert } from 'chai';

import * as Cheerio from 'cheerio';

import {
	getOpenGraphHTML,
} from './testData';

import {
	getOpenGraphAuthors,
} from 'app/parser/util/AuthorParser';

describe('AuthorParser', () => {

	it('OpenGraph', function() {
		const select : Cheerio = Cheerio.load(getOpenGraphHTML());
		const authors = getOpenGraphAuthors(select);

		assert.isArray(authors);
		assert.lengthOf(authors, 2);

		assert.property(authors[0], 'name');
		assert.property(authors[0], 'email');

		assert.deepEqual(authors[0], {
			name: 'Indiana Horst',
			email: 'horst@dagbladet.no',
		});
		assert.deepEqual(authors[1], {
			name: 'Ernst Eisenbichler',
			email: 'ee@aller.com',
		});
	});

});
