'use strict';
const User = require('./User');
const Brand = require('./Brand');
const Agent = require('./Agent');
const BrandUser = require('./BrandUser');
const BrandAgent = require('./BrandAgent');
const SalesAmazon = require('./SalesAmazon');
const SalesFlipkart = require('./SalesFlipkart');
const SalesMyntra = require('./SalesMyntra');
const SalesBlinkit = require('./SalesBlinkit');
const SalesJiomart = require('./SalesJiomart');
const SalesFirstcry = require('./SalesFirstcry');
const SalesZepto = require('./SalesZepto');
const SalesNykaa = require('./SalesNykaa');
const SalesShopify = require('./SalesShopify');
const SettlementAmazon = require('./SettlementAmazon');
const OrderCycleShopify = require('./OrderCycleShopify');
const Invoice = require('./Invoice');

// User <-> Brand via BrandUser
User.belongsToMany(Brand, { through: BrandUser, foreignKey: 'user_id' });
Brand.belongsToMany(User, { through: BrandUser, foreignKey: 'brand_id' });
User.hasMany(BrandUser, { foreignKey: 'user_id' });
Brand.hasMany(BrandUser, { foreignKey: 'brand_id' });
BrandUser.belongsTo(User, { foreignKey: 'user_id' });
BrandUser.belongsTo(Brand, { foreignKey: 'brand_id' });

// Agent <-> Brand via BrandAgent
Brand.belongsToMany(Agent, { through: BrandAgent, foreignKey: 'brand_id' });
Agent.belongsToMany(Brand, { through: BrandAgent, foreignKey: 'agent_id' });
Agent.hasMany(BrandAgent, { foreignKey: 'agent_id' });
Brand.hasMany(BrandAgent, { foreignKey: 'brand_id' });
BrandAgent.belongsTo(Agent, { foreignKey: 'agent_id' });
BrandAgent.belongsTo(Brand, { foreignKey: 'brand_id' });

// Brand -> data tables
const dataTables = [SalesAmazon, SalesFlipkart, SalesMyntra, SalesBlinkit, SalesJiomart,
  SalesFirstcry, SalesZepto, SalesNykaa, SalesShopify, SettlementAmazon, OrderCycleShopify, Invoice];
dataTables.forEach(Model => {
  Brand.hasMany(Model, { foreignKey: 'brand_id' });
  Model.belongsTo(Brand, { foreignKey: 'brand_id' });
});

module.exports = {
  User, Brand, Agent, BrandUser, BrandAgent,
  SalesAmazon, SalesFlipkart, SalesMyntra, SalesBlinkit, SalesJiomart,
  SalesFirstcry, SalesZepto, SalesNykaa, SalesShopify,
  SettlementAmazon, OrderCycleShopify, Invoice,
};
