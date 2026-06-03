'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invoices', {
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
      agent_id: {
        type: Sequelize.UUID,
        references: {
          model: 'agents',
          key: 'id',
        },
      },
      processed_on: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      company: { type: Sequelize.STRING },
      invoice_number: { type: Sequelize.STRING },
      invoice_date: { type: Sequelize.DATE },
      due_date: { type: Sequelize.DATE },
      seller_gstin: { type: Sequelize.STRING },
      buyer_gstin: { type: Sequelize.STRING },
      category: { type: Sequelize.STRING },
      product_name: { type: Sequelize.STRING },
      hsn_code: { type: Sequelize.STRING },
      quantity: { type: Sequelize.INTEGER },
      unit: { type: Sequelize.STRING },
      rate: { type: Sequelize.DECIMAL(15, 4) },
      cgst_rate: { type: Sequelize.DECIMAL(10, 4) },
      sgst_rate: { type: Sequelize.DECIMAL(10, 4) },
      igst_rate: { type: Sequelize.DECIMAL(10, 4) },
      cgst_amount: { type: Sequelize.DECIMAL(15, 4) },
      sgst_amount: { type: Sequelize.DECIMAL(15, 4) },
      igst_amount: { type: Sequelize.DECIMAL(15, 4) },
      gst_amount: { type: Sequelize.DECIMAL(15, 4) },
      taxable_value: { type: Sequelize.DECIMAL(15, 4) },
      invoice_link: { type: Sequelize.STRING },
      status: { type: Sequelize.STRING, defaultValue: 'Pending' },
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
    await queryInterface.dropTable('invoices');
  },
};
