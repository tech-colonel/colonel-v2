const { Brand, Agent, SalesAmazon } = require('../../../models');
const { Op, Sequelize } = require('sequelize');

const monthMapping = {
    1: 'January', 2: 'February', 3: 'March', 4: 'April',
    5: 'May', 6: 'June', 7: 'July', 8: 'August',
    9: 'September', 10: 'October', 11: 'November', 12: 'December'
};

const generateAmazonMIS = async (req, res, next) => {
    try {
        const { brandId, agentId } = req.params;
        let { startMonth, endMonth, startYear, endYear, filterType } = req.body;

        startMonth = parseInt(startMonth);
        endMonth = parseInt(endMonth);
        startYear = parseInt(startYear);
        endYear = parseInt(endYear);

        if (!startMonth || !endMonth || !startYear || !endYear) {
            return res.status(400).json({ error: 'Start/End month and year are required' });
        }

        const brand = await Brand.findByPk(brandId);
        const agent = await Agent.findByPk(agentId);
        if (!brand || !agent) return res.status(404).json({ error: 'Brand or Agent not found' });

        const yyyyMmStart = startYear * 100 + startMonth;
        const yyyyMmEnd = endYear * 100 + endMonth;

        const whereConditions = [
            { brand_id: brandId },
            Sequelize.where(Sequelize.literal('("year" * 100 + "month")'), '>=', yyyyMmStart),
            Sequelize.where(Sequelize.literal('("year" * 100 + "month")'), '<=', yyyyMmEnd)
        ];

        if (filterType && filterType.toLowerCase() !== 'combine') {
            whereConditions.push({ file_type: { [Op.iLike]: filterType } });
        }

        const allRows = await SalesAmazon.findAll({ where: { [Op.and]: whereConditions } });

        const grouped = {};
        for (const row of allRows) {
            const m = row.month;
            const y = row.year;
            if (!m || !y) continue;

            const key = `${y}-${String(m).padStart(2, '0')}`;
            if (!grouped[key]) {
                grouped[key] = { year: y, month: m, monthName: `${monthMapping[m]} ${y}`, grossUnitsSold: 0, unitsRefund: 0, grossMarketValue: 0, taxes: 0, refund: 0 };
            }

            const data = row.dataValues;
            const q = Number(data.quantity) || 0;
            const invAmt = Number(data.invoice_amount) || 0;
            const taxAmt = Number(data.total_tax_amount) || 0;
            const taxExclGross = Number(data.tax_exclusive_gross) || 0;
            const transType = (data.transaction_type || '').toLowerCase().trim();

            if (transType === 'shipment') { grouped[key].grossUnitsSold += q; grouped[key].grossMarketValue += invAmt; }
            if (transType === 'refund') { grouped[key].unitsRefund += q; grouped[key].refund += taxExclGross; }
            grouped[key].taxes += taxAmt;
        }

        const sortedKeys = Object.keys(grouped).sort();
        sortedKeys.forEach(key => {
            const g = grouped[key];
            g.netUnitsSold = g.grossUnitsSold - g.unitsRefund;
            g.netSales = g.grossMarketValue - g.taxes;
            g.revenue = g.netSales - g.refund;
            g.aov = g.grossUnitsSold > 0 ? (g.grossMarketValue / g.grossUnitsSold) : 0;
            g.returnRate = g.netSales !== 0 ? ((g.refund / g.netSales) * 100).toFixed(2) + '%' : '0.00%';
        });

        const finalColumns = [{ key: 'metric', title: 'Metrics' }];
        sortedKeys.forEach(k => finalColumns.push({ key: k, title: grouped[k].monthName }));

        const metricsToDisplay = [
            { id: 'grossUnitsSold', title: 'Gross Units Sold' },
            { id: 'unitsRefund', title: 'Units Refund' },
            { id: 'netUnitsSold', title: 'Net Units Sold' },
            { id: 'grossMarketValue', title: 'Gross Market Value' },
            { id: 'taxes', title: 'Taxes' },
            { id: 'netSales', title: 'Net Sales' },
            { id: 'refund', title: 'Refund' },
            { id: 'revenue', title: 'Revenue from sales of goods' },
            { id: 'aov', title: 'Average Order Value' },
            { id: 'returnRate', title: 'Return Rate' },
        ];

        const finalData = metricsToDisplay.map(metric => {
            const row = { metric: metric.title };
            sortedKeys.forEach(k => { row[k] = grouped[k][metric.id]; });
            return row;
        });

        res.json({ success: true, columns: finalColumns, data: finalData });
    } catch (error) {
        console.error('MIS Error:', error);
        next(error);
    }
};

module.exports = { generateAmazonMIS };
