const { Brand, Agent, Invoice } = require('../../../models');
const { markProcessing, resetState } = require('../../../utils/invoiceEvents');

const parseDate = (dString) => {
  if (!dString) return null;
  const parts = dString.split(/[-/]/);
  if (parts.length === 3 && parts[2].length === 4) {
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  }
  return new Date(dString);
};

const processInvoice = async (req, res, next) => {
  try {
    const brandId = req.body.brandId || req.params.brandId;
    const agentId = req.body.agentId || req.params.agentId;

    const brand = await Brand.findByPk(brandId);
    const agent = await Agent.findByPk(agentId);
    if (!brand || !agent) return res.status(404).json({ error: 'Brand or Agent not found' });

    const webhookUrl =
      process.env[`${brand.name.toLowerCase()}_invoice_url`] ||
      process.env[`${brand.name.toUpperCase()}_invoice_url`] ||
      process.env[`${brand.name}_invoice_url`];

    if (!webhookUrl) {
      return res.status(400).json({
        error: `Webhook URL not configured in .env for brand "${brand.name}". Expected key: ${brand.name.toLowerCase()}_invoice_url`
      });
    }

    markProcessing(brandId, agentId);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId: brand.id, brandName: brand.name, agentId: agent.id, timestamp: new Date().toISOString() }),
        signal: AbortSignal.timeout(30000)
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return res.json({ success: true, message: 'Processing started. Invoices will appear once n8n finishes.', pending: true });
    } catch (apiError) {
      if (apiError.name === 'TimeoutError' || apiError.name === 'AbortError') {
        return res.json({ success: true, message: 'Processing started. Invoices will appear once n8n finishes.', pending: true });
      }
      console.error('[Invoice] n8n webhook error:', apiError.message);
      return res.status(502).json({ error: 'Failed to communicate with invoice processing webhook.' });
    }
  } catch (error) { next(error); }
};

const cancelProcessing = async (req, res, next) => {
  try {
    const { brandId, agentId } = req.params;
    resetState(brandId, agentId);
    res.json({ success: true, message: 'Processing cancelled' });
  } catch (error) { next(error); }
};

const getInvoices = async (req, res, next) => {
  try {
    const { brandId, agentId } = req.params;
    const brand = await Brand.findByPk(brandId);
    const agent = await Agent.findByPk(agentId);
    if (!brand || !agent) return res.status(404).json({ error: 'Brand or Agent not found' });

    try {
      const invoices = await Invoice.findAll({
        where: { brand_id: brandId },
        order: [['processed_on', 'DESC']]
      });
      res.json(invoices);
    } catch (err) {
      if (err.name === 'SequelizeDatabaseError') return res.json([]);
      throw err;
    }
  } catch (error) { next(error); }
};

const getSheetUrl = async (req, res, next) => {
  try {
    const { brandId } = req.params;
    const brand = await Brand.findByPk(brandId);
    if (!brand) return res.status(404).json({ error: 'Brand not found' });

    const sheetUrl =
      process.env[`${brand.name.toLowerCase()}_invoice_sheet`] ||
      process.env[`${brand.name.toUpperCase()}_invoice_sheet`] ||
      process.env[`${brand.name}_invoice_sheet`] || null;

    res.json({ sheetUrl });
  } catch (error) { next(error); }
};

const updateInvoice = async (req, res, next) => {
  try {
    const { brandId, agentId, invoiceId } = req.params;
    const brand = await Brand.findByPk(brandId);
    const agent = await Agent.findByPk(agentId);
    if (!brand || !agent) return res.status(404).json({ error: 'Brand or Agent not found' });

    const invoice = await Invoice.findOne({ where: { id: invoiceId, brand_id: brandId } });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    const allowed = [
      'company', 'invoice_number', 'invoice_date', 'due_date', 'seller_gstin',
      'buyer_gstin', 'category', 'product_name', 'hsn_code', 'quantity', 'unit',
      'rate', 'cgst_rate', 'sgst_rate', 'igst_rate', 'cgst_amount', 'sgst_amount',
      'igst_amount', 'gst_amount', 'taxable_value', 'invoice_link', 'status'
    ];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        if ((key === 'invoice_date' || key === 'due_date') && req.body[key]) {
          updates[key] = parseDate(req.body[key]);
        } else {
          updates[key] = req.body[key];
        }
      }
    }

    await invoice.update(updates);
    res.json({ success: true, message: 'Invoice updated successfully', data: invoice });
  } catch (error) { next(error); }
};

const deleteInvoice = async (req, res, next) => {
  try {
    const { brandId, agentId, invoiceId } = req.params;
    const invoice = await Invoice.findOne({ where: { id: invoiceId, brand_id: brandId } });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    await invoice.destroy();
    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error) { next(error); }
};

module.exports = { processInvoice, cancelProcessing, getInvoices, getSheetUrl, updateInvoice, deleteInvoice };
