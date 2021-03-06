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

//tslint:disable max-line-length

export const emailRegexp = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

export interface ICustomValidations {
	[index: string]: (schema: String, v: any) => void;
}

const customValidations = {
	isEmail: function(schema: String, v:any) {
		if (!emailRegexp.test(v)) {
			this.report(`${schema} must me an email`);
		}
	},
	isHost: function(schema: String, v:any) {
		const pattern = new RegExp(
			'^([w]{3,3}\\.)?[a-zA-Z0-9-]{1,61}[a-zA-Z0-9](\\.[a-zA-Z]{2,5})?\\.[a-zA-Z]{2,}$',
			'i');
		if (!pattern.test(v)) {
			this.report(`${schema} must be a valid host`);
		}
	},
};

export default customValidations;
