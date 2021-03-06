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

import Article from 'base/Article';
import MainStore from 'admin/stores/MainStore';
import Api from 'admin/services/Api';
import * as ArticleActions from './ArticleActions';
import * as ArticleActionsCreator from 'admin/actions/ArticleActionsCreator';
import * as UIActions from 'admin/actions/UIActions';
import * as PaginationActions from 'admin/actions/PaginationActions';
import Feedback from 'base/Feedback';

export function setArticle(article: Article) {
	MainStore.dispatch(
		ArticleActionsCreator.setArticle(article)
	);
}

export function getArticle(id) {
	UIActions.showMainPreloader();
	Api.getArticle(id)
		.then(resp => ArticleActions.setArticle(resp));
}

export function setArticleFeedbacks(feedbacks: Array<Feedback>) {
	UIActions.hideMainPreloader();
	MainStore.dispatch(
		ArticleActionsCreator.setArticleFeedbacks(feedbacks)
	);
}

export function getArticleFeedbacks(id, page?, limit?, sort?, sortOrder?) {
	UIActions.showMainPreloader();
	Api.getArticleFeedbacks(id, page, limit, sort, sortOrder)
		.then(resp => {
			ArticleActions.setArticleFeedbacks(resp.feedbacks);
			PaginationActions.setPageCount(resp.pages);
		});
}

export function clear() {
	MainStore.dispatch(
		ArticleActionsCreator.clear()
	);
}
