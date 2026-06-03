'use strict';
const { v4: uuidv4 } = require('uuid');
const Agent = require('../models/Agent');

module.exports = {
  async seed() {
    const existing = await Agent.findOne({ where: { name: 'Invoice-Process' } });
    if (existing) { console.log('  Invoice-Process already exists, skipping.'); return; }
    await Agent.create({
      id: uuidv4(),
      name: 'Invoice-Process',
      description: 'Extract structured data from invoice PDFs via n8n webhook automation and store results with real-time SSE status updates.',
      columns: [
        { name: 'invoice_number', type: 'STRING', label: 'Invoice Number' },
        { name: 'invoice_date', type: 'DATE', label: 'Invoice Date' },
        { name: 'seller_gstin', type: 'STRING', label: 'Seller GSTIN' },
        { name: 'buyer_gstin', type: 'STRING', label: 'Buyer GSTIN' },
        { name: 'product_name', type: 'STRING', label: 'Product Name' },
        { name: 'taxable_value', type: 'DECIMAL', label: 'Taxable Value' },
        { name: 'gst_amount', type: 'DECIMAL', label: 'GST Amount' },
        { name: 'status', type: 'STRING', label: 'Status' },
      ],
    });
  },
};
