const xlsx = require('xlsx');
const { BrandAgent, Brand } = require('../models');

const MONTH_NAME_TO_NUM = {
  'January': 1, 'February': 2, 'March': 3, 'April': 4,
  'May': 5, 'June': 6, 'July': 7, 'August': 8,
  'September': 9, 'October': 10, 'November': 11, 'December': 12
};

const toMonthNum = (m) => MONTH_NAME_TO_NUM[m] || parseInt(m) || null;
const toYearNum = (y) => parseInt(y) || null;

/**
 * Upload SKU or Ledger master for a brand-agent
 */
const uploadMasterData = async (brandId, agentId, type, fileBuffer) => {
  const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  const [brandAgent] = await BrandAgent.findOrCreate({
    where: { brand_id: brandId, agent_id: agentId },
    defaults: { sku_master: [], ledger_master: [] }
  });

  const updateData = {};
  if (type === 'sku') updateData.sku_master = data;
  else if (type === 'ledger') updateData.ledger_master = data;

  await brandAgent.update(updateData);
  return { count: data.length };
};

/**
 * Get master data for a brand-agent
 */
const getMasterData = async (brandId, agentId) => {
  const [brandAgent] = await BrandAgent.findOrCreate({
    where: { brand_id: brandId, agent_id: agentId },
    defaults: { sku_master: [], ledger_master: [] }
  });

  return {
    sku_master: brandAgent.sku_master || [],
    ledger_master: brandAgent.ledger_master || []
  };
};

const addSkuMasterSingle = async (brandId, agentId, skuData) => {
  const [brandAgent] = await BrandAgent.findOrCreate({
    where: { brand_id: brandId, agent_id: agentId },
    defaults: { sku_master: [], ledger_master: [] }
  });

  const currentSkuMaster = brandAgent.sku_master || [];
  const newEntry = {
    'Sales portal SKU': skuData.salesPortalSku,
    'Tally new SKU': skuData.tallyNewSku
  };
  if (skuData.rate !== undefined && skuData.rate !== '') {
    newEntry['Rate'] = skuData.rate;
  }
  const updatedSkuMaster = [...currentSkuMaster, newEntry];

  await brandAgent.update({ sku_master: updatedSkuMaster });
  return { success: true, count: updatedSkuMaster.length };
};

const deleteSkuMasterSingle = async (brandId, agentId, tallySku) => {
  const [brandAgent] = await BrandAgent.findOrCreate({
    where: { brand_id: brandId, agent_id: agentId },
    defaults: { sku_master: [], ledger_master: [] }
  });

  const currentSkuMaster = brandAgent.sku_master || [];
  const updatedSkuMaster = currentSkuMaster.filter(sku => {
    const currentTallySku = sku['Tally new SKU'] || sku['Tally SKU'] || sku.tallyNewSku || sku.fg || sku.FG;
    return currentTallySku !== tallySku;
  });

  await brandAgent.update({ sku_master: updatedSkuMaster });
  return { success: true, count: updatedSkuMaster.length };
};

module.exports = {
  uploadMasterData,
  getMasterData,
  addSkuMasterSingle,
  deleteSkuMasterSingle
};
