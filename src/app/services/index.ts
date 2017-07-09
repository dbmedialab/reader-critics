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

declare function require(arg : string) : any;

// Import service interfaces

import ArticleService from './article/ArticleService';
import ParserService from './parser/ParserService';
import TemplateService from './template/TemplateService';
import WebsiteService from './website/WebsiteService';

// Determine execution environment

import * as app from 'app/util/applib';

const env : string = app.env === 'test' ? 'mock' : 'live';

// Declare service exports
// tslint:disable no-require-imports

export const articleService : ArticleService
	= require(`./article/ArticleService.${env}`);

export const parserService : ParserService
	= require(`./parser/ParserService.${env}`);

export const templateService : TemplateService
	= require(`./template/TemplateService.${env}`);

export const websiteService : WebsiteService
	= require(`./website/WebsiteService.${env}`);
