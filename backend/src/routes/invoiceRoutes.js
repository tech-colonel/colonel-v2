const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/agents/invoice-process/invoiceController');
const { feedInvoicesFromN8n } = require('../controllers/agents/invoice-process/n8n-invoice-feed-db');
const { authenticateToken } = require('../middleware/authMiddleware');
const { addSseClient, removeSseClient, getState } = require('../utils/invoiceEvents');

const { processInvoice, cancelProcessing, getInvoices, getSheetUrl, updateInvoice, deleteInvoice } = invoiceController;

router.post('/brands/:brandId/agents/:agentId/invoice/process',              authenticateToken, processInvoice);
router.post('/brands/:brandId/agents/:agentId/invoice/cancel',               authenticateToken, cancelProcessing);
router.get('/brands/:brandId/agents/:agentId/invoices',                      authenticateToken, getInvoices);
router.get('/brands/:brandId/agents/:agentId/invoice/sheet-url',             authenticateToken, getSheetUrl);
router.patch('/brands/:brandId/agents/:agentId/invoices/:invoiceId',         authenticateToken, updateInvoice);
router.delete('/brands/:brandId/agents/:agentId/invoices/:invoiceId',        authenticateToken, deleteInvoice);

// ─── SSE: Real-time invoice processing status ──────────────────────────────
router.get('/brands/:brandId/agents/:agentId/invoice/status', authenticateToken, (req, res) => {
  const { brandId, agentId } = req.params;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  addSseClient(brandId, agentId, res);

  const currentState = getState(brandId, agentId);
  res.write(`data: ${JSON.stringify(currentState)}\n\n`);

  const keepAlive = setInterval(() => {
    try { res.write(': ping\n\n'); } catch (_) { clearInterval(keepAlive); }
  }, 25000);

  req.on('close', () => {
    clearInterval(keepAlive);
    removeSseClient(brandId, agentId, res);
  });
});

// n8n webhook db feed (no auth — called by n8n directly)
router.post('/n8n/feed', feedInvoicesFromN8n);

module.exports = router;
