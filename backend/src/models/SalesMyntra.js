'use strict';
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SalesMyntra = sequelize.define('SalesMyntra', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  brand_id: { type: DataTypes.UUID, allowNull: false },
  month: { type: DataTypes.INTEGER },
  year: { type: DataTypes.INTEGER },
  filename: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  date: { type: DataTypes.DATE },
  seller_gstin: { type: DataTypes.STRING },
  invoice_number: { type: DataTypes.STRING },
  debtor_ledger: { type: DataTypes.STRING },
  sku: { type: DataTypes.STRING },
  quantity: { type: DataTypes.INTEGER },
  shipping: { type: DataTypes.STRING },
  gst_rate: { type: DataTypes.DECIMAL(10, 4) },
  base_value: { type: DataTypes.DECIMAL(15, 4) },
  file_type: { type: DataTypes.STRING },
  igst_amount: { type: DataTypes.DECIMAL(15, 4) },
  cgst_amount: { type: DataTypes.DECIMAL(15, 4) },
  sgst_amount: { type: DataTypes.DECIMAL(15, 4) },
  invoice_amount: { type: DataTypes.DECIMAL(15, 4) },
}, { tableName: 'sales_myntra', timestamps: true });

module.exports = SalesMyntra;
