'use strict';
const { v4: uuidv4 } = require('uuid');
const Agent = require('../models/Agent');

module.exports = {
  async seed() {
    const existing = await Agent.findOne({ where: { name: 'Total-Sales-Analyzer' } });
    if (existing) { console.log('  Total-Sales-Analyzer already exists, skipping.'); return; }
    await Agent.create({
      id: uuidv4(),
      name: 'Total-Sales-Analyzer',
      description: 'Aggregate and analyze total sales across all channels without SKU/Ledger mapping. Provides cross-platform consolidated view.',
      columns: [
        { name: 'channel', type: 'STRING', label: 'Sales Channel' },
        { name: 'month', type: 'INTEGER', label: 'Month' },
        { name: 'year', type: 'INTEGER', label: 'Year' },
        { name: 'total_sales', type: 'DECIMAL', label: 'Total Sales' },
        { name: 'taxable_value', type: 'DECIMAL', label: 'Taxable Value' },
        { name: 'total_gst', type: 'DECIMAL', label: 'Total GST' },
      ],
    });
  },
};
