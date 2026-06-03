'use strict';
const { v4: uuidv4 } = require('uuid');
const Agent = require('../models/Agent');

module.exports = {
  async seed() {
    const existing = await Agent.findOne({ where: { name: 'Order-Cycle-Shopify' } });
    if (existing) { console.log('  Order-Cycle-Shopify already exists, skipping.'); return; }
    await Agent.create({
      id: uuidv4(),
      name: 'Order-Cycle-Shopify',
      description: 'Track Shopify order lifecycle across logistics partners (Ekart, Delhivery, Xpressbees, Snapmint, BharatX) with COD reconciliation.',
      columns: [
        { name: 'sale_order_number', type: 'STRING', label: 'Sale Order Number' },
        { name: 'platform', type: 'STRING', label: 'Platform' },
        { name: 'invoice_number', type: 'STRING', label: 'Invoice Number' },
        { name: 'awb_number', type: 'STRING', label: 'AWB Number' },
        { name: 'shipping_partner', type: 'STRING', label: 'Shipping Partner' },
        { name: 'total_amount', type: 'DECIMAL', label: 'Total Amount' },
        { name: 'return_amount', type: 'DECIMAL', label: 'Return Amount' },
        { name: 'net_amount', type: 'DECIMAL', label: 'Net Amount' },
      ],
    });
  },
};
