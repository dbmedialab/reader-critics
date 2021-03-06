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

import * as Promise from 'bluebird';

import Article from 'base/Article';
import EndUser from 'base/EndUser';
import Feedback from 'base/Feedback';
import FeedbackItem from 'base/FeedbackItem';
import FeedbackStatus from 'base/FeedbackStatus';

import { FeedbackModel } from 'app/db/models';
import { wrapFindOne, wrapSave } from 'app/db/common';

import emptyCheck from 'app/util/emptyCheck';

// save

export function save (
	article : Article,
	enduser : EndUser,
	items : FeedbackItem[],
	status : FeedbackStatus = FeedbackStatus.New,
	oneshotUpdateToken? : string
) : Promise <Feedback>
{
	emptyCheck(article, enduser, items);
	return makeDocument(
		article,
		enduser,
		items,
		status,
		oneshotUpdateToken
	)
	.then((doc: any) => wrapSave<Feedback>(new FeedbackModel(doc).save()));
}

const makeDocument = (
	article : Article,
	enduser : EndUser,
	items : FeedbackItem[],
	status : FeedbackStatus,
	oneshotUpdateToken : string
) => Promise.resolve({
	article: article.ID,
	enduser: enduser.ID,

	website: article.website.ID,
	articleAuthors: article.authors.map(author => author.ID),

	items,
	oneshotUpdateToken,

	status: {
		status,
		changeDate: new Date(),
		log: [],
	},
});

// Update enduser data

export function updateEndUser (feedback : Feedback, enduser : EndUser) : Promise <Feedback> {
	emptyCheck(enduser);

	return Promise.resolve(wrapFindOne(FeedbackModel.findOneAndUpdate(
		// Query:
		{ _id : feedback.ID },
		// Update data:
		{
			'$set': {
				enduser: enduser.ID,
			},
			'$unset': {
				oneshotUpdateToken: '',
			},
		}
	)));
}
