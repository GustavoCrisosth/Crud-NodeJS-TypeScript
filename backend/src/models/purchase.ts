import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/sequelize';

interface PurchaseAttributes {
  id: number;
  totalPrice: number;
  clientId: number;
}

interface PurchaseCreationAttributes extends Optional<PurchaseAttributes, 'id'> { }

class Purchase extends Model<PurchaseAttributes, PurchaseCreationAttributes> implements PurchaseAttributes {
  public id!: number;
  public totalPrice!: number;
  public clientId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Purchase.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'purchases',
    sequelize,
  }
);

export default Purchase;