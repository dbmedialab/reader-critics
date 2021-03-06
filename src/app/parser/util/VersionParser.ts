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

import * as Cheerio from 'cheerio';

import { getLinkedData } from './LinkedData';

/**
 * Facebook's OpenGraph scheme
 * looks for <meta property="article:modified_time" content="...">
 */
export function getOpenGraphModifiedTime(
	select : Cheerio,
	looseMatching : boolean = false
) : string {
	let meta;

	if (looseMatching) {
		meta = select('meta[property="article:modified_time"]').toArray();

		if (meta.length === 0) {  // Fallback for sites that use the wrong attribute
			meta = select('meta[name="article:modified_time"]').toArray();
		}
	}
	else {
		meta = select('head').find('meta[property="article:modified_time"]');

		if (meta.length === 0) {  // Fallback for sites that use the wrong attribute
			meta = select('head').find('meta[name="article:modified_time"]');
		}
	}

	return meta.length < 1 ? undefined : select(meta[0]).attr('content');
}

/**
 * Linked-data according to Schema.org
 * looks for <script type="application/ld+json">...{JSON data}...</script>
 */
export function getLinkedDataModifiedTime(select : Cheerio) : string {
	return getLinkedData(select).dateModified || undefined;
}
