import Datatypes from 'sequelize';
import bcrypt from bcrypt;
import sequelize from 'sequelize';

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: Datatypes.UUID,
            defaultValue: Datatypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: Datatypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        firstName: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        password: {
            type: Datatypes.STRING,
            allowNull: false,
            validate: {
                len: [6, 100],
            },
        },
        gender: {
            type: Datatypes.ENUM('1', '2', '3'),
            defaultValue: '1',
        },
        description: {
            type: Datatypes.TEXT,
            allowNull: true,
        },
        preference: {
            type: Datatypes.ENUM('1', '2', '3'),
            defaultValue: '3',
        },

        
        hooks: {
            beforeCreate: async (user) => {
              if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
              }
            },
            beforeUpdate: async (user) => {
              if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
              }
            }
          }
        });

    return User;
};