'use strict';
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BrandUser = sequelize.define('BrandUser', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  brand_id: { type: DataTypes.UUID, allowNull: false },
  user_id: { type: DataTypes.UUID, allowNull: false },
}, { tableName: 'brand_users', timestamps: true });

module.exports = BrandUser;
