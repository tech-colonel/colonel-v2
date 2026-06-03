'use strict';
const { v4: uuidv4 } = require('uuid');
const Agent = require('../models/Agent');

module.exports = {
  async seed() {
    const existing = await Agent.findOne({ where: { name: 'Sales-Flipkart' } });
    if (existing) { console.log('  Sales-Flipkart already exists, skipping.'); return; }
    await Agent.create({
      id: uuidv4(),
      name: 'Sales-Flipkart',
      description: 'Process Flipkart marketplace sales data with GST, TCS, TDS calculation and SKU to FG mapping.',
      columns: [
        { name: 'sku', type: 'STRING', label: 'SKU' },
        { name: 'fg', type: 'STRING', label: 'FG (Finished Goods)' },
        { name: 'order_id', type: 'STRING', label: 'Order ID' },
        { name: 'final_invoice_amount', type: 'DECIMAL', label: 'Invoice Amount' },
        { name: 'gst_rate', type: 'DECIMAL', label: 'GST Rate' },
        { name: 'cgst_amount', type: 'DECIMAL', label: 'CGST' },
        { name: 'sgst_amount', type: 'DECIMAL', label: 'SGST' },
        { name: 'igst_amount', type: 'DECIMAL', label: 'IGST' },
        { name: 'tally_ledger', type: 'STRING', label: 'Tally Ledger' },
      ],
    });
  },
};
