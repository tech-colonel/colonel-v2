'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('brand_agents', {
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
        allowNull: false,
        references: {
          model: 'agents',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      sku_master: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      ledger_master: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    await queryInterface.addConstraint('brand_agents', {
      fields: ['brand_id', 'agent_id'],
      type: 'unique',
      name: 'brand_agents_brand_id_agent_id_unique',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('brand_agents');
  },
};
