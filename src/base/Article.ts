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

import ArticleItem from './ArticleItem';
import ArticleURL from './ArticleURL';
import Feedback from './Feedback';
import PersistedModel from './zz/PersistedModel';
import User from './User';
import Website from './Website';

export interface Article extends PersistedModel {
	// Defining a unique version of one article
	url : ArticleURL
	version : string

	// Byline
	authors : User[]

	// Title as own property; this is also included in the article items if the
	// parser works correctly.
	title : string,

	category: string,

	website? : Website

	// Contents - Title, subtitle, everything is picked up as an item
	items : ArticleItem[]

	date? : {
		created?: Date
	}

	feedbacks? : Feedback[]

	status?: {
		escalated? : string
	}
}

export default Article;
