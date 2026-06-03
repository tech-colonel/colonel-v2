'use strict';
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SalesZepto = sequelize.define('SalesZepto', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  brand_id: { type: DataTypes.UUID, allowNull: false },
  month: { type: DataTypes.INTEGER },
  year: { type: DataTypes.INTEGER },
  filename: { type: DataTypes.STRING },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  date: { type: DataTypes.DATE },
  sku_number: { type: DataTypes.STRING },
  sku_name: { type: DataTypes.STRING },
  ean: { type: DataTypes.STRING },
  sku_category: { type: DataTypes.STRING },
  sku_sub_category: { type: DataTypes.STRING },
  brand_name: { type: DataTypes.STRING },
  manufacturer_name: { type: DataTypes.STRING },
  manufacturer_id: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  sales_qty_units: { type: DataTypes.INTEGER },
  mrp: { type: DataTypes.DECIMAL(15, 4) },
  selling_price: { type: DataTypes.DECIMAL(15, 4) },
  gross_merchandise_value: { type: DataTypes.DECIMAL(15, 4) },
  gross_selling_value: { type: DataTypes.DECIMAL(15, 4) },
  pack_size: { type: DataTypes.INTEGER },
  unit_of_measure: { type: DataTypes.STRING },
  orders: { type: DataTypes.INTEGER },
  fg: { type: DataTypes.STRING },
  state: { type: DataTypes.STRING },
  tally_ledger: { type: DataTypes.STRING },
  invoice_number: { type: DataTypes.STRING },
  tax: { type: DataTypes.DECIMAL(15, 4) },
  taxable_value: { type: DataTypes.DECIMAL(15, 4) },
  igst: { type: DataTypes.DECIMAL(15, 4) },
  cgst: { type: DataTypes.DECIMAL(15, 4) },
  sgst: { type: DataTypes.DECIMAL(15, 4) },
}, { tableName: 'sales_zepto', timestamps: true });

module.exports = SalesZepto;
