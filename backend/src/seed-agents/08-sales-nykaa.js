'use strict';
const { v4: uuidv4 } = require('uuid');
const Agent = require('../models/Agent');

module.exports = {
  async seed() {
    const existing = await Agent.findOne({ where: { name: 'Sales-Nykaa' } });
    if (existing) { console.log('  Sales-Nykaa already exists, skipping.'); return; }
    await Agent.create({
      id: uuidv4(),
      name: 'Sales-Nykaa',
      description: 'Process Nykaa beauty and wellness marketplace sales with NSV calculation and GST breakup.',
      columns: [
        { name: 'product_sku', type: 'STRING', label: 'Product SKU' },
        { name: 'product_name', type: 'STRING', label: 'Product Name' },
        { name: 'invoiceno', type: 'STRING', label: 'Invoice Number' },
        { name: 'quantity', type: 'DECIMAL', label: 'Quantity' },
        { name: 'nsv_net_sale_value', type: 'DECIMAL', label: 'NSV' },
        { name: 'taxable_amount', type: 'DECIMAL', label: 'Taxable Amount' },
        { name: 'tax_percent', type: 'DECIMAL', label: 'Tax %' },
        { name: 'order_shipping_state', type: 'STRING', label: 'Shipping State' },
      ],
    });
  },
};
