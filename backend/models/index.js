import { sequelize } from '../config/db.js';
import UserModel from './User.js';


const User = UserModel(sequelize);

const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true});
        console.log('Database synchronized');
    }catch (error) {    
        console.error('Error synchronizing database:', error);
    }
};

export { User, syncDatabase };