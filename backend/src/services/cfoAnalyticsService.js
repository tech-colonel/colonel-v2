const { Brand, Agent, SalesAmazon } = require('../models');
const { Op, Sequelize } = require('sequelize');
const { format } = require('date-fns');

const getMonthYearFilter = (startDate, endDate) => {
  if (!startDate && !endDate) return null;
  const filters = [];
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const sy = start.getFullYear(), sm = start.getMonth() + 1;
    const ey = end.getFullYear(), em = end.getMonth() + 1;
    if (sy === ey) {
      filters.push(Sequelize.where(Sequelize.literal(`(year = ${sy} AND month >= ${sm} AND month <= ${em})`), Sequelize.Op.eq, Sequelize.literal('true')));
    } else {
      filters.push(Sequelize.where(Sequelize.literal(`(year = ${sy} AND month >= ${sm}) OR (year > ${sy} AND year < ${ey}) OR (year = ${ey} AND month <= ${em})`), Sequelize.Op.eq, Sequelize.literal('true')));
    }
  } else if (startDate) {
    const s = new Date(startDate);
    filters.push(Sequelize.where(Sequelize.literal(`(year > ${s.getFullYear()}) OR (year = ${s.getFullYear()} AND month >= ${s.getMonth() + 1})`), Sequelize.Op.eq, Sequelize.literal('true')));
  } else {
    const e = new Date(endDate);
    filters.push(Sequelize.where(Sequelize.literal(`(year < ${e.getFullYear()}) OR (year = ${e.getFullYear()} AND month <= ${e.getMonth() + 1})`), Sequelize.Op.eq, Sequelize.literal('true')));
  }
  return filters.length > 0 ? { [Op.and]: filters } : null;
};

const buildWhere = (brandId, startDate, endDate, extra = {}) => {
  const mf = getMonthYearFilter(startDate, endDate);
  const base = { brand_id: brandId, ...extra };
  return mf ? { ...base, [Op.and]: mf[Op.and] } : base;
};

const getSummaryMetrics = async (brandId, agentId, startDate, endDate) => {
  const where = buildWhere(brandId, startDate, endDate);
  const summary = await SalesAmazon.findAll({
    attributes: [
      [Sequelize.fn('SUM', Sequelize.col('final_amount_receivable')), 'total_revenue'],
      [Sequelize.fn('SUM', Sequelize.col('final_cgst_tax')), 'total_cgst'],
      [Sequelize.fn('SUM', Sequelize.col('final_sgst_tax')), 'total_sgst'],
      [Sequelize.fn('SUM', Sequelize.col('final_igst_tax')), 'total_igst'],
      [Sequelize.fn('SUM', Sequelize.literal("CAST(final_cgst_tax AS DECIMAL) + CAST(final_sgst_tax AS DECIMAL) + CAST(final_igst_tax AS DECIMAL)")), 'total_tax'],
      [Sequelize.fn('SUM', Sequelize.col('quantity')), 'total_units'],
      [Sequelize.fn('COUNT', Sequelize.col('order_id')), 'transaction_count'],
      [Sequelize.fn('COUNT', Sequelize.literal("CASE WHEN quantity < 0 THEN 1 END")), 'refund_count']
    ],
    where, raw: true
  });
  const m = summary[0] || {};
  return {
    total_revenue: parseFloat(m.total_revenue) || 0,
    total_tax: parseFloat(m.total_tax) || 0,
    total_cgst: parseFloat(m.total_cgst) || 0,
    total_sgst: parseFloat(m.total_sgst) || 0,
    total_igst: parseFloat(m.total_igst) || 0,
    total_units: parseInt(m.total_units) || 0,
    transaction_count: parseInt(m.transaction_count) || 0,
    refund_count: parseInt(m.refund_count) || 0,
    refund_rate: m.transaction_count ? ((parseInt(m.refund_count) / parseInt(m.transaction_count)) * 100).toFixed(2) : 0
  };
};

const getStateWiseSales = async (brandId, agentId, startDate, endDate) => {
  const where = buildWhere(brandId, startDate, endDate);
  const stateData = await SalesAmazon.findAll({
    attributes: [
      'ship_to_state',
      [Sequelize.fn('SUM', Sequelize.col('final_amount_receivable')), 'revenue'],
      [Sequelize.fn('SUM', Sequelize.literal("CAST(final_cgst_tax AS DECIMAL) + CAST(final_sgst_tax AS DECIMAL) + CAST(final_igst_tax AS DECIMAL)")), 'tax'],
      [Sequelize.fn('COUNT', Sequelize.col('order_id')), 'transaction_count']
    ],
    where, group: ['ship_to_state'], raw: true,
    order: [[Sequelize.fn('SUM', Sequelize.col('final_amount_receivable')), 'DESC']]
  });
  return stateData.map(r => ({ state: r.ship_to_state || 'N/A', revenue: parseFloat(r.revenue) || 0, tax: parseFloat(r.tax) || 0, transactions: parseInt(r.transaction_count) || 0 }));
};

const getTopProducts = async (brandId, agentId, startDate, endDate, limit = 10) => {
  const where = buildWhere(brandId, startDate, endDate, { sku: { [Op.ne]: null } });
  const products = await SalesAmazon.findAll({
    attributes: [
      'sku', 'asin', 'item_description',
      [Sequelize.fn('SUM', Sequelize.col('final_amount_receivable')), 'revenue'],
      [Sequelize.fn('SUM', Sequelize.col('quantity')), 'units_sold'],
      [Sequelize.fn('COUNT', Sequelize.col('order_id')), 'transaction_count']
    ],
    where, group: ['sku', 'asin', 'item_description'], raw: true, limit,
    order: [[Sequelize.fn('SUM', Sequelize.col('final_amount_receivable')), 'DESC']]
  });
  return products.map(r => ({
    sku: r.sku, asin: r.asin, product_name: r.item_description || 'N/A',
    revenue: parseFloat(r.revenue) || 0, units_sold: parseInt(r.units_sold) || 0,
    transactions: parseInt(r.transaction_count) || 0,
    avg_price: (parseFloat(r.revenue) / parseInt(r.units_sold)) || 0
  }));
};

const getTaxAnalysis = async (brandId, agentId, startDate, endDate) => {
  const where = buildWhere(brandId, startDate, endDate);
  const taxData = await SalesAmazon.findAll({
    attributes: [
      [Sequelize.fn('SUM', Sequelize.col('final_cgst_tax')), 'item_cgst'],
      [Sequelize.fn('SUM', Sequelize.col('final_sgst_tax')), 'item_sgst'],
      [Sequelize.fn('SUM', Sequelize.col('final_igst_tax')), 'item_igst'],
      [Sequelize.fn('SUM', Sequelize.col('final_shipping_cgst_tax')), 'shipping_cgst'],
      [Sequelize.fn('SUM', Sequelize.col('final_shipping_sgst_tax')), 'shipping_sgst'],
      [Sequelize.fn('SUM', Sequelize.col('final_shipping_igst_tax')), 'shipping_igst'],
      [Sequelize.fn('SUM', Sequelize.literal("CAST(tcs_cgst_amount AS DECIMAL) + CAST(tcs_sgst_amount AS DECIMAL) + CAST(tcs_igst_amount AS DECIMAL) + CAST(tcs_utgst_amount AS DECIMAL)")), 'total_tcs']
    ],
    where, raw: true
  });
  const t = taxData[0] || {};
  return {
    item_cgst: parseFloat(t.item_cgst) || 0, item_sgst: parseFloat(t.item_sgst) || 0,
    item_igst: parseFloat(t.item_igst) || 0, shipping_cgst: parseFloat(t.shipping_cgst) || 0,
    shipping_sgst: parseFloat(t.shipping_sgst) || 0, shipping_igst: parseFloat(t.shipping_igst) || 0,
    total_tcs: parseFloat(t.total_tcs) || 0
  };
};

const getRefundAnalysis = async (brandId, agentId, startDate, endDate) => {
  const where = buildWhere(brandId, startDate, endDate);
  const refundData = await SalesAmazon.findAll({
    attributes: [
      'transaction_type',
      [Sequelize.fn('COUNT', Sequelize.col('order_id')), 'count'],
      [Sequelize.fn('SUM', Sequelize.literal('ABS(quantity)')), 'units'],
      [Sequelize.fn('SUM', Sequelize.col('final_amount_receivable')), 'amount'],
      [Sequelize.fn('SUM', Sequelize.literal("CAST(final_cgst_tax AS DECIMAL) + CAST(final_sgst_tax AS DECIMAL) + CAST(final_igst_tax AS DECIMAL)")), 'tax_impact']
    ],
    where, group: ['transaction_type'], raw: true
  });
  const shipments = refundData.find(r => r.transaction_type === 'Shipment') || {};
  const refunds = refundData.find(r => r.transaction_type === 'Refund') || {};
  return {
    shipments: { count: parseInt(shipments.count) || 0, units: parseInt(shipments.units) || 0, revenue: parseFloat(shipments.amount) || 0, tax_impact: parseFloat(shipments.tax_impact) || 0 },
    refunds: { count: parseInt(refunds.count) || 0, units: parseInt(refunds.units) || 0, amount: parseFloat(refunds.amount) || 0, tax_impact: parseFloat(refunds.tax_impact) || 0 }
  };
};

const getDiscountAnalysis = async (brandId, agentId, startDate, endDate) => {
  const where = buildWhere(brandId, startDate, endDate);
  const d = (await SalesAmazon.findAll({
    attributes: [
      [Sequelize.fn('SUM', Sequelize.col('item_promo_discount')), 'item_discount'],
      [Sequelize.fn('SUM', Sequelize.col('shipping_promo_discount')), 'shipping_discount'],
      [Sequelize.fn('SUM', Sequelize.col('gift_wrap_promo_discount')), 'gift_wrap_discount'],
      [Sequelize.fn('SUM', Sequelize.literal("CAST(item_promo_discount AS DECIMAL) + CAST(shipping_promo_discount AS DECIMAL) + CAST(gift_wrap_promo_discount AS DECIMAL)")), 'total_discount'],
      [Sequelize.fn('SUM', Sequelize.col('final_amount_receivable')), 'total_revenue']
    ],
    where, raw: true
  }))[0] || {};
  const totalRevenue = parseFloat(d.total_revenue) || 1;
  return {
    item_discount: parseFloat(d.item_discount) || 0, shipping_discount: parseFloat(d.shipping_discount) || 0,
    gift_wrap_discount: parseFloat(d.gift_wrap_discount) || 0, total_discount: parseFloat(d.total_discount) || 0,
    discount_as_percent_of_revenue: ((parseFloat(d.total_discount) || 0) / totalRevenue * 100).toFixed(2)
  };
};

const getPaymentMethodAnalysis = async (brandId, agentId, startDate, endDate) => {
  const where = buildWhere(brandId, startDate, endDate);
  const paymentData = await SalesAmazon.findAll({
    attributes: ['payment_method_code', [Sequelize.fn('COUNT', Sequelize.col('order_id')), 'count'], [Sequelize.fn('SUM', Sequelize.col('final_amount_receivable')), 'revenue']],
    where, group: ['payment_method_code'], raw: true,
    order: [[Sequelize.fn('SUM', Sequelize.col('final_amount_receivable')), 'DESC']]
  });
  return paymentData.map(r => ({ payment_method: r.payment_method_code || 'N/A', count: parseInt(r.count) || 0, revenue: parseFloat(r.revenue) || 0 }));
};

const getGSTComplianceStatus = async (brandId, agentId, startDate, endDate) => {
  const where = buildWhere(brandId, startDate, endDate);
  const complianceData = await SalesAmazon.findAll({
    attributes: ['irn_filing_status', [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']],
    where, group: ['irn_filing_status'], raw: true
  });
  const total = await SalesAmazon.count({ where });
  return {
    total_records: total,
    status_breakdown: complianceData.map(r => ({ status: r.irn_filing_status || 'NOT_FILED', count: parseInt(r.count) || 0, percentage: ((parseInt(r.count) / total) * 100).toFixed(2) }))
  };
};

const getMonthlyTrend = async (brandId, agentId, startDate, endDate) => {
  const where = buildWhere(brandId, startDate, endDate);
  const trendData = await SalesAmazon.findAll({
    attributes: [
      'year', 'month',
      [Sequelize.fn('SUM', Sequelize.col('final_amount_receivable')), 'revenue'],
      [Sequelize.fn('SUM', Sequelize.literal("CAST(final_cgst_tax AS DECIMAL) + CAST(final_sgst_tax AS DECIMAL) + CAST(final_igst_tax AS DECIMAL)")), 'tax'],
      [Sequelize.fn('COUNT', Sequelize.col('order_id')), 'transactions']
    ],
    where, group: ['year', 'month'], order: [['year', 'ASC'], ['month', 'ASC']], raw: true
  });
  return trendData.map(r => ({
    month: `${parseInt(r.year) || new Date().getFullYear()}-${String(parseInt(r.month) || 1).padStart(2, '0')}-01`,
    revenue: parseFloat(r.revenue) || 0, tax: parseFloat(r.tax) || 0, transactions: parseInt(r.transactions) || 0
  }));
};

const getDetailedTransactions = async (brandId, agentId, startDate, endDate, limit = 100, offset = 0, filters = {}) => {
  const where = buildWhere(brandId, startDate, endDate);
  if (filters.state) where.ship_to_state = filters.state;
  if (filters.sku) where.sku = filters.sku;
  if (filters.transaction_type) where.transaction_type = filters.transaction_type;
  const { count, rows } = await SalesAmazon.findAndCountAll({
    where,
    attributes: ['id', 'invoice_number', 'invoice_date', 'order_id', 'order_date', 'sku', 'asin', 'item_description', 'quantity', 'ship_to_state', 'transaction_type', 'final_amount_receivable', 'final_cgst_tax', 'final_sgst_tax', 'final_igst_tax', 'shipping_amount', 'item_promo_discount', 'year', 'month', 'created_at'],
    limit, offset, order: [['year', 'DESC'], ['month', 'DESC'], ['created_at', 'DESC']], raw: true
  });
  return { total: count, data: rows.map(r => ({ ...r, month_str: `${parseInt(r.year)}-${String(parseInt(r.month)).padStart(2, '0')}` })), page: Math.floor(offset / limit) + 1, limit };
};

const getRevenueMISReport = async (brandId, agentId, startDate, endDate, sku = null) => {
  const where = buildWhere(brandId, startDate, endDate);
  if (sku) where.sku = sku;
  const saleCondition = "transaction_type IN ('Sale', 'Shipment', 'Order') AND (credit_note_number IS NULL OR credit_note_number = '')";
  const returnCondition = "transaction_type IN ('Return', 'Refund', 'Cancel') OR (credit_note_number IS NOT NULL AND credit_note_number != '')";
  const misData = await SalesAmazon.findAll({
    attributes: [
      'year', 'month',
      [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.literal(`CASE WHEN ${saleCondition} THEN order_id END`))), 'orders_count'],
      [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN ${saleCondition} THEN CAST(quantity AS DECIMAL) ELSE 0 END`)), 'units_gross'],
      [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN ${returnCondition} THEN ABS(CAST(quantity AS DECIMAL)) ELSE 0 END`)), 'units_return'],
      [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN ${saleCondition} THEN CAST(invoice_amount AS DECIMAL) ELSE 0 END`)), 'sales_gross_inc_gst'],
      [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN ${saleCondition} THEN CAST(total_tax_amount AS DECIMAL) ELSE 0 END`)), 'sales_tax'],
      [Sequelize.fn('SUM', Sequelize.literal(`CASE WHEN ${returnCondition} THEN ABS(CAST(final_taxable_sales_value AS DECIMAL)) ELSE 0 END`)), 'returns_value']
    ],
    where, group: ['year', 'month'], order: [['year', 'ASC'], ['month', 'ASC']], raw: true
  });
  return misData.map(row => {
    const year = parseInt(row.year), month = parseInt(row.month);
    const ordersCount = parseInt(row.orders_count) || 0;
    const unitsGross = parseInt(row.units_gross) || 0;
    const salesGrossIncGst = Math.round(parseFloat(row.sales_gross_inc_gst) || 0);
    const salesTax = Math.round(parseFloat(row.sales_tax) || 0);
    const netSales = salesGrossIncGst - salesTax;
    const returnsValue = Math.round(parseFloat(row.returns_value) || 0);
    return {
      month_label: format(new Date(year, month - 1, 1), 'MMM-yy'), year, month,
      particulars: {
        orders: ordersCount,
        units: { gross: unitsGross, returns: parseInt(row.units_return) || 0, net: unitsGross - (parseInt(row.units_return) || 0) },
        sales: { gross_inc_gst: salesGrossIncGst, tax: salesTax, net_sales: netSales, returns: returnsValue, revenue_from_goods: netSales - returnsValue },
        aov: ordersCount > 0 ? Math.round(salesGrossIncGst / ordersCount) : 0
      }
    };
  });
};

const getAvailableFilters = async (brandId, agentId) => {
  const agent = await Agent.findByPk(agentId);
  const filterRows = await SalesAmazon.findAll({
    attributes: [
      [Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM invoice_date')), 'year'],
      [Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM invoice_date')), 'month']
    ],
    where: { brand_id: brandId, invoice_date: { [Op.not]: null } },
    group: [Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM invoice_date')), Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM invoice_date'))],
    order: [[Sequelize.fn('EXTRACT', Sequelize.literal('YEAR FROM invoice_date')), 'DESC'], [Sequelize.fn('EXTRACT', Sequelize.literal('MONTH FROM invoice_date')), 'DESC']],
    raw: true
  });
  const validFilters = filterRows.filter(r => r.year && r.month).map(r => {
    const y = parseInt(r.year), m = parseInt(r.month);
    return { year: y, month: m, label: format(new Date(y, m - 1, 1), 'MMM yyyy') };
  });
  return { agent_name: agent ? agent.name : 'Agent', filters: validFilters };
};

module.exports = {
  getSummaryMetrics, getStateWiseSales, getTopProducts, getTaxAnalysis,
  getRefundAnalysis, getDiscountAnalysis, getPaymentMethodAnalysis,
  getGSTComplianceStatus, getMonthlyTrend, getDetailedTransactions,
  getRevenueMISReport, getAvailableFilters
};
