'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales_myntra', {
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
      month: { type: Sequelize.INTEGER },
      year: { type: Sequelize.INTEGER },
      filename: { type: Sequelize.STRING },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      date: { type: Sequelize.DATE },
      seller_gstin: { type: Sequelize.STRING },
      invoice_number: { type: Sequelize.STRING },
      debtor_ledger: { type: Sequelize.STRING },
      sku: { type: Sequelize.STRING },
      quantity: { type: Sequelize.INTEGER },
      shipping: { type: Sequelize.STRING },
      gst_rate: { type: Sequelize.DECIMAL(10, 4) },
      base_value: { type: Sequelize.DECIMAL(15, 4) },
      file_type: { type: Sequelize.STRING },
      igst_amount: { type: Sequelize.DECIMAL(15, 4) },
      cgst_amount: { type: Sequelize.DECIMAL(15, 4) },
      sgst_amount: { type: Sequelize.DECIMAL(15, 4) },
      invoice_amount: { type: Sequelize.DECIMAL(15, 4) },
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
    await queryInterface.dropTable('sales_myntra');
  },
};
