'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('settlement_amazon', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      brand_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'brands',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      date_time: { type: Sequelize.DATE },
      settlement_id: { type: Sequelize.STRING },
      type: { type: Sequelize.STRING },
      order_id: { type: Sequelize.STRING },
      sku: { type: Sequelize.STRING },
      description: { type: Sequelize.STRING },
      quantity: { type: Sequelize.INTEGER },
      marketplace: { type: Sequelize.STRING },
      account_type: { type: Sequelize.STRING },
      fulfillment: { type: Sequelize.STRING },
      order_city: { type: Sequelize.STRING },
      order_state: { type: Sequelize.STRING },
      order_postal: { type: Sequelize.STRING },
      product_sales: { type: Sequelize.DECIMAL(15, 4) },
      shipping_credits: { type: Sequelize.DECIMAL(15, 4) },
      gift_wrap_credits: { type: Sequelize.DECIMAL(15, 4) },
      promotional_rebates: { type: Sequelize.DECIMAL(15, 4) },
      gst_before_tcs: { type: Sequelize.DECIMAL(15, 4) },
      tcs_cgst: { type: Sequelize.DECIMAL(15, 4) },
      tcs_sgst: { type: Sequelize.DECIMAL(15, 4) },
      tcs_igst: { type: Sequelize.DECIMAL(15, 4) },
      tds_194o: { type: Sequelize.DECIMAL(15, 4) },
      selling_fees: { type: Sequelize.DECIMAL(15, 4) },
      fba_fees: { type: Sequelize.DECIMAL(15, 4) },
      other_transaction_fees: { type: Sequelize.DECIMAL(15, 4) },
      other: { type: Sequelize.DECIMAL(15, 4) },
      total: { type: Sequelize.DECIMAL(15, 4) },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      filename: { type: Sequelize.STRING },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('settlement_amazon');
  },
};
