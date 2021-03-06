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

import { combineReducers } from 'redux';
import {routerReducer} from 'react-router-redux';

import ArticlesReducer from 'admin/reducers/ArticlesReducer';
import ArticleReducer from 'admin/reducers/ArticleReducer';
import UIReducer from 'admin/reducers/UIReducer';
import FeedbackReducer from 'admin/reducers/FeedbackReducer';
import UserReducer from 'admin/reducers/UserReducer';
import WebsiteReducer from 'admin/reducers/WebsiteReducer';
import UsersReducer from 'admin/reducers/UsersReducer';
import PaginationReducer from 'admin/reducers/PaginationReducer';
import SuggestionsReducer from 'admin/reducers/SuggestionsReducer';

export const CombineReducer:any = combineReducers({
	articles: ArticlesReducer,
	article: ArticleReducer,
	UI: UIReducer,
	feedback: FeedbackReducer,
	user: UserReducer,
	users: UsersReducer,
	pagination: PaginationReducer,
	router: routerReducer,
	suggestions: SuggestionsReducer,
	website: WebsiteReducer,
});
