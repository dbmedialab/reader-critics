import * as Cheerio from 'cheerio';

import Article from 'base/Article';
import ArticleAuthor from 'base/ArticleAuthor';
import ArticleItem from 'base/ArticleItem';
import Parser from 'base/Parser';

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
	// }

	// protected parseContent() : Promise <ArticleItem[]> {
	// 	return Promise.resolve([]);
	// }

}
