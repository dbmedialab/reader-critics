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

import { readFileSync } from 'fs';
import { join } from 'path';

import * as app from 'app/util/applib';

let opengraphHTML : string = null;

let listItemsHTML : string = null;

export function getListItemsHTML() : string {
	if (listItemsHTML === null) {
		listItemsHTML = load('ul-items.html');
	}
	return listItemsHTML;
}

export function getOpenGraphHTML() : string {
	if (opengraphHTML === null) {
		opengraphHTML = load('opengraph-meta.html');
	}
	return opengraphHTML;
}

function load(name : string) : string {
	return readFileSync(join(app.rootPath, 'resources', 'parser', name), 'utf-8');
}
