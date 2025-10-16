

import Client from './client';
import Address from './address';
import Product from './product';
import Purchase from './purchase';
import PurchaseProduct from './purchaseproduct';

Client.hasMany(Address, {
    foreignKey: 'clientId',
    as: 'addresses',
});

Address.belongsTo(Client, {
    foreignKey: 'clientId',
    as: 'client',
});

Client.hasMany(Purchase, {
    foreignKey: 'clientId',
    as: 'purchases',
});
Purchase.belongsTo(Client, {
    foreignKey: 'clientId',
    as: 'client',
});

Purchase.belongsToMany(Product, {
    through: PurchaseProduct,
    foreignKey: 'purchaseId',
    otherKey: 'productId',
    as: 'products',
});

Product.belongsToMany(Purchase, {
    through: PurchaseProduct,
    foreignKey: 'productId',
    otherKey: 'purchaseId',
    as: 'purchases',
});


export { Client, Address, Product, Purchase, PurchaseProduct };