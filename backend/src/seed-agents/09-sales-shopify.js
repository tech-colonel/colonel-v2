'use strict';
const { v4: uuidv4 } = require('uuid');
const Agent = require('../models/Agent');

module.exports = {
  async seed() {
    const existing = await Agent.findOne({ where: { name: 'Sales-Shopify' } });
    if (existing) { console.log('  Sales-Shopify already exists, skipping.'); return; }
    await Agent.create({
      id: uuidv4(),
      name: 'Sales-Shopify',
      description: 'Process Shopify DTC (Direct-to-Consumer) sales with region-based GST calculation, SKU to FG mapping, and tally ledger assignment.',
      columns: [
        { name: 'product_variant_sku', type: 'STRING', label: 'SKU' },
        { name: 'fg', type: 'STRING', label: 'FG (Finished Goods)' },
        { name: 'invoice_number', type: 'STRING', label: 'Invoice Number' },
        { name: 'order_id', type: 'STRING', label: 'Order ID' },
        { name: 'net_sales', type: 'DECIMAL', label: 'Net Sales' },
        { name: 'gst_rate', type: 'DECIMAL', label: 'GST Rate' },
        { name: 'tally_ledger', type: 'STRING', label: 'Tally Ledger' },
        { name: 'shipping_region', type: 'STRING', label: 'Shipping Region' },
      ],
    });
  },
};
