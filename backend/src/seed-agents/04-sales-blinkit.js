'use strict';
const { v4: uuidv4 } = require('uuid');
const Agent = require('../models/Agent');

module.exports = {
  async seed() {
    const existing = await Agent.findOne({ where: { name: 'Sales-Blinkit' } });
    if (existing) { console.log('  Sales-Blinkit already exists, skipping.'); return; }
    await Agent.create({
      id: uuidv4(),
      name: 'Sales-Blinkit',
      description: 'Process Blinkit quick commerce sales data with state-wise GST breakup.',
      columns: [
        { name: 'order_id', type: 'STRING', label: 'Order ID' },
        { name: 'product_name', type: 'STRING', label: 'Product Name' },
        { name: 'quantity', type: 'INTEGER', label: 'Quantity' },
        { name: 'supply_state', type: 'STRING', label: 'Supply State' },
        { name: 'customer_state', type: 'STRING', label: 'Customer State' },
        { name: 'gst_rate', type: 'DECIMAL', label: 'GST Rate' },
        { name: 'taxable_value', type: 'DECIMAL', label: 'Taxable Value' },
        { name: 'total_gross_bill_amount', type: 'DECIMAL', label: 'Gross Bill Amount' },
      ],
    });
  },
};
