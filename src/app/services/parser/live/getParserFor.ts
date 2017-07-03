import * as fs from 'fs';

import ArticleURL from 'base/ArticleURL';
import Parser from 'base/Parser';
import ParserFactory from 'base/ParserFactory';
import Website from 'base/Website';

import * as app from 'app/util/applib';

import { ParserNotFoundError } from 'app/util/errors';

const log = app.createLog();

// getParserFor

export default function(website : Website) : Promise <ParserFactory> {
	const importName = `app/parser/impl/${getParserName(website)}`;
	log('"%s" resolves to %s', website.name, importName);

	return loadParserClass(importName).then(createParserFactory);
}

// Parser class name

const hasParser = (website : Website) : boolean =>
	(typeof website.parserClass === 'string') && (website.parserClass !== null);

const getParserName = (website : Website) : string =>
	hasParser(website) ? website.parserClass : 'GenericParser';

// Class loader

const isClassFunction = (classFn : any) : boolean =>
	(typeof classFn === 'function') && (typeof classFn.prototype === 'object');

function loadParserClass(importName : string) : Promise <Function> {
	// If you have TSlint on and your IDE is yelling "error" here, this actually works!
	return import(importName).then(parserModule => parserModule.default)
	.then((classFn : any) => {
		if (!isClassFunction(classFn)) {
			return Promise.reject(new TypeError(`Default export of ${importName} is not a class`));
		}

		return classFn;
	})
	.catch((error) => {
		if (error.code === 'MODULE_NOT_FOUND') {
			return Promise.reject(new ParserNotFoundError(`${importName} not found`));
		}
		return Promise.reject(error);
	});
}

// Create factory

function createParserFactory(parserClass : Function) : ParserFactory {
	return {
		newInstance: (...arghs) : Parser => {
			// Create a new instance using the class prototype
	//		const parserInstance = Object.create(parserClass.prototype);
			// Call constructor, creates "this" context
	//		log('instance:', app.inspect(parserInstance));
	//		log('the_type:', typeof parserInstance);
			// log(rawArticle.substr(0, 80));
			// log(articleURL);

			// https://stackoverflow.com/a/8843181
			const parserInstance = new (Function.prototype.bind.call(parserClass, null, ...arghs))();

			//parserClass.constructor.call(parserInstance, null, ...arghs);
			// That's all!
			return <Parser> parserInstance;
		},
	};
}
