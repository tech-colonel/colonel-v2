'use strict';
const { v4: uuidv4 } = require('uuid');
const Agent = require('../models/Agent');

module.exports = {
  async seed() {
    const existing = await Agent.findOne({ where: { name: 'Sales-Zepto' } });
    if (existing) { console.log('  Sales-Zepto already exists, skipping.'); return; }
    await Agent.create({
      id: uuidv4(),
      name: 'Sales-Zepto',
      description: 'Process Zepto quick commerce sales with state-wise mapping, SKU to FG mapping, and GST/invoice generation.',
      columns: [
        { name: 'sku_number', type: 'STRING', label: 'SKU Number' },
        { name: 'sku_name', type: 'STRING', label: 'SKU Name' },
        { name: 'fg', type: 'STRING', label: 'FG (Finished Goods)' },
        { name: 'state', type: 'STRING', label: 'State' },
        { name: 'tally_ledger', type: 'STRING', label: 'Tally Ledger' },
        { name: 'sales_qty_units', type: 'INTEGER', label: 'Sales Quantity' },
        { name: 'taxable_value', type: 'DECIMAL', label: 'Taxable Value' },
        { name: 'invoice_number', type: 'STRING', label: 'Invoice Number' },
      ],
    });
  },
};
