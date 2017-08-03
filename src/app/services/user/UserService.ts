import User from 'base/User';

import BasicPersistingService from '../BasicPersistingService';

interface UserService extends BasicPersistingService <User> {
	checkPassword(user : User, password : string) : Promise <boolean>;
	get(username : String|null, email? : String|null) : Promise <User>;
	save(user : User) : Promise <User>;
}

export default UserService;
