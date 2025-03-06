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
        birthdate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
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


// class UserModel {
//     // Méthode pour créer un nouvel utilisateur
//     static async create(userData) {
//       const { 
//         email, 
//         firstName, 
//         lastName, 
//         password, 
//         gender, 
//         description, 
//         preference,
//         age
//       } = userData;

//     try{
//         const existingUser = await Pool.query(
//             'SELECT * FROM users WHERE email = $1',
//             [email]
//         );
//         if (existingUser.rows.lenght > 0){
//             throw new Error('Cet email est deja utilise');
//         }

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password , salt);

//         const querry = `ISERT INTO users 
//         (email, first_name, last_name, password, gender, description, preference, age)
//         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
//         RETURNING id, email, firstName, lastName 
//         `;
//         const values = [
//             email,
//             firstName,
//             lastName,
//             hashedPassword,
//             gender,
//             description || '',
//             preference,
//             age,
//           ];

//         const result = await pool.query(query, values);
//         // Retourner l'utilisateur sans le mot de passe
//         return result.rows[0];
    
//         }catch (error){
//             console.error('Erreur lors de la création de l\'utilisateur:', error);
//             throw error;
//         }
//     }

//     static async findByEmail(email) {
//         try {
//           const query = 'SELECT * FROM users WHERE email = $1';
//           const result = await pool.query(query, [email]);
//           return result.rows[0];
//         } catch (error) {
//           console.error('Erreur lors de la recherche de l\'utilisateur:', error);
//           throw error;
//         }
//       }
//     }
    
export default UserModel;