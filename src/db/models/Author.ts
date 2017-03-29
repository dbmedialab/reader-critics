import { DataTypes, Sequelize } from 'sequelize';

import withDefaults from './defaults';

const Author = (sequelize: Sequelize, types: DataTypes) => {
	return sequelize.define('author', {
		id: {
			type: types.INTEGER.UNSIGNED,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true,
		},
		website_id: {
			type: types.INTEGER.UNSIGNED,
			allowNull: false,
		},
		full_name: {
			type: types.STRING,
			allowNull: false,
		},
		email: {
			type: types.STRING,
			allowNull: false,
			isEmail: true,
		},
	}, withDefaults({
		updatedAt: false,
		indexes: [
			{
				name: 'author_email',
				unique: true,
				fields: ['email'],
			},
		],
	}));
};

export default Author;
