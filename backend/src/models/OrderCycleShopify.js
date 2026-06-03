'use strict';
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderCycleShopify = sequelize.define('OrderCycleShopify', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  brand_id: { type: DataTypes.UUID, allowNull: false },
  month: { type: DataTypes.INTEGER },
  year: { type: DataTypes.INTEGER },
  filename: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  date: { type: DataTypes.DATE },
  sale_order_number: { type: DataTypes.STRING },
  platform: { type: DataTypes.STRING },
  invoice_number: { type: DataTypes.STRING },
  awb_number: { type: DataTypes.STRING },
  shipping_partner: { type: DataTypes.STRING },
  dispatch_or_cancellation_date: { type: DataTypes.DATE },
  return_date: { type: DataTypes.DATE },
  total_amount: { type: DataTypes.DECIMAL(15, 4) },
  return_amount: { type: DataTypes.DECIMAL(15, 4) },
  net_amount: { type: DataTypes.DECIMAL(15, 4) },
  srn: { type: DataTypes.STRING },
  ekart_remittance_date: { type: DataTypes.DATE },
  ekart_actual_remittance_date: { type: DataTypes.DATE },
  ekart_cod_amount: { type: DataTypes.DECIMAL(15, 4) },
  delhivery_delivery_date: { type: DataTypes.DATE },
  delhivery_cod_amount: { type: DataTypes.DECIMAL(15, 4) },
  xpressbees_delivery_date: { type: DataTypes.DATE },
  xpressbees_transaction_date: { type: DataTypes.DATE },
  xpressbees_net_payment: { type: DataTypes.DECIMAL(15, 4) },
  snapmint_settlement_date: { type: DataTypes.DATE },
  snapmint_settlement_value: { type: DataTypes.DECIMAL(15, 4) },
  bharatx_settlement_timestamp: { type: DataTypes.DATE },
  bharatx_ledger_amount: { type: DataTypes.DECIMAL(15, 4) },
}, { tableName: 'order_cycle_shopify', timestamps: true });

module.exports = OrderCycleShopify;
