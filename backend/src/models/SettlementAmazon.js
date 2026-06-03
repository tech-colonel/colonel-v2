'use strict';
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SettlementAmazon = sequelize.define('SettlementAmazon', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  brand_id: { type: DataTypes.UUID, allowNull: false },
  date_time: { type: DataTypes.DATE },
  settlement_id: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING },
  order_id: { type: DataTypes.STRING },
  sku: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  quantity: { type: DataTypes.INTEGER },
  marketplace: { type: DataTypes.STRING },
  account_type: { type: DataTypes.STRING },
  fulfillment: { type: DataTypes.STRING },
  order_city: { type: DataTypes.STRING },
  order_state: { type: DataTypes.STRING },
  order_postal: { type: DataTypes.STRING },
  product_sales: { type: DataTypes.DECIMAL(15, 4) },
  shipping_credits: { type: DataTypes.DECIMAL(15, 4) },
  gift_wrap_credits: { type: DataTypes.DECIMAL(15, 4) },
  promotional_rebates: { type: DataTypes.DECIMAL(15, 4) },
  gst_before_tcs: { type: DataTypes.DECIMAL(15, 4) },
  tcs_cgst: { type: DataTypes.DECIMAL(15, 4) },
  tcs_sgst: { type: DataTypes.DECIMAL(15, 4) },
  tcs_igst: { type: DataTypes.DECIMAL(15, 4) },
  tds_194o: { type: DataTypes.DECIMAL(15, 4) },
  selling_fees: { type: DataTypes.DECIMAL(15, 4) },
  fba_fees: { type: DataTypes.DECIMAL(15, 4) },
  other_transaction_fees: { type: DataTypes.DECIMAL(15, 4) },
  other: { type: DataTypes.DECIMAL(15, 4) },
  total: { type: DataTypes.DECIMAL(15, 4) },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  filename: { type: DataTypes.STRING },
}, { tableName: 'settlement_amazon', timestamps: true });

module.exports = SettlementAmazon;
