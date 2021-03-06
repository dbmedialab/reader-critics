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

import { Schema } from 'mongoose';

import { objectReference } from 'app/db/common';
import { ModelNames } from 'app/db/names';

import FeedbackStatus from 'base/FeedbackStatus';

const FeedbackStatusEntry = {
	status: {
		type: String,
		required: true,
		enum: Object.values(FeedbackStatus),
		default: FeedbackStatus.New,
	},
	changeDate: {
		type: Date,
		required: true,
	},
};

const FeedbackSchema : Schema = new Schema({
	// Direct references to related objects
	article: objectReference(ModelNames.Article),
	enduser: objectReference(ModelNames.EndUser),

	// Additional references to enable complex queries.
	// "website" and "authors" references are copied over from the ref. article
	website: objectReference(ModelNames.Website, {
		select: false,
	}),
	articleAuthors: {
		type: [objectReference(ModelNames.User)],
		select: false,
	},

	// Processing status
	status: Object.assign({
		log: {
			type : [Schema.Types.Mixed],
			required : false,
		},
	}, FeedbackStatusEntry),

	oneshotUpdateToken: {
		type: String,
		required: false,
	},

	// The actual feedback data
	items: [Schema.Types.Mixed],
});

export default FeedbackSchema;
