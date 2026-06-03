'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales_zepto', {
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
      sku_number: { type: Sequelize.STRING },
      sku_name: { type: Sequelize.STRING },
      ean: { type: Sequelize.STRING },
      sku_category: { type: Sequelize.STRING },
      sku_sub_category: { type: Sequelize.STRING },
      brand_name: { type: Sequelize.STRING },
      manufacturer_name: { type: Sequelize.STRING },
      manufacturer_id: { type: Sequelize.STRING },
      city: { type: Sequelize.STRING },
      sales_qty_units: { type: Sequelize.INTEGER },
      mrp: { type: Sequelize.DECIMAL(15, 4) },
      selling_price: { type: Sequelize.DECIMAL(15, 4) },
      gross_merchandise_value: { type: Sequelize.DECIMAL(15, 4) },
      gross_selling_value: { type: Sequelize.DECIMAL(15, 4) },
      pack_size: { type: Sequelize.INTEGER },
      unit_of_measure: { type: Sequelize.STRING },
      orders: { type: Sequelize.INTEGER },
      fg: { type: Sequelize.STRING },
      state: { type: Sequelize.STRING },
      tally_ledger: { type: Sequelize.STRING },
      invoice_number: { type: Sequelize.STRING },
      tax: { type: Sequelize.DECIMAL(15, 4) },
      taxable_value: { type: Sequelize.DECIMAL(15, 4) },
      igst: { type: Sequelize.DECIMAL(15, 4) },
      cgst: { type: Sequelize.DECIMAL(15, 4) },
      sgst: { type: Sequelize.DECIMAL(15, 4) },
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
    await queryInterface.dropTable('sales_zepto');
  },
};
