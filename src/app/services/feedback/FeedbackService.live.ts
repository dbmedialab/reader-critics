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

import Feedback from 'base/Feedback';
import FeedbackService from './FeedbackService';

import {
	FeedbackDocument,
	FeedbackModel
} from 'app/db/models';

import createPersistingService from '../createPersistingService';

import getAmountByArticle from './common/getAmountByArticle';

import { validateAndSave } from './common/validateAndSave';
import { validateAndUpdateEnduser } from './common/validateAndUpdateEnduser';

import {
	getByArticle,
	getByArticleAuthor,
	getByID,
	getByStatus,
	getByUpdateToken,
	getRange,
} from './dao/feedbackGet';

import {
	save,
	updateEndUser,
} from './dao/feedbackSave';

import {
	updateStatus,
} from './dao/feedbackStatus';

const service : FeedbackService
	= createPersistingService <FeedbackDocument, FeedbackService,	Feedback> (
		FeedbackModel, {
			getAmountByArticle,
			getByArticle,
			getByArticleAuthor,
			getByID,
			getByStatus,
			getByUpdateToken,
			getRange,
			save,
			validateAndSave,
			validateAndUpdateEnduser,
			updateEndUser,
			updateStatus,
		}
	);

module.exports = service;
