
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/sequelize';

interface AddressAttributes {
  id: number;
  street: string;
  number: string;
  city: string;
  state: string;
  clientId: number;
}

interface AddressCreationAttributes extends Optional<AddressAttributes, 'id'> { }

class Address extends Model<AddressAttributes, AddressCreationAttributes> implements AddressAttributes {
  public id!: number;
  public street!: string;
  public number!: string;
  public city!: string;
  public state!: string;
  public clientId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Address.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'addresses',
    sequelize,
  }
);

export default Address;