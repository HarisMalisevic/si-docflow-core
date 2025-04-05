import { Sequelize, DataTypes } from 'sequelize';
import path from 'path';
import dotenv from 'dotenv';
import DocumentType from './DocumentType';
import AdminUsers from './AdminUser';
import OAuthProvider from './OAuthProvider';

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
console.log("Loaded .env: " + path.resolve(__dirname, "../../.env"));
//console.log("Loaded environment variables:", process.env);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined")
}
const connectionString: string = process.env.DATABASE_URL;

const sequelize_obj = new Sequelize(connectionString,
  {
    dialect: "postgres",
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db: { Sequelize?: typeof Sequelize; sequelize?: Sequelize;[key: string]: any } = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize_obj;

// Import modela
db.document_types = DocumentType(sequelize_obj, DataTypes);
db.admin_users = AdminUsers(sequelize_obj, DataTypes);
db.oauth_providers = OAuthProvider(sequelize_obj, DataTypes);


// Relacije
db.oauth_providers.hasMany(db.admin_users, {
  foreignKey: 'oauth_provider',
  onDelete: 'CASCADE',
  as: 'admin_users'
});

export default db;