'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales_firstcry', {
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
      fc_ref_no: { type: Sequelize.STRING },
      order_id: { type: Sequelize.STRING },
      order_date: { type: Sequelize.DATE },
      shipping_date: { type: Sequelize.DATE },
      delivery_date: { type: Sequelize.DATE },
      sr_rto_date: { type: Sequelize.DATE },
      invoice_date: { type: Sequelize.DATE },
      product_id: { type: Sequelize.STRING },
      hsn_code: { type: Sequelize.STRING },
      product_name: { type: Sequelize.STRING },
      quantity: { type: Sequelize.INTEGER },
      mrp: { type: Sequelize.DECIMAL(15, 4) },
      base_cost: { type: Sequelize.DECIMAL(15, 4) },
      gross_amount: { type: Sequelize.DECIMAL(15, 4) },
      cgst_percent: { type: Sequelize.DECIMAL(10, 4) },
      cgst_amount: { type: Sequelize.DECIMAL(15, 4) },
      sgst_percent: { type: Sequelize.DECIMAL(10, 4) },
      sgst_amount: { type: Sequelize.DECIMAL(15, 4) },
      total_amount: { type: Sequelize.DECIMAL(15, 4) },
      vendor_invoice_no: { type: Sequelize.STRING },
      payment_advice_no: { type: Sequelize.STRING },
      debit_note_no: { type: Sequelize.STRING },
      sr_qty: { type: Sequelize.INTEGER },
      sr_total_amount: { type: Sequelize.DECIMAL(15, 4) },
      sr_gross_amount: { type: Sequelize.DECIMAL(15, 4) },
      rto_qty: { type: Sequelize.INTEGER },
      rto_total_amount: { type: Sequelize.DECIMAL(15, 4) },
      rto_gross_amount: { type: Sequelize.DECIMAL(15, 4) },
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
    await queryInterface.dropTable('sales_firstcry');
  },
};
