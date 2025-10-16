
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/sequelize';


interface ClientAttributes {
  id: number;
  name: string;
  email: string;
}


interface ClientCreationAttributes extends Optional<ClientAttributes, 'id'> { }

class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  public id!: number;
  public name!: string;
  public email!: string;


  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'clients',
    sequelize,
  }
);

export default Client;