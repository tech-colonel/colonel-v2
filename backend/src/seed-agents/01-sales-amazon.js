'use strict';
const { v4: uuidv4 } = require('uuid');
const { sequelize } = require('../config/database');
const Agent = require('../models/Agent');

module.exports = {
  async seed() {
    const existing = await Agent.findOne({ where: { name: 'Sales-Amazon' } });
    if (existing) {
      console.log('  Sales-Amazon already exists, skipping.');
      return;
    }
    await Agent.create({
      id: uuidv4(),
      name: 'Sales-Amazon',
      description: 'Process Amazon B2C and B2B sales data with GST calculation, TCS deduction, SKU to FG mapping, and state-wise ledger assignment.',
      columns: [
        { name: 'sku', type: 'STRING', label: 'SKU' },
        { name: 'fg', type: 'STRING', label: 'FG (Finished Goods)' },
        { name: 'invoice_number', type: 'STRING', label: 'Invoice Number' },
        { name: 'order_id', type: 'STRING', label: 'Order ID' },
        { name: 'invoice_amount', type: 'DECIMAL', label: 'Invoice Amount' },
        { name: 'taxable_value', type: 'DECIMAL', label: 'Taxable Value' },
        { name: 'cgst_tax', type: 'DECIMAL', label: 'CGST' },
        { name: 'sgst_tax', type: 'DECIMAL', label: 'SGST' },
        { name: 'igst_tax', type: 'DECIMAL', label: 'IGST' },
        { name: 'ship_to_state', type: 'STRING', label: 'Ship To State' },
      ],
    });
  },
};
