import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/sequelize';

interface PurchaseProductAttributes {
  purchaseId: number;
  productId: number;
  quantity: number;
}


class PurchaseProduct extends Model<PurchaseProductAttributes> implements PurchaseProductAttributes {
  public purchaseId!: number;
  public productId!: number;
  public quantity!: number;
}

PurchaseProduct.init(
  {
    purchaseId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'purchases',
        key: 'id',
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'purchaseproducts',
    sequelize,

  }
);

export default PurchaseProduct;