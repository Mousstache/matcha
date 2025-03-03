import bcrypt from 'bcrypt';
import { DataTypes } from 'sequelize';

const UserModel = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [6, 100],
            },
        },
        gender: {
            type: DataTypes.ENUM('1', '2', '3'),
            defaultValue: '1',
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        preference: {
            type: DataTypes.ENUM('1', '2', '3'),
            defaultValue: '3',
        },

        // hooks: {
        //     beforeCreate: async (user) => {
        //       if (user.password) {
        //         const salt = await bcrypt.genSalt(10);
        //         user.password = await bcrypt.hash(user.password, salt);
        //       }
        //     },
        //     beforeUpdate: async (user) => {
        //       if (user.changed('password')) {
        //         const salt = await bcrypt.genSalt(10);
        //         user.password = await bcrypt.hash(user.password, salt);
        //       }
        //     }
        //   }
        });

    return User;
};

export default UserModel;