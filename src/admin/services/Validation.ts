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

// tslint:disable:max-line-length

import Validation from 'base/Validation';
import customValidations from 'base/ValidationCustomValidations';

import { IValidationRules } from 'base/ValidationRules';

const additionalRules : IValidationRules = {
	userName: {
		type: 'string',
		pattern: /^[a-zA-Z0-9-.\\/_\s\u00C6\u00D8\u00C5\u00E6\u00F8\u00E5]{1,50}$/,
		error: 'User name should contain only alphanumeric characters, dash, underscore!',
	},

	userType: {
		type: 'string',
		gte: 1,
		lte: 3,
		error: 'Choose proper user role!',
	},

	userMail: {
		type: 'string',
		exec: customValidations.isEmail,
		error: 'User mail should be valid email address!', //'Skriv inn gyldig e-postadresse.'
	},

	websiteName: {
		type: 'string',
		minLength: 4,
		maxLength: 64,
		error: 'Site name has to be longer than 4 symbols',
	},

	escalateNumber: {
			type: 'number',
			gte: 0,
			lte: 10,
			error: 'Escalation Threshold should be in range 0..10',
	},

	uniqueness: {
		type: 'array',
		uniqueness: true,
		error: 'Has to be unique',
	},

	host: {
		type: 'string',
		minLength: 4,
		error: 'Host name is too short',
	},
};

class Validator extends Validation {
	constructor() {
		super();
		this.addValidationRules(additionalRules);
	}

}

export default Validator;
