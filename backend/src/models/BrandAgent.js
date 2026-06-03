'use strict';
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BrandAgent = sequelize.define('BrandAgent', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  brand_id: { type: DataTypes.UUID, allowNull: false },
  agent_id: { type: DataTypes.UUID, allowNull: false },
  sku_master: { type: DataTypes.JSONB, defaultValue: [] },
  ledger_master: { type: DataTypes.JSONB, defaultValue: [] },
}, { tableName: 'brand_agents', timestamps: true });

module.exports = BrandAgent;
