'use strict';
const { v4: uuidv4 } = require('uuid');
const Agent = require('../models/Agent');

module.exports = {
  async seed() {
    const existing = await Agent.findOne({ where: { name: 'Sales-Myntra' } });
    if (existing) { console.log('  Sales-Myntra already exists, skipping.'); return; }
    await Agent.create({
      id: uuidv4(),
      name: 'Sales-Myntra',
      description: 'Process Myntra fashion marketplace sales including RTO (Return to Origin), Packed, and Return files with GST calculation.',
      columns: [
        { name: 'sku', type: 'STRING', label: 'SKU' },
        { name: 'invoice_number', type: 'STRING', label: 'Invoice Number' },
        { name: 'debtor_ledger', type: 'STRING', label: 'Debtor Ledger' },
        { name: 'quantity', type: 'INTEGER', label: 'Quantity' },
        { name: 'base_value', type: 'DECIMAL', label: 'Base Value' },
        { name: 'gst_rate', type: 'DECIMAL', label: 'GST Rate' },
        { name: 'invoice_amount', type: 'DECIMAL', label: 'Invoice Amount' },
        { name: 'file_type', type: 'STRING', label: 'File Type (RTO/Packed/Return)' },
      ],
    });
  },
};
