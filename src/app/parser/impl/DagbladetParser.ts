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

import * as Cheerio from 'cheerio';

import ArticleAuthor from 'base/ArticleAuthor';

// import BaseParser from '../BaseParser';
import GenericParser from './GenericParser';

import * as CheerioPlugin from '../util/CheerioPlugin';

import { getOpenGraphAuthors } from '../util/AuthorParser';
import { getOpenGraphModifiedTime } from '../util/VersionParser';

import * as app from 'app/util/applib';

const log = app.createLog();

export default class DagbladetParser extends GenericParser {

	protected select : Cheerio;

	protected initialize() : Promise <any> {
		return CheerioPlugin.create(this.rawArticle)
			.then((s : Cheerio) => this.select = s);
	}

	protected parseVersion() : Promise <string> {
		log('parsing a version');
		return Promise.resolve(getOpenGraphModifiedTime(this.select));
	}

	protected parseByline() : Promise <ArticleAuthor[]> {
		return Promise.resolve(getOpenGraphAuthors(this.select));
	}

	// protected parseTitles() : Promise <ArticleItem[]> {
	// 	return Promise.resolve([]);
	// } TODO

	// protected parseContent() : Promise <ArticleItem[]> {
	// 	return Promise.resolve([]);
	// } TODO

}
