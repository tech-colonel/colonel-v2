'use strict';
const { v4: uuidv4 } = require('uuid');
const Agent = require('../models/Agent');

module.exports = {
  async seed() {
    const existing = await Agent.findOne({ where: { name: 'Sales-FirstCry' } });
    if (existing) { console.log('  Sales-FirstCry already exists, skipping.'); return; }
    await Agent.create({
      id: uuidv4(),
      name: 'Sales-FirstCry',
      description: 'Process FirstCry baby products marketplace sales with SR/RTO tracking and GST calculation.',
      columns: [
        { name: 'order_id', type: 'STRING', label: 'Order ID' },
        { name: 'product_name', type: 'STRING', label: 'Product Name' },
        { name: 'quantity', type: 'INTEGER', label: 'Quantity' },
        { name: 'gross_amount', type: 'DECIMAL', label: 'Gross Amount' },
        { name: 'total_amount', type: 'DECIMAL', label: 'Total Amount' },
        { name: 'sr_qty', type: 'INTEGER', label: 'SR Quantity' },
        { name: 'rto_qty', type: 'INTEGER', label: 'RTO Quantity' },
      ],
    });
  },
};
