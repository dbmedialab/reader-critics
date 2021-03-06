import User from 'base/User';
import UserRole from 'base/UserRole';

export default function(username: string, email?: string): Promise<User> {
	if (username !== 'admin') {
		return Promise.resolve(null);
	}

	return Promise.resolve({
		name: 'admin',
		email: 'admin@examplemedia.no',
		role: UserRole.SystemAdmin,
		users: [],
	});
}
