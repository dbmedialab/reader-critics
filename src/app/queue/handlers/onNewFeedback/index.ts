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

import {
	DoneCallback,
	Job,
} from 'kue';

import Feedback from 'base/Feedback';
import MailTemplate from 'app/template/MailTemplate';
import Website from 'base/Website';

import {
	feedbackService,
	templateService,
	websiteService,
} from 'app/services';

import getRecipients from './getRecipients';
import layoutNotifyMail from './layoutNotifyMail';
import SendGridMailer from 'app/mail/sendgrid/SendGridMailer';

import * as app from 'app/util/applib';

const log = app.createLog();

export default function(job : Job, done : DoneCallback) : Promise <void> {
	if (!job.data.ID) {
		log('Feedback "ID" not found in job data');
		return Promise.resolve();
	}

	log(`Received new feedback event for ID ${job.data.ID}`);

	// There's loads of objects that need to be loaded:
	let feedback : Feedback;
	let template : MailTemplate;
	let website : Website;

	return new Promise <void> ((resolve, reject) => {
		// First, get the feedback object and the e-mail template.
		// Those two are independent, so we can query them in parallel:
		Promise.all([
			feedbackService.getByID(job.data.ID),
			templateService.getFeedbackNotifyTemplate(),
		])
		// Now that we have the article inside the feedback object, we can
		// ask for the "Website" that all this belongs to:
		.spread((f : Feedback, t : MailTemplate) => {
			feedback = f;  // But first, store these objects for later
			template = t;

			return websiteService.getByID(feedback.article.website);
		})
		// Now we have all the necessary objects, let's go ahead and make an e-mail
		// out of them
		.then((w : Website) => {
			website = w;

			// Again in parallel: layout the e-mail content and create a list of
			// recipients mail addresses that will receive this. Currently, the
			// function that creates the recipient list is not asynchronous but it
			// returns a Promise anyway. If no recipients can be found, it uses a
			// reject for flow control.
			return Promise.all([
				layoutNotifyMail(feedback, template),
				getRecipients(website, feedback),
			]);
		})
		.spread((htmlMailContent : string, recipients : Array <string>) => {
			log(htmlMailContent);
			log(recipients);

			return SendGridMailer(recipients, 'Leserkritikk', htmlMailContent);
		})
		.then(() => {
			done();
			resolve();
		})
		.catch(reject);
	});
}
