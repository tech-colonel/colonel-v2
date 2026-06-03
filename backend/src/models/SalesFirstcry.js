'use strict';
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SalesFirstcry = sequelize.define('SalesFirstcry', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  brand_id: { type: DataTypes.UUID, allowNull: false },
  month: { type: DataTypes.INTEGER },
  year: { type: DataTypes.INTEGER },
  filename: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  fc_ref_no: { type: DataTypes.STRING },
  order_id: { type: DataTypes.STRING },
  order_date: { type: DataTypes.DATE },
  shipping_date: { type: DataTypes.DATE },
  delivery_date: { type: DataTypes.DATE },
  sr_rto_date: { type: DataTypes.DATE },
  invoice_date: { type: DataTypes.DATE },
  product_id: { type: DataTypes.STRING },
  hsn_code: { type: DataTypes.STRING },
  product_name: { type: DataTypes.STRING },
  quantity: { type: DataTypes.INTEGER },
  mrp: { type: DataTypes.DECIMAL(15, 4) },
  base_cost: { type: DataTypes.DECIMAL(15, 4) },
  gross_amount: { type: DataTypes.DECIMAL(15, 4) },
  cgst_percent: { type: DataTypes.DECIMAL(10, 4) },
  cgst_amount: { type: DataTypes.DECIMAL(15, 4) },
  sgst_percent: { type: DataTypes.DECIMAL(10, 4) },
  sgst_amount: { type: DataTypes.DECIMAL(15, 4) },
  total_amount: { type: DataTypes.DECIMAL(15, 4) },
  vendor_invoice_no: { type: DataTypes.STRING },
  payment_advice_no: { type: DataTypes.STRING },
  debit_note_no: { type: DataTypes.STRING },
  sr_qty: { type: DataTypes.INTEGER },
  sr_total_amount: { type: DataTypes.DECIMAL(15, 4) },
  sr_gross_amount: { type: DataTypes.DECIMAL(15, 4) },
  rto_qty: { type: DataTypes.INTEGER },
  rto_total_amount: { type: DataTypes.DECIMAL(15, 4) },
  rto_gross_amount: { type: DataTypes.DECIMAL(15, 4) },
}, { tableName: 'sales_firstcry', timestamps: true });

module.exports = SalesFirstcry;
