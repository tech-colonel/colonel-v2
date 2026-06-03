const { Agent, Brand, BrandAgent } = require('../models');

const createAgent = async (req, res, next) => {
  try {
    const { name, description, columns } = req.body;

    const existingAgent = await Agent.findOne({ where: { name } });
    if (existingAgent) return res.status(400).json({ error: 'Agent already exists' });

    const agent = await Agent.create({ name, description, columns });

    res.status(201).json({ message: 'Agent created successfully', agent });
  } catch (error) {
    next(error);
  }
};

const getAllAgents = async (req, res, next) => {
  try {
    const agents = await Agent.findAll({ order: [['createdAt', 'DESC']] });
    res.json(agents);
  } catch (error) {
    next(error);
  }
};

const assignAgentToBrand = async (req, res, next) => {
  try {
    const { brand_id, agent_id } = req.body;

    const brand = await Brand.findByPk(brand_id);
    const agent = await Agent.findByPk(agent_id);

    if (!brand || !agent) return res.status(404).json({ error: 'Brand or Agent not found' });

    // Create assignment + initialize empty sku/ledger master
    await BrandAgent.findOrCreate({
      where: { brand_id, agent_id },
      defaults: { sku_master: [], ledger_master: [] }
    });

    res.json({ message: 'Agent assigned to brand successfully' });
  } catch (error) {
    next(error);
  }
};

const getBrandAgents = async (req, res, next) => {
  try {
    const brand = await Brand.findByPk(req.params.brandId, {
      include: [{ model: Agent, through: { attributes: [] } }]
    });

    if (!brand) return res.status(404).json({ error: 'Brand not found' });

    res.json(brand.Agents || []);
  } catch (error) {
    next(error);
  }
};

const proxyWebhook = async (req, res, next) => {
  try {
    const { webhookUrl, payload } = req.body;
    if (!webhookUrl) return res.status(400).json({ error: 'Webhook URL is required' });

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload || {})
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Webhook returned status ${response.status}` });
    }

    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = { message: 'Webhook triggered successfully (non-JSON response)' };
    }

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to trigger webhook' });
  }
};

module.exports = { createAgent, getAllAgents, assignAgentToBrand, getBrandAgents, proxyWebhook };
