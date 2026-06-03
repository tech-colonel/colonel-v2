const cfoAnalyticsService = require('../services/cfoAnalyticsService');
const { Agent } = require('../models');

const amazonController = {
  getSummary: async (req, res, next) => {
    try {
      const { brandId, agentId } = req.params;
      const { startDate, endDate } = req.query;
      const summary = await cfoAnalyticsService.getSummaryMetrics(brandId, agentId, startDate, endDate);
      res.json(summary);
    } catch (error) { next(error); }
  },

  getStateWiseSales: async (req, res, next) => {
    try {
      const { brandId, agentId } = req.params;
      const { startDate, endDate } = req.query;
      const stateData = await cfoAnalyticsService.getStateWiseSales(brandId, agentId, startDate, endDate);
      res.json(stateData);
    } catch (error) { next(error); }
  },

  getTopProducts: async (req, res, next) => {
    try {
      const { brandId, agentId } = req.params;
      const { startDate, endDate, limit = 10 } = req.query;
      const products = await cfoAnalyticsService.getTopProducts(brandId, agentId, startDate, endDate, parseInt(limit));
      res.json(products);
    } catch (error) { next(error); }
  },

  getTaxAnalysis: async (req, res, next) => {
    try {
      const { brandId, agentId } = req.params;
      const { startDate, endDate } = req.query;
      const taxData = await cfoAnalyticsService.getTaxAnalysis(brandId, agentId, startDate, endDate);
      res.json(taxData);
    } catch (error) { next(error); }
  },

  getRefundAnalysis: async (req, res, next) => {
    try {
      const { brandId, agentId } = req.params;
      const { startDate, endDate } = req.query;
      const refundData = await cfoAnalyticsService.getRefundAnalysis(brandId, agentId, startDate, endDate);
      res.json(refundData);
    } catch (error) { next(error); }
  },

  getDiscountAnalysis: async (req, res, next) => {
    try {
      const { brandId, agentId } = req.params;
      const { startDate, endDate } = req.query;
      const discountData = await cfoAnalyticsService.getDiscountAnalysis(brandId, agentId, startDate, endDate);
      res.json(discountData);
    } catch (error) { next(error); }
  },

  getPaymentMethods: async (req, res, next) => {
    try {
      const { brandId, agentId } = req.params;
      const { startDate, endDate } = req.query;
      const paymentData = await cfoAnalyticsService.getPaymentMethodAnalysis(brandId, agentId, startDate, endDate);
      res.json(paymentData);
    } catch (error) { next(error); }
  },

  getGSTCompliance: async (req, res, next) => {
    try {
      const { brandId, agentId } = req.params;
      const { startDate, endDate } = req.query;
      const complianceData = await cfoAnalyticsService.getGSTComplianceStatus(brandId, agentId, startDate, endDate);
      res.json(complianceData);
    } catch (error) { next(error); }
  },

  getMonthlyTrend: async (req, res, next) => {
    try {
      const { brandId, agentId } = req.params;
      const { startDate, endDate } = req.query;
      const trendData = await cfoAnalyticsService.getMonthlyTrend(brandId, agentId, startDate, endDate);
      res.json(trendData);
    } catch (error) { next(error); }
  },

  getDetailedTransactions: async (req, res, next) => {
    try {
      const { brandId, agentId } = req.params;
      const { startDate, endDate, limit = 100, offset = 0, state, sku, transaction_type } = req.query;
      const filters = {};
      if (state) filters.state = state;
      if (sku) filters.sku = sku;
      if (transaction_type) filters.transaction_type = transaction_type;
      const transactions = await cfoAnalyticsService.getDetailedTransactions(
        brandId, agentId, startDate, endDate, parseInt(limit), parseInt(offset), filters
      );
      res.json(transactions);
    } catch (error) { next(error); }
  },

  getDashboardSnapshot: async (req, res, next) => {
    try {
      const { brandId, agentId } = req.params;
      const { startDate, endDate } = req.query;

      const [
        summary, stateWiseSales, topProducts, taxAnalysis,
        refundAnalysis, discountAnalysis, paymentMethods, gstCompliance, monthlyTrend
      ] = await Promise.all([
        cfoAnalyticsService.getSummaryMetrics(brandId, agentId, startDate, endDate),
        cfoAnalyticsService.getStateWiseSales(brandId, agentId, startDate, endDate),
        cfoAnalyticsService.getTopProducts(brandId, agentId, startDate, endDate, 10),
        cfoAnalyticsService.getTaxAnalysis(brandId, agentId, startDate, endDate),
        cfoAnalyticsService.getRefundAnalysis(brandId, agentId, startDate, endDate),
        cfoAnalyticsService.getDiscountAnalysis(brandId, agentId, startDate, endDate),
        cfoAnalyticsService.getPaymentMethodAnalysis(brandId, agentId, startDate, endDate),
        cfoAnalyticsService.getGSTComplianceStatus(brandId, agentId, startDate, endDate),
        cfoAnalyticsService.getMonthlyTrend(brandId, agentId, startDate, endDate)
      ]);

      const agent = await Agent.findByPk(agentId);
      res.json({
        agentName: agent ? agent.name : 'Agent',
        summary, stateWiseSales, topProducts, taxAnalysis,
        refundAnalysis, discountAnalysis, paymentMethods, gstCompliance, monthlyTrend
      });
    } catch (error) { next(error); }
  },

  getRevenueMIS: async (req, res, next) => {
    try {
      const { brandId, agentId } = req.params;
      const { startDate, endDate, sku } = req.query;
      const misReport = await cfoAnalyticsService.getRevenueMISReport(brandId, agentId, startDate, endDate, sku);
      res.json(misReport);
    } catch (error) { next(error); }
  },

  getFilters: async (req, res, next) => {
    try {
      const { brandId, agentId } = req.params;
      const filters = await cfoAnalyticsService.getAvailableFilters(brandId, agentId);
      res.json(filters);
    } catch (error) { next(error); }
  }
};

module.exports = { amazonController };
