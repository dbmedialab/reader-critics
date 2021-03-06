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

import MainStore from 'admin/stores/MainStore';
import User from 'base/User';

import * as UIActions from 'admin/actions/UIActions';
import * as UserActionsCreator from 'admin/actions/UserActionsCreator';

export function deauthenticate() {
	localStorage.removeItem('rcUsername');
	localStorage.removeItem('rcUserEmail');
	localStorage.removeItem('rcUserRole');
	MainStore.dispatch(
		UserActionsCreator.deauthenticateUser()
	);
}

export function update(user: User) {
	localStorage.setItem('rcUsername', user.name);
	localStorage.setItem('rcUserEmail', user.email);
	localStorage.setItem('rcUserRole', user.role);
	MainStore.dispatch(
		UserActionsCreator.updateUser(user)
	);
	UIActions.hideLoginDialog();
	UIActions.hideMainPreloader();
}
