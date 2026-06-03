'use strict';
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Invoice = sequelize.define('Invoice', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  brand_id: { type: DataTypes.UUID, allowNull: false },
  agent_id: { type: DataTypes.UUID },
  processed_on: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  company: { type: DataTypes.STRING },
  invoice_number: { type: DataTypes.STRING },
  invoice_date: { type: DataTypes.DATE },
  due_date: { type: DataTypes.DATE },
  seller_gstin: { type: DataTypes.STRING },
  buyer_gstin: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING },
  product_name: { type: DataTypes.STRING },
  hsn_code: { type: DataTypes.STRING },
  quantity: { type: DataTypes.INTEGER },
  unit: { type: DataTypes.STRING },
  rate: { type: DataTypes.DECIMAL(15, 4) },
  cgst_rate: { type: DataTypes.DECIMAL(10, 4) },
  sgst_rate: { type: DataTypes.DECIMAL(10, 4) },
  igst_rate: { type: DataTypes.DECIMAL(10, 4) },
  cgst_amount: { type: DataTypes.DECIMAL(15, 4) },
  sgst_amount: { type: DataTypes.DECIMAL(15, 4) },
  igst_amount: { type: DataTypes.DECIMAL(15, 4) },
  gst_amount: { type: DataTypes.DECIMAL(15, 4) },
  taxable_value: { type: DataTypes.DECIMAL(15, 4) },
  invoice_link: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' },
}, { tableName: 'invoices', timestamps: true });

module.exports = Invoice;
