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

import * as moment from 'moment';

import { isString, pick, pickBy } from 'lodash';
import { URL } from 'url';

import ArticleURL from 'base/ArticleURL';
import Website from 'base/Website';

import { ObjectID } from 'app/db';
import { WebsiteModel } from 'app/db/models';

import {
	wrapFind,
	wrapFindOne,
	wrapSave
} from 'app/db/common';

import emptyCheck from 'app/util/emptyCheck';

/**
 * Returns a single Website object if the exact name is found in the database.
 * "name" is the primary key on the websites collection.
 */
export function get(name : string) : Promise <Website> {
	emptyCheck(name);
	return wrapFindOne(WebsiteModel.findOne({ name }));
}

export function getByID(id : ObjectID|string) : Promise <Website> {
	emptyCheck(id);
	return wrapFindOne(WebsiteModel.findOne({ _id: id }));
}

export function identify(articleURL : ArticleURL|string) : Promise <Website> {
	emptyCheck(articleURL);

	const url = new URL(isString(articleURL) ? articleURL : articleURL.href);
	const hostname = url.hostname;

	return wrapFindOne (WebsiteModel.findOne({ 'hosts': hostname }));
}

export function save(website : Website) : Promise <Website> {
	emptyCheck(website);
	return wrapSave(new WebsiteModel(website).save());
}

export function update(name : string, data:any) : Promise <Website> {
	emptyCheck(name, data);
	const {layout} = data;
	// Get only data we expect to update
	let updateData = pick(data,['name', 'hosts', 'chiefEditors', 'parserClass']);
	// Remove empty
	updateData = pickBy(updateData);

	return WebsiteModel.findOne({ name })
		.then(wsite => {
			if (!wsite) {
				throw new Error(`No such website ${name}`);
			}
			const resWrite = Object.assign(wsite, updateData);

			if (layout && 'templates' in layout) {
				if ('feedbackPage' in layout.templates) {
					resWrite.layout.templates.feedbackPage = layout.templates.feedbackPage;
				}
				if ('feedbackNotificationMail' in layout.templates) {
					resWrite.layout.templates.feedbackNotificationMail = layout.templates.feedbackNotificationMail;
				}
			}
			return wrapSave(resWrite.save());
		});
}

export function getToRunUnrevisedDigest(nowDate : Date) : Promise <Website[]> {
	const lastRunEarlierThan = moment(nowDate).subtract(22, 'hours').toDate();

	return wrapFind(WebsiteModel.find({
		'$and': [
			// Get all website where the digest flag is activated
			{
				'unrevisedDigest.isActive': true,
			},
			// Query based on lastRun-timestamp
			{
				'$or': [
					// If the job wasn't run yet, the timestamp is empty
					{
						'unrevisedDigest.lastRun': null,
					},
					// Otherwise check if the last run is at least 20 hours past (DST changes!)
					{
						'unrevisedDigest.lastRun': {
							'$lte': lastRunEarlierThan,
						},
					},
				],
			}, // $or
			// Now check if this is run past the "cron hour"
			{
				'unrevisedDigest.cronHour': {
					'$lte': moment(nowDate).hour(),
				},
			},
		], // $and
	}));
}

export function setUnrevisedDigestLastRun(website : Website) : Promise <void> {
	return wrapFindOne(WebsiteModel.findOneAndUpdate(
		{ _id : website.ID },
		{
			'$set': {
				'unrevisedDigest.lastRun': new Date(),
			},
		}
	));
}
