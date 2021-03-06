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

export interface BasicPersistingService <T> {
	clear() : Promise <void>;
	count() : Promise <number>;

	getRange(skip? : number, limit? : number, sort? : Object) : Promise <T[]>;
}

export default BasicPersistingService;

export function clear() : Promise <void> {
	throw new Error('Function is not implemented');
}

export const defaultLimit : number = 25;
export const defaultSkip : number = 0;
export const defaultSortField : string = 'date.created';
export const defaultSortOrder : number = -1;
export const defaultSort : Object = {
	[defaultSortField]: defaultSortOrder,
};
