'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_cycle_shopify', {
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
      sale_order_number: { type: Sequelize.STRING },
      platform: { type: Sequelize.STRING },
      invoice_number: { type: Sequelize.STRING },
      awb_number: { type: Sequelize.STRING },
      shipping_partner: { type: Sequelize.STRING },
      dispatch_or_cancellation_date: { type: Sequelize.DATE },
      return_date: { type: Sequelize.DATE },
      total_amount: { type: Sequelize.DECIMAL(15, 4) },
      return_amount: { type: Sequelize.DECIMAL(15, 4) },
      net_amount: { type: Sequelize.DECIMAL(15, 4) },
      srn: { type: Sequelize.STRING },
      ekart_remittance_date: { type: Sequelize.DATE },
      ekart_actual_remittance_date: { type: Sequelize.DATE },
      ekart_cod_amount: { type: Sequelize.DECIMAL(15, 4) },
      delhivery_delivery_date: { type: Sequelize.DATE },
      delhivery_cod_amount: { type: Sequelize.DECIMAL(15, 4) },
      xpressbees_delivery_date: { type: Sequelize.DATE },
      xpressbees_transaction_date: { type: Sequelize.DATE },
      xpressbees_net_payment: { type: Sequelize.DECIMAL(15, 4) },
      snapmint_settlement_date: { type: Sequelize.DATE },
      snapmint_settlement_value: { type: Sequelize.DECIMAL(15, 4) },
      bharatx_settlement_timestamp: { type: Sequelize.DATE },
      bharatx_ledger_amount: { type: Sequelize.DECIMAL(15, 4) },
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
    await queryInterface.dropTable('order_cycle_shopify');
  },
};
