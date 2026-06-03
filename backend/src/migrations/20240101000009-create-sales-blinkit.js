'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales_blinkit', {
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
      order_id: { type: Sequelize.STRING },
      order_date: { type: Sequelize.DATE },
      item_id: { type: Sequelize.STRING },
      product_name: { type: Sequelize.STRING },
      brand_name: { type: Sequelize.STRING },
      upc: { type: Sequelize.STRING },
      variant_description: { type: Sequelize.STRING },
      category_mapping: { type: Sequelize.STRING },
      business_category: { type: Sequelize.STRING },
      supply_city: { type: Sequelize.STRING },
      supply_state: { type: Sequelize.STRING },
      supply_state_gst: { type: Sequelize.STRING },
      customer_city: { type: Sequelize.STRING },
      customer_state: { type: Sequelize.STRING },
      order_status: { type: Sequelize.STRING },
      hsn_code: { type: Sequelize.STRING },
      igst_percent: { type: Sequelize.DECIMAL(10, 4) },
      cgst_percent: { type: Sequelize.DECIMAL(10, 4) },
      sgst_percent: { type: Sequelize.DECIMAL(10, 4) },
      cess_percent: { type: Sequelize.DECIMAL(10, 4) },
      quantity: { type: Sequelize.INTEGER },
      mrp: { type: Sequelize.DECIMAL(15, 4) },
      selling_price: { type: Sequelize.DECIMAL(15, 4) },
      igst_value: { type: Sequelize.DECIMAL(15, 4) },
      cgst_value: { type: Sequelize.DECIMAL(15, 4) },
      sgst_value: { type: Sequelize.DECIMAL(15, 4) },
      cess_value: { type: Sequelize.DECIMAL(15, 4) },
      total_tax: { type: Sequelize.DECIMAL(15, 4) },
      total_gross_bill_amount: { type: Sequelize.DECIMAL(15, 4) },
      gst_rate: { type: Sequelize.DECIMAL(10, 4) },
      taxable_value: { type: Sequelize.DECIMAL(15, 4) },
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
    await queryInterface.dropTable('sales_blinkit');
  },
};
