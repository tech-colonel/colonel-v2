const { Brand, BrandUser, User, Agent, BrandAgent, SalesAmazon } = require('../models');
const path = require('path');
const fs = require('fs-extra');

const OUTPUT_DIR = path.join(__dirname, '../../output');

const createBrand = async (req, res, next) => {
  try {
    const { name, description, image_url } = req.body;

    const existingBrand = await Brand.findOne({ where: { name } });
    if (existingBrand) {
      return res.status(400).json({ error: 'Brand already exists' });
    }

    const brand = await Brand.create({ name, description, image_url });

    res.status(201).json({ message: 'Brand created successfully', brand });
  } catch (error) {
    next(error);
  }
};

const getAllBrands = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      const brands = await Brand.findAll({ order: [['createdAt', 'DESC']] });
      return res.json(brands);
    }

    const user = await User.findByPk(req.user.id, {
      include: [{ model: Brand, through: { attributes: [] } }]
    });

    res.json(user.Brands || []);
  } catch (error) {
    next(error);
  }
};

const getBrandById = async (req, res, next) => {
  if (req.params.id === 'my-brands') return next();
  try {
    const brand = await Brand.findByPk(req.params.id);
    if (!brand) return res.status(404).json({ error: 'Brand not found' });
    res.json(brand);
  } catch (error) {
    next(error);
  }
};

const assignUserToBrand = async (req, res, next) => {
  try {
    const { brand_id, user_id } = req.body;

    const brand = await Brand.findByPk(brand_id);
    const user = await User.findByPk(user_id);

    if (!brand || !user) return res.status(404).json({ error: 'Brand or User not found' });

    await BrandUser.findOrCreate({ where: { brand_id, user_id } });

    res.json({ message: 'User assigned to brand successfully' });
  } catch (error) {
    next(error);
  }
};

const getBrandUsers = async (req, res, next) => {
  try {
    const brand = await Brand.findByPk(req.params.brandId, {
      include: [{ model: User, through: { attributes: [] } }]
    });

    if (!brand) return res.status(404).json({ error: 'Brand not found' });

    res.json(brand.Users || []);
  } catch (error) {
    next(error);
  }
};

const getBrandStatus = async (req, res, next) => {
  try {
    const brand = await Brand.findByPk(req.params.id, {
      include: [{ model: Agent, through: { attributes: [] } }]
    });

    if (!brand) return res.status(404).json({ error: 'Brand not found' });

    const numToMonth = {
      1: 'January', 2: 'February', 3: 'March', 4: 'April',
      5: 'May', 6: 'June', 7: 'July', 8: 'August',
      9: 'September', 10: 'October', 11: 'November', 12: 'December'
    };

    // Get all BrandAgent data for this brand
    const brandAgentsData = await BrandAgent.findAll({ where: { brand_id: brand.id } });
    const masterDataMap = {};
    for (const ba of brandAgentsData) {
      masterDataMap[ba.agent_id] = {
        hasSkuMaster: Array.isArray(ba.sku_master) && ba.sku_master.length > 0,
        hasLedgerMaster: Array.isArray(ba.ledger_master) && ba.ledger_master.length > 0,
        skuMasterCount: Array.isArray(ba.sku_master) ? ba.sku_master.length : 0,
        ledgerMasterCount: Array.isArray(ba.ledger_master) ? ba.ledger_master.length : 0
      };
    }

    // Map agent name -> model
    const { SalesFlipkart, SalesMyntra, SalesBlinkit, SalesJiomart,
      SalesFirstcry, SalesZepto, SalesNykaa, SalesShopify,
      SettlementAmazon, OrderCycleShopify, Invoice } = require('../models');

    const agentModelMap = {
      'sales_amazon': SalesAmazon,
      'sales_flipkart': SalesFlipkart,
      'sales_myntra': SalesMyntra,
      'sales_blinkit': SalesBlinkit,
      'sales_jiomart': SalesJiomart,
      'sales_firstcry': SalesFirstcry,
      'sales_zepto': SalesZepto,
      'sales_nykaa': SalesNykaa,
      'sales_shopify': SalesShopify,
      'settlement_amazon': SettlementAmazon,
      'order_cycle_shopify': OrderCycleShopify,
      'invoice_process': Invoice,
    };

    const agentsProgress = [];

    for (const agent of brand.Agents) {
      const tableName = agent.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const Model = agentModelMap[tableName];
      let generatedFiles = [];

      if (Model) {
        try {
          const rows = await Model.findAll({
            attributes: ['id', 'month', 'year', 'filename', 'created_at'],
            where: { brand_id: brand.id },
            order: [['created_at', 'DESC']],
            raw: true
          });

          const uniqueFilesMap = new Map();
          for (const row of rows) {
            if (row.filename && !uniqueFilesMap.has(row.filename)) {
              uniqueFilesMap.set(row.filename, row);
            }
          }

          generatedFiles = Array.from(uniqueFilesMap.values()).map(row => {
            const filePath = row.filename ? path.join(OUTPUT_DIR, row.filename) : null;
            const fileExists = filePath ? fs.existsSync(filePath) : false;
            return {
              month: numToMonth[row.month] || row.month,
              year: row.year,
              filename: row.filename,
              fileId: row.id,
              fileExists
            };
          });
        } catch (err) {
          console.error(`Query failed for agent ${agent.name}`, err);
        }
      }

      const masterStatus = masterDataMap[agent.id] || {
        hasSkuMaster: false, hasLedgerMaster: false, skuMasterCount: 0, ledgerMasterCount: 0
      };

      agentsProgress.push({
        agentId: agent.id,
        agentName: agent.name,
        generatedFiles,
        masterStatus
      });
    }

    res.json({ brandId: brand.id, brandName: brand.name, agents: agentsProgress });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBrand,
  getAllBrands,
  getBrandById,
  assignUserToBrand,
  getBrandUsers,
  getBrandStatus
};
