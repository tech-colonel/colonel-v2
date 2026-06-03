'use strict';
const { v4: uuidv4 } = require('uuid');
const Agent = require('../models/Agent');

module.exports = {
  async seed() {
    const existing = await Agent.findOne({ where: { name: 'Sales-JioMart' } });
    if (existing) { console.log('  Sales-JioMart already exists, skipping.'); return; }
    await Agent.create({
      id: uuidv4(),
      name: 'Sales-JioMart',
      description: 'Process JioMart marketplace sales with TCS/TDS calculation, SKU to FG mapping and state-wise GST.',
      columns: [
        { name: 'sku', type: 'STRING', label: 'SKU' },
        { name: 'fg', type: 'STRING', label: 'FG (Finished Goods)' },
        { name: 'order_id', type: 'STRING', label: 'Order ID' },
        { name: 'buyer_invoice_id', type: 'STRING', label: 'Invoice ID' },
        { name: 'final_invoice_amount', type: 'DECIMAL', label: 'Invoice Amount' },
        { name: 'taxable_value', type: 'DECIMAL', label: 'Taxable Value' },
        { name: 'final_gst_rate', type: 'DECIMAL', label: 'GST Rate' },
        { name: 'total_tcs_deducted', type: 'DECIMAL', label: 'Total TCS' },
      ],
    });
  },
};
