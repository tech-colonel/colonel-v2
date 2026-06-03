'use strict';
const { v4: uuidv4 } = require('uuid');
const Agent = require('../models/Agent');

module.exports = {
  async seed() {
    const existing = await Agent.findOne({ where: { name: 'Settlement-Amazon' } });
    if (existing) { console.log('  Settlement-Amazon already exists, skipping.'); return; }
    await Agent.create({
      id: uuidv4(),
      name: 'Settlement-Amazon',
      description: 'Parse Amazon settlement reports, store line-item data, and generate MIS Excel reports with financial summaries.',
      columns: [
        { name: 'settlement_id', type: 'STRING', label: 'Settlement ID' },
        { name: 'order_id', type: 'STRING', label: 'Order ID' },
        { name: 'sku', type: 'STRING', label: 'SKU' },
        { name: 'type', type: 'STRING', label: 'Transaction Type' },
        { name: 'product_sales', type: 'DECIMAL', label: 'Product Sales' },
        { name: 'total', type: 'DECIMAL', label: 'Total' },
        { name: 'tcs_cgst', type: 'DECIMAL', label: 'TCS CGST' },
        { name: 'tcs_igst', type: 'DECIMAL', label: 'TCS IGST' },
        { name: 'selling_fees', type: 'DECIMAL', label: 'Selling Fees' },
        { name: 'fba_fees', type: 'DECIMAL', label: 'FBA Fees' },
      ],
    });
  },
};
