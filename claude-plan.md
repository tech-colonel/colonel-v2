# Colonel V2 — Architecture Plan

## Overview

Colonel V2 is a restructured version of colonel-emergent that replaces the per-brand database
architecture with a single shared PostgreSQL database. All tables exist in one DB; brand isolation
is achieved via `brand_id` foreign keys. Tables are created via Sequelize CLI migrations. Agents
are seeded through a dedicated `seed-agents/` folder. The UI and all business logic (two-phase
generation, SKU/Ledger masters, CFO analytics, invoice processing, settlement reports) remain
identical to colonel-emergent.

---

## Problem Being Solved

colonel-emergent creates a new PostgreSQL database for every brand:
- `colonel_nestroots`, `colonel_stroom`, `colonel_demo`, etc.
- Dynamic tables are spun up inside each brand DB at agent-assignment time.
- Master DB + N brand DBs = N+1 connections, N+1 migration surfaces.

Colonel V2 uses **one database** (`colonel_v2`) with `brand_id` on every table. This eliminates
`createBrandDatabase()`, `getBrandConnection()`, and `getDynamicModel()`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express 5.x |
| ORM | Sequelize 6.x + sequelize-cli |
| Database | PostgreSQL 14+ |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| File processing | exceljs, xlsx, xlsx-js-style, multer |
| Frontend | React 18 + React Router 6 |
| UI components | Radix UI + Tailwind CSS 3.x |
| Charts | recharts |
| HTTP client | axios |

---

## Project Location

```
F:\Colonel\colonel-automation\colonel-automation\colonel-v2\
```

---

## Complete Directory Structure

```
colonel-v2/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js               # Single Sequelize instance
│   │   ├── models/
│   │   │   ├── index.js                  # Loads all models + associations
│   │   │   ├── User.js
│   │   │   ├── Brand.js
│   │   │   ├── Agent.js
│   │   │   ├── BrandUser.js
│   │   │   ├── BrandAgent.js             # Assignment + master data (merged)
│   │   │   ├── SalesAmazon.js
│   │   │   ├── SalesFlipkart.js
│   │   │   ├── SalesMyntra.js
│   │   │   ├── SalesBlinkit.js
│   │   │   ├── SalesJiomart.js
│   │   │   ├── SalesFirstcry.js
│   │   │   ├── SalesZepto.js
│   │   │   ├── SalesNykaa.js
│   │   │   ├── SalesShopify.js
│   │   │   ├── SettlementAmazon.js
│   │   │   ├── OrderCycleShopify.js
│   │   │   └── Invoice.js
│   │   ├── migrations/
│   │   │   ├── 20240101000001-create-users.js
│   │   │   ├── 20240101000002-create-brands.js
│   │   │   ├── 20240101000003-create-agents.js
│   │   │   ├── 20240101000004-create-brand-users.js
│   │   │   ├── 20240101000005-create-brand-agents.js
│   │   │   ├── 20240101000006-create-sales-amazon.js
│   │   │   ├── 20240101000007-create-sales-flipkart.js
│   │   │   ├── 20240101000008-create-sales-myntra.js
│   │   │   ├── 20240101000009-create-sales-blinkit.js
│   │   │   ├── 20240101000010-create-sales-jiomart.js
│   │   │   ├── 20240101000011-create-sales-firstcry.js
│   │   │   ├── 20240101000012-create-sales-zepto.js
│   │   │   ├── 20240101000013-create-sales-nykaa.js
│   │   │   ├── 20240101000014-create-sales-shopify.js
│   │   │   ├── 20240101000015-create-settlement-amazon.js
│   │   │   ├── 20240101000016-create-order-cycle-shopify.js
│   │   │   └── 20240101000017-create-invoices.js
│   │   ├── seeders/
│   │   │   └── 20240101000001-admin-user.js
│   │   ├── seed-agents/
│   │   │   ├── 01-sales-amazon.js
│   │   │   ├── 02-sales-flipkart.js
│   │   │   ├── 03-sales-myntra.js
│   │   │   ├── 04-sales-blinkit.js
│   │   │   ├── 05-sales-jiomart.js
│   │   │   ├── 06-sales-firstcry.js
│   │   │   ├── 07-sales-zepto.js
│   │   │   ├── 08-sales-nykaa.js
│   │   │   ├── 09-sales-shopify.js
│   │   │   ├── 10-settlement-amazon.js
│   │   │   ├── 11-total-sales-analyzer.js
│   │   │   ├── 12-invoice-process.js
│   │   │   ├── 13-order-cycle-shopify.js
│   │   │   └── index.js                  # Runner: executes all seeders in order
│   │   ├── controllers/
│   │   │   ├── agents/
│   │   │   │   ├── sales-amazon/
│   │   │   │   │   └── salesAmazonController.js
│   │   │   │   ├── sales-flipkart/
│   │   │   │   │   └── salesFlipkartController.js
│   │   │   │   ├── sales-myntra/
│   │   │   │   │   └── salesMyntraController.js
│   │   │   │   ├── sales-blinkit/
│   │   │   │   │   └── salesBlinkitController.js
│   │   │   │   ├── sales-jiomart/
│   │   │   │   │   └── salesJiomartController.js
│   │   │   │   ├── sales-firstcry/
│   │   │   │   │   └── salesFirstcryController.js
│   │   │   │   ├── sales-zepto/
│   │   │   │   │   └── salesZeptoController.js
│   │   │   │   ├── sales-nykaa/
│   │   │   │   │   └── salesNykaaController.js
│   │   │   │   ├── sales-shopify/
│   │   │   │   │   └── salesShopifyController.js
│   │   │   │   ├── total-sales/
│   │   │   │   │   └── totalSalesController.js
│   │   │   │   ├── settlement-amazon/
│   │   │   │   │   └── settlementAmazonController.js
│   │   │   │   ├── invoice-process/
│   │   │   │   │   └── invoiceController.js
│   │   │   │   ├── order-cycle-shopify/
│   │   │   │   │   └── orderCycleShopifyController.js
│   │   │   │   └── common/
│   │   │   │       └── workingFilesController.js
│   │   │   ├── agentController.js
│   │   │   ├── authController.js
│   │   │   ├── brandController.js
│   │   │   ├── cfoAnalyticsController.js
│   │   │   ├── salesController.js
│   │   │   └── userController.js
│   │   ├── routes/
│   │   │   ├── agentRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── brandRoutes.js
│   │   │   ├── cfoAnalyticsRoutes.js
│   │   │   ├── invoiceRoutes.js
│   │   │   ├── orderCycleRoutes.js
│   │   │   ├── salesRoutes.js
│   │   │   ├── settlementRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── services/
│   │   │   ├── processors/
│   │   │   │   ├── amazon/
│   │   │   │   ├── blinkit/
│   │   │   │   ├── flipkart/
│   │   │   │   ├── jiomart/
│   │   │   │   ├── myntra/
│   │   │   │   ├── shopify/
│   │   │   │   └── zepto/
│   │   │   ├── salesService.js
│   │   │   ├── cfoAnalyticsService.js
│   │   │   └── pendingGenerationsStore.js
│   │   ├── utils/
│   │   │   ├── executionStore.js
│   │   │   └── invoiceEvents.js
│   │   ├── output/
│   │   └── app.js
│   ├── .sequelizerc
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ui/                       # All Radix UI components (unchanged)
    │   │   ├── layout/
    │   │   │   └── DashboardLayout.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── AgentsPage.jsx
    │   │   │   ├── AssignmentsPage.jsx
    │   │   │   ├── BrandOverviewPage.jsx
    │   │   │   └── BrandsPage.jsx
    │   │   ├── accountant/
    │   │   │   ├── AgentWorkspace.jsx
    │   │   │   ├── BrandAgentsInventory.jsx
    │   │   │   ├── BrandDashboard.jsx
    │   │   │   ├── BrandSelection.jsx
    │   │   │   ├── InvoiceAgentWorkspace.jsx
    │   │   │   ├── OrderCycleShopifyWorkspace.jsx
    │   │   │   ├── SettlementAmazonWorkspace.jsx
    │   │   │   └── TotalSalesAnalyzerModal.jsx
    │   │   └── cfo/
    │   │       ├── AmazonCFODashboard.jsx
    │   │       ├── BrandFinancialDetails.jsx
    │   │       └── CFODashboardLauncher.jsx
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── hooks/
    │   │   └── use-toast.js
    │   ├── lib/
    │   │   ├── api.js
    │   │   └── utils.js
    │   ├── App.js
    │   └── index.js
    ├── public/
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    └── craco.config.js
```

---

## Database Schema (Single DB: `colonel_v2`)

### Key Architectural Change
- colonel-emergent: `master DB` + `colonel_{brand}` DB per brand
- colonel-v2: Single `colonel_v2` DB, all tables, `brand_id` on every data table

### Tables Overview

| Table | Purpose |
|---|---|
| users | User accounts with roles |
| brands | Brand registry (no db_name field) |
| agents | Agent type definitions |
| brand_users | Users assigned to brands |
| brand_agents | Agent assignment + SKU/Ledger master data per brand |
| sales_amazon | Amazon sales records (with brand_id) |
| sales_flipkart | Flipkart sales records |
| sales_myntra | Myntra sales records |
| sales_blinkit | Blinkit sales records |
| sales_jiomart | JioMart sales records |
| sales_firstcry | FirstCry sales records |
| sales_zepto | Zepto sales records |
| sales_nykaa | Nykaa sales records |
| sales_shopify | Shopify sales records |
| settlement_amazon | Amazon settlement records |
| order_cycle_shopify | Shopify order cycle records |
| invoices | Processed invoices |

---

## Migration Specifications

### Migration 01 — users

```javascript
// 20240101000001-create-users.js
queryInterface.createTable('users', {
  id:        { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:      { type: DataTypes.STRING, allowNull: false },
  email:     { type: DataTypes.STRING, allowNull: false, unique: true },
  password:  { type: DataTypes.STRING, allowNull: false },
  role:      { type: DataTypes.ENUM('admin','accountant','brand_executive'), allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false },
})
```

### Migration 02 — brands

```javascript
// 20240101000002-create-brands.js
queryInterface.createTable('brands', {
  id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:        { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT },
  image_url:   { type: DataTypes.STRING },
  // NOTE: NO db_name column — this is the key change from colonel-emergent
  createdAt:   { type: DataTypes.DATE, allowNull: false },
  updatedAt:   { type: DataTypes.DATE, allowNull: false },
})
```

### Migration 03 — agents

```javascript
// 20240101000003-create-agents.js
queryInterface.createTable('agents', {
  id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:        { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT },
  columns:     { type: DataTypes.JSONB },
  // columns is kept for metadata / display purposes but does NOT drive table creation
  createdAt:   { type: DataTypes.DATE, allowNull: false },
  updatedAt:   { type: DataTypes.DATE, allowNull: false },
})
```

### Migration 04 — brand_users

```javascript
// 20240101000004-create-brand-users.js
queryInterface.createTable('brand_users', {
  id:        { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  brand_id:  { type: DataTypes.UUID, allowNull: false, references: { model: 'brands', key: 'id' }, onDelete: 'CASCADE' },
  user_id:   { type: DataTypes.UUID, allowNull: false, references: { model: 'users', key: 'id' }, onDelete: 'CASCADE' },
  createdAt: { type: DataTypes.DATE, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false },
})
// Unique constraint: brand_id + user_id
```

### Migration 05 — brand_agents

```javascript
// 20240101000005-create-brand-agents.js
// Merges colonel-emergent's master.brand_agents (junction) +
//   brand-DB.brand_agents (sku/ledger data) into one table.
queryInterface.createTable('brand_agents', {
  id:             { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  brand_id:       { type: DataTypes.UUID, allowNull: false, references: { model: 'brands', key: 'id' }, onDelete: 'CASCADE' },
  agent_id:       { type: DataTypes.UUID, allowNull: false, references: { model: 'agents', key: 'id' }, onDelete: 'CASCADE' },
  sku_master:     { type: DataTypes.JSONB, defaultValue: [] },
  ledger_master:  { type: DataTypes.JSONB, defaultValue: [] },
  createdAt:      { type: DataTypes.DATE, allowNull: false },
  updatedAt:      { type: DataTypes.DATE, allowNull: false },
})
// Unique constraint: brand_id + agent_id
```

### Migration 06 — sales_amazon

```javascript
queryInterface.createTable('sales_amazon', {
  id:                              { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  brand_id:                        { type: DataTypes.UUID, allowNull: false, references: { model: 'brands', key: 'id' }, onDelete: 'CASCADE' },
  month:                           { type: DataTypes.INTEGER },
  year:                            { type: DataTypes.INTEGER },
  inventory_type:                  { type: DataTypes.STRING },
  file_type:                       { type: DataTypes.STRING },
  filename:                        { type: DataTypes.STRING },
  created_at:                      { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  date:                            { type: DataTypes.DATE },
  seller_gstin:                    { type: DataTypes.STRING },
  invoice_number:                  { type: DataTypes.STRING },
  invoice_date:                    { type: DataTypes.DATE },
  transaction_type:                { type: DataTypes.STRING },
  order_id:                        { type: DataTypes.STRING },
  shipment_id:                     { type: DataTypes.STRING },
  shipment_date:                   { type: DataTypes.DATE },
  order_date:                      { type: DataTypes.DATE },
  shipment_item_id:                { type: DataTypes.STRING },
  quantity:                        { type: DataTypes.INTEGER },
  item_description:                { type: DataTypes.STRING },
  asin:                            { type: DataTypes.STRING },
  hsn_sac:                         { type: DataTypes.STRING },
  sku:                             { type: DataTypes.STRING },
  fg:                              { type: DataTypes.STRING },
  product_tax_code:                { type: DataTypes.STRING },
  bill_from_city:                  { type: DataTypes.STRING },
  bill_from_state:                 { type: DataTypes.STRING },
  bill_from_country:               { type: DataTypes.STRING },
  bill_from_postal_code:           { type: DataTypes.STRING },
  ship_from_city:                  { type: DataTypes.STRING },
  ship_from_state:                 { type: DataTypes.STRING },
  ship_from_country:               { type: DataTypes.STRING },
  ship_from_postal_code:           { type: DataTypes.STRING },
  ship_to_city:                    { type: DataTypes.STRING },
  ship_to_state:                   { type: DataTypes.STRING },
  ship_to_state_tally_ledger:      { type: DataTypes.STRING },
  final_invoice_number:            { type: DataTypes.STRING },
  ship_to_country:                 { type: DataTypes.STRING },
  ship_to_postal_code:             { type: DataTypes.STRING },
  invoice_amount:                  { type: DataTypes.DECIMAL(15,4) },
  tax_exclusive_gross:             { type: DataTypes.DECIMAL(15,4) },
  total_tax_amount:                { type: DataTypes.DECIMAL(15,4) },
  cgst_rate:                       { type: DataTypes.DECIMAL(10,4) },
  sgst_rate:                       { type: DataTypes.DECIMAL(10,4) },
  utgst_rate:                      { type: DataTypes.DECIMAL(10,4) },
  igst_rate:                       { type: DataTypes.DECIMAL(10,4) },
  compensatory_cess_rate:          { type: DataTypes.DECIMAL(10,4) },
  principal_amount:                { type: DataTypes.DECIMAL(15,4) },
  principal_amount_basis:          { type: DataTypes.DECIMAL(15,4) },
  cgst_tax:                        { type: DataTypes.DECIMAL(15,4) },
  sgst_tax:                        { type: DataTypes.DECIMAL(15,4) },
  utgst_tax:                       { type: DataTypes.DECIMAL(15,4) },
  igst_tax:                        { type: DataTypes.DECIMAL(15,4) },
  compensatory_cess_tax:           { type: DataTypes.DECIMAL(15,4) },
  final_tax_rate:                  { type: DataTypes.DECIMAL(10,4) },
  final_taxable_sales_value:       { type: DataTypes.DECIMAL(15,4) },
  final_taxable_shipping_value:    { type: DataTypes.DECIMAL(15,4) },
  final_cgst_tax:                  { type: DataTypes.DECIMAL(15,4) },
  final_sgst_tax:                  { type: DataTypes.DECIMAL(15,4) },
  final_igst_tax:                  { type: DataTypes.DECIMAL(15,4) },
  final_shipping_cgst_tax:         { type: DataTypes.DECIMAL(15,4) },
  final_shipping_sgst_tax:         { type: DataTypes.DECIMAL(15,4) },
  final_shipping_igst_tax:         { type: DataTypes.DECIMAL(15,4) },
  final_amount_receivable:         { type: DataTypes.DECIMAL(15,4) },
  shipping_amount:                 { type: DataTypes.DECIMAL(15,4) },
  shipping_amount_basis:           { type: DataTypes.DECIMAL(15,4) },
  shipping_cgst_tax:               { type: DataTypes.DECIMAL(15,4) },
  shipping_sgst_tax:               { type: DataTypes.DECIMAL(15,4) },
  shipping_utgst_tax:              { type: DataTypes.DECIMAL(15,4) },
  shipping_igst_tax:               { type: DataTypes.DECIMAL(15,4) },
  shipping_cess_tax:               { type: DataTypes.DECIMAL(15,4) },
  gift_wrap_amount:                { type: DataTypes.DECIMAL(15,4) },
  gift_wrap_amount_basis:          { type: DataTypes.DECIMAL(15,4) },
  gift_wrap_cgst_tax:              { type: DataTypes.DECIMAL(15,4) },
  gift_wrap_sgst_tax:              { type: DataTypes.DECIMAL(15,4) },
  gift_wrap_utgst_tax:             { type: DataTypes.DECIMAL(15,4) },
  gift_wrap_igst_tax:              { type: DataTypes.DECIMAL(15,4) },
  gift_wrap_compensatory_cess_tax: { type: DataTypes.DECIMAL(15,4) },
  item_promo_discount:             { type: DataTypes.DECIMAL(15,4) },
  item_promo_discount_basis:       { type: DataTypes.DECIMAL(15,4) },
  item_promo_tax:                  { type: DataTypes.DECIMAL(15,4) },
  shipping_promo_discount:         { type: DataTypes.DECIMAL(15,4) },
  shipping_promo_discount_basis:   { type: DataTypes.DECIMAL(15,4) },
  shipping_promo_tax:              { type: DataTypes.DECIMAL(15,4) },
  gift_wrap_promo_discount:        { type: DataTypes.DECIMAL(15,4) },
  gift_wrap_promo_discount_basis:  { type: DataTypes.DECIMAL(15,4) },
  gift_wrap_promo_tax:             { type: DataTypes.DECIMAL(15,4) },
  tcs_cgst_rate:                   { type: DataTypes.DECIMAL(10,4) },
  tcs_cgst_amount:                 { type: DataTypes.DECIMAL(15,4) },
  tcs_sgst_rate:                   { type: DataTypes.DECIMAL(10,4) },
  tcs_sgst_amount:                 { type: DataTypes.DECIMAL(15,4) },
  tcs_utgst_rate:                  { type: DataTypes.DECIMAL(10,4) },
  tcs_utgst_amount:                { type: DataTypes.DECIMAL(15,4) },
  tcs_igst_rate:                   { type: DataTypes.DECIMAL(10,4) },
  tcs_igst_amount:                 { type: DataTypes.DECIMAL(15,4) },
  warehouse_id:                    { type: DataTypes.STRING },
  fulfillment_channel:             { type: DataTypes.STRING },
  payment_method_code:             { type: DataTypes.STRING },
  bill_to_city:                    { type: DataTypes.STRING },
  bill_to_state:                   { type: DataTypes.STRING },
  bill_to_country:                 { type: DataTypes.STRING },
  bill_to_postal_code:             { type: DataTypes.STRING },
  customer_bill_to_gstin:          { type: DataTypes.STRING },
  customer_ship_to_gstin:          { type: DataTypes.STRING },
  buyer_name:                      { type: DataTypes.STRING },
  credit_note_number:              { type: DataTypes.STRING },
  credit_note_date:                { type: DataTypes.DATE },
  irn_number:                      { type: DataTypes.STRING },
  irn_filing_status:               { type: DataTypes.STRING },
  irn_date:                        { type: DataTypes.DATE },
  irn_error_code:                  { type: DataTypes.STRING },
  createdAt:                       { type: DataTypes.DATE, allowNull: false },
  updatedAt:                       { type: DataTypes.DATE, allowNull: false },
})
```

### Migration 07 — sales_flipkart

```javascript
queryInterface.createTable('sales_flipkart', {
  id:                        { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  brand_id:                  { type: DataTypes.UUID, allowNull: false, references: { model: 'brands', key: 'id' }, onDelete: 'CASCADE' },
  month:                     { type: DataTypes.INTEGER },
  year:                      { type: DataTypes.INTEGER },
  inventory_type:            { type: DataTypes.STRING },
  filename:                  { type: DataTypes.STRING },
  created_at:                { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  date:                      { type: DataTypes.DATE },
  seller_gstin:              { type: DataTypes.STRING },
  seller_state:              { type: DataTypes.STRING },
  order_id:                  { type: DataTypes.STRING },
  order_item_id:             { type: DataTypes.STRING },
  order_type:                { type: DataTypes.STRING },
  event_type:                { type: DataTypes.STRING },
  event_sub_type:            { type: DataTypes.STRING },
  order_date:                { type: DataTypes.DATE },
  order_approval_date:       { type: DataTypes.DATE },
  sku:                       { type: DataTypes.STRING },
  fg:                        { type: DataTypes.STRING },
  fsn:                       { type: DataTypes.STRING },
  item_description:          { type: DataTypes.STRING },
  hsn_code:                  { type: DataTypes.STRING },
  quantity:                  { type: DataTypes.INTEGER },
  fulfilment_type:           { type: DataTypes.STRING },
  warehouse_id:              { type: DataTypes.STRING },
  ship_from_state:           { type: DataTypes.STRING },
  price_before_discount:     { type: DataTypes.DECIMAL(15,4) },
  total_discount:            { type: DataTypes.DECIMAL(15,4) },
  price_after_discount:      { type: DataTypes.DECIMAL(15,4) },
  shipping_charges:          { type: DataTypes.DECIMAL(15,4) },
  final_taxable_sales_value: { type: DataTypes.DECIMAL(15,4) },
  final_shipping_taxable_value: { type: DataTypes.DECIMAL(15,4) },
  final_invoice_amount:      { type: DataTypes.DECIMAL(15,4) },
  gst_rate:                  { type: DataTypes.DECIMAL(10,4) },
  cgst_rate:                 { type: DataTypes.DECIMAL(10,4) },
  sgst_rate:                 { type: DataTypes.DECIMAL(10,4) },
  igst_rate:                 { type: DataTypes.DECIMAL(10,4) },
  cgst_amount:               { type: DataTypes.DECIMAL(15,4) },
  sgst_amount:               { type: DataTypes.DECIMAL(15,4) },
  igst_amount:               { type: DataTypes.DECIMAL(15,4) },
  final_cgst_tax:            { type: DataTypes.DECIMAL(15,4) },
  final_sgst_tax:            { type: DataTypes.DECIMAL(15,4) },
  final_igst_tax:            { type: DataTypes.DECIMAL(15,4) },
  shipping_cgst_tax:         { type: DataTypes.DECIMAL(15,4) },
  shipping_sgst_tax:         { type: DataTypes.DECIMAL(15,4) },
  shipping_igst_tax:         { type: DataTypes.DECIMAL(15,4) },
  tcs_igst_amount:           { type: DataTypes.DECIMAL(15,4) },
  tcs_cgst_amount:           { type: DataTypes.DECIMAL(15,4) },
  tcs_sgst_amount:           { type: DataTypes.DECIMAL(15,4) },
  total_tcs:                 { type: DataTypes.DECIMAL(15,4) },
  tds_rate:                  { type: DataTypes.DECIMAL(10,4) },
  tds_amount:                { type: DataTypes.DECIMAL(15,4) },
  buyer_invoice_id:          { type: DataTypes.STRING },
  buyer_invoice_date:        { type: DataTypes.DATE },
  buyer_invoice_amount:      { type: DataTypes.DECIMAL(15,4) },
  final_invoice_number:      { type: DataTypes.STRING },
  billing_state:             { type: DataTypes.STRING },
  billing_pincode:           { type: DataTypes.STRING },
  shipping_state:            { type: DataTypes.STRING },
  shipping_pincode:          { type: DataTypes.STRING },
  business_name:             { type: DataTypes.STRING },
  business_gstin:            { type: DataTypes.STRING },
  is_shopsy_order:           { type: DataTypes.BOOLEAN },
  tally_ledger:              { type: DataTypes.STRING },
  imei:                      { type: DataTypes.STRING },
  createdAt:                 { type: DataTypes.DATE, allowNull: false },
  updatedAt:                 { type: DataTypes.DATE, allowNull: false },
})
```

### Migration 08 — sales_myntra

```javascript
queryInterface.createTable('sales_myntra', {
  id:             { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  brand_id:       { type: DataTypes.UUID, allowNull: false, references: { model: 'brands', key: 'id' }, onDelete: 'CASCADE' },
  month:          { type: DataTypes.INTEGER },
  year:           { type: DataTypes.INTEGER },
  filename:       { type: DataTypes.STRING },
  created_at:     { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  date:           { type: DataTypes.DATE },
  seller_gstin:   { type: DataTypes.STRING },
  invoice_number: { type: DataTypes.STRING },
  debtor_ledger:  { type: DataTypes.STRING },
  sku:            { type: DataTypes.STRING },
  quantity:       { type: DataTypes.INTEGER },
  shipping:       { type: DataTypes.STRING },
  gst_rate:       { type: DataTypes.DECIMAL(10,4) },
  base_value:     { type: DataTypes.DECIMAL(15,4) },
  file_type:      { type: DataTypes.STRING },
  igst_amount:    { type: DataTypes.DECIMAL(15,4) },
  cgst_amount:    { type: DataTypes.DECIMAL(15,4) },
  sgst_amount:    { type: DataTypes.DECIMAL(15,4) },
  invoice_amount: { type: DataTypes.DECIMAL(15,4) },
  createdAt:      { type: DataTypes.DATE, allowNull: false },
  updatedAt:      { type: DataTypes.DATE, allowNull: false },
})
```

### Migration 09 — sales_blinkit

```javascript
queryInterface.createTable('sales_blinkit', {
  id:                     { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  brand_id:               { type: DataTypes.UUID, allowNull: false, references: { model: 'brands', key: 'id' }, onDelete: 'CASCADE' },
  month:                  { type: DataTypes.INTEGER },
  year:                   { type: DataTypes.INTEGER },
  filename:               { type: DataTypes.STRING },
  created_at:             { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  order_id:               { type: DataTypes.STRING },
  order_date:             { type: DataTypes.DATE },
  item_id:                { type: DataTypes.STRING },
  product_name:           { type: DataTypes.STRING },
  brand_name:             { type: DataTypes.STRING },
  upc:                    { type: DataTypes.STRING },
  variant_description:    { type: DataTypes.STRING },
  category_mapping:       { type: DataTypes.STRING },
  business_category:      { type: DataTypes.STRING },
  supply_city:            { type: DataTypes.STRING },
  supply_state:           { type: DataTypes.STRING },
  supply_state_gst:       { type: DataTypes.STRING },
  customer_city:          { type: DataTypes.STRING },
  customer_state:         { type: DataTypes.STRING },
  order_status:           { type: DataTypes.STRING },
  hsn_code:               { type: DataTypes.STRING },
  igst_percent:           { type: DataTypes.DECIMAL(10,4) },
  cgst_percent:           { type: DataTypes.DECIMAL(10,4) },
  sgst_percent:           { type: DataTypes.DECIMAL(10,4) },
  cess_percent:           { type: DataTypes.DECIMAL(10,4) },
  quantity:               { type: DataTypes.INTEGER },
  mrp:                    { type: DataTypes.DECIMAL(15,4) },
  selling_price:          { type: DataTypes.DECIMAL(15,4) },
  igst_value:             { type: DataTypes.DECIMAL(15,4) },
  cgst_value:             { type: DataTypes.DECIMAL(15,4) },
  sgst_value:             { type: DataTypes.DECIMAL(15,4) },
  cess_value:             { type: DataTypes.DECIMAL(15,4) },
  total_tax:              { type: DataTypes.DECIMAL(15,4) },
  total_gross_bill_amount:{ type: DataTypes.DECIMAL(15,4) },
  gst_rate:               { type: DataTypes.DECIMAL(10,4) },
  taxable_value:          { type: DataTypes.DECIMAL(15,4) },
  createdAt:              { type: DataTypes.DATE, allowNull: false },
  updatedAt:              { type: DataTypes.DATE, allowNull: false },
})
```

### Migration 10 — sales_jiomart

```javascript
queryInterface.createTable('sales_jiomart', {
  id:                      { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  brand_id:                { type: DataTypes.UUID, allowNull: false, references: { model: 'brands', key: 'id' }, onDelete: 'CASCADE' },
  month:                   { type: DataTypes.INTEGER },
  year:                    { type: DataTypes.INTEGER },
  filename:                { type: DataTypes.STRING },
  created_at:              { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  seller_gstin:            { type: DataTypes.STRING },
  order_id:                { type: DataTypes.STRING },
  order_item_id:           { type: DataTypes.STRING },
  order_type:              { type: DataTypes.STRING },
  order_date:              { type: DataTypes.DATE },
  order_approval_date:     { type: DataTypes.DATE },
  type:                    { type: DataTypes.STRING },
  shipment_number:         { type: DataTypes.STRING },
  original_shipment_number:{ type: DataTypes.STRING },
  fulfillment_type:        { type: DataTypes.STRING },
  fulfiller_name:          { type: DataTypes.STRING },
  product_name:            { type: DataTypes.STRING },
  product_id:              { type: DataTypes.STRING },
  sku:                     { type: DataTypes.STRING },
  fg:                      { type: DataTypes.STRING },
  hsn_code:                { type: DataTypes.STRING },
  order_status:            { type: DataTypes.STRING },
  event_type:              { type: DataTypes.STRING },
  event_sub_type:          { type: DataTypes.STRING },
  quantity:                { type: DataTypes.INTEGER },
  buyer_invoice_id:        { type: DataTypes.STRING },
  original_invoice_id:     { type: DataTypes.STRING },
  buyer_invoice_date:      { type: DataTypes.DATE },
  tcs_date:                { type: DataTypes.DATE },
  buyer_invoice_amount:    { type: DataTypes.DECIMAL(15,4) },
  shipped_from_state:      { type: DataTypes.STRING },
  billed_from_state:       { type: DataTypes.STRING },
  billing_pincode:         { type: DataTypes.STRING },
  billing_state:           { type: DataTypes.STRING },
  delivery_pincode:        { type: DataTypes.STRING },
  delivery_state:          { type: DataTypes.STRING },
  seller_coupon_code:      { type: DataTypes.STRING },
  offer_price:             { type: DataTypes.DECIMAL(15,4) },
  seller_coupon_amount:    { type: DataTypes.DECIMAL(15,4) },
  final_invoice_amount:    { type: DataTypes.DECIMAL(15,4) },
  tax_type:                { type: DataTypes.STRING },
  taxable_value:           { type: DataTypes.DECIMAL(15,4) },
  igst_rate:               { type: DataTypes.DECIMAL(10,4) },
  igst_amount:             { type: DataTypes.DECIMAL(15,4) },
  cgst_rate:               { type: DataTypes.DECIMAL(10,4) },
  cgst_amount:             { type: DataTypes.DECIMAL(15,4) },
  sgst_rate:               { type: DataTypes.DECIMAL(10,4) },
  sgst_amount:             { type: DataTypes.DECIMAL(15,4) },
  tcs_igst_rate:           { type: DataTypes.DECIMAL(10,4) },
  tcs_igst_amount:         { type: DataTypes.DECIMAL(15,4) },
  tcs_cgst_rate:           { type: DataTypes.DECIMAL(10,4) },
  tcs_cgst_amount:         { type: DataTypes.DECIMAL(15,4) },
  tcs_sgst_rate:           { type: DataTypes.DECIMAL(10,4) },
  tcs_sgst_amount:         { type: DataTypes.DECIMAL(15,4) },
  total_tcs_deducted:      { type: DataTypes.DECIMAL(15,4) },
  tds_rate:                { type: DataTypes.DECIMAL(10,4) },
  tds_amount:              { type: DataTypes.DECIMAL(15,4) },
  final_gst_rate:          { type: DataTypes.DECIMAL(10,4) },
  createdAt:               { type: DataTypes.DATE, allowNull: false },
  updatedAt:               { type: DataTypes.DATE, allowNull: false },
})
```

### Migration 11 — sales_firstcry

```javascript
queryInterface.createTable('sales_firstcry', {
  id:                  { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  brand_id:            { type: DataTypes.UUID, allowNull: false, references: { model: 'brands', key: 'id' }, onDelete: 'CASCADE' },
  month:               { type: DataTypes.INTEGER },
  year:                { type: DataTypes.INTEGER },
  filename:            { type: DataTypes.STRING },
  created_at:          { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  fc_ref_no:           { type: DataTypes.STRING },
  order_id:            { type: DataTypes.STRING },
  order_date:          { type: DataTypes.DATE },
  shipping_date:       { type: DataTypes.DATE },
  delivery_date:       { type: DataTypes.DATE },
  sr_rto_date:         { type: DataTypes.DATE },
  invoice_date:        { type: DataTypes.DATE },
  product_id:          { type: DataTypes.STRING },
  hsn_code:            { type: DataTypes.STRING },
  product_name:        { type: DataTypes.STRING },
  quantity:            { type: DataTypes.INTEGER },
  mrp:                 { type: DataTypes.DECIMAL(15,4) },
  base_cost:           { type: DataTypes.DECIMAL(15,4) },
  gross_amount:        { type: DataTypes.DECIMAL(15,4) },
  cgst_percent:        { type: DataTypes.DECIMAL(10,4) },
  cgst_amount:         { type: DataTypes.DECIMAL(15,4) },
  sgst_percent:        { type: DataTypes.DECIMAL(10,4) },
  sgst_amount:         { type: DataTypes.DECIMAL(15,4) },
  total_amount:        { type: DataTypes.DECIMAL(15,4) },
  vendor_invoice_no:   { type: DataTypes.STRING },
  payment_advice_no:   { type: DataTypes.STRING },
  debit_note_no:       { type: DataTypes.STRING },
  sr_qty:              { type: DataTypes.INTEGER },
  sr_total_amount:     { type: DataTypes.DECIMAL(15,4) },
  sr_gross_amount:     { type: DataTypes.DECIMAL(15,4) },
  rto_qty:             { type: DataTypes.INTEGER },
  rto_total_amount:    { type: DataTypes.DECIMAL(15,4) },
  rto_gross_amount:    { type: DataTypes.DECIMAL(15,4) },
  createdAt:           { type: DataTypes.DATE, allowNull: false },
  updatedAt:           { type: DataTypes.DATE, allowNull: false },
})
```

### Migration 12 — sales_zepto

```javascript
queryInterface.createTable('sales_zepto', {
  id:                     { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  brand_id:               { type: DataTypes.UUID, allowNull: false, references: { model: 'brands', key: 'id' }, onDelete: 'CASCADE' },
  month:                  { type: DataTypes.INTEGER },
  year:                   { type: DataTypes.INTEGER },
  filename:               { type: DataTypes.STRING },
  created_at:             { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  date:                   { type: DataTypes.DATE },
  sku_number:             { type: DataTypes.STRING },
  sku_name:               { type: DataTypes.STRING },
  ean:                    { type: DataTypes.STRING },
  sku_category:           { type: DataTypes.STRING },
  sku_sub_category:       { type: DataTypes.STRING },
  brand_name:             { type: DataTypes.STRING },
  manufacturer_name:      { type: DataTypes.STRING },
  manufacturer_id:        { type: DataTypes.STRING },
  city:                   { type: DataTypes.STRING },
  sales_qty_units:        { type: DataTypes.INTEGER },
  mrp:                    { type: DataTypes.DECIMAL(15,4) },
  selling_price:          { type: DataTypes.DECIMAL(15,4) },
  gross_merchandise_value:{ type: DataTypes.DECIMAL(15,4) },
  gross_selling_value:    { type: DataTypes.DECIMAL(15,4) },
  pack_size:              { type: DataTypes.INTEGER },
  unit_of_measure:        { type: DataTypes.STRING },
  orders:                 { type: DataTypes.INTEGER },
  fg:                     { type: DataTypes.STRING },
  state:                  { type: DataTypes.STRING },
  tally_ledger:           { type: DataTypes.STRING },
  invoice_number:         { type: DataTypes.STRING },
  tax:                    { type: DataTypes.DECIMAL(15,4) },
  taxable_value:          { type: DataTypes.DECIMAL(15,4) },
  igst:                   { type: DataTypes.DECIMAL(15,4) },
  cgst:                   { type: DataTypes.DECIMAL(15,4) },
  sgst:                   { type: DataTypes.DECIMAL(15,4) },
  createdAt:              { type: DataTypes.DATE, allowNull: false },
  updatedAt:              { type: DataTypes.DATE, allowNull: false },
})
```

### Migration 13 — sales_nykaa

```javascript
queryInterface.createTable('sales_nykaa', {
  id:                    { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  brand_id:              { type: DataTypes.UUID, allowNull: false, references: { model: 'brands', key: 'id' }, onDelete: 'CASCADE' },
  month:                 { type: DataTypes.DECIMAL(10,4) },
  filename:              { type: DataTypes.STRING },
  created_at:            { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  period:                { type: DataTypes.STRING },
  parent_vendor_code:    { type: DataTypes.STRING },
  parent_vendor_name:    { type: DataTypes.STRING },
  common_name:           { type: DataTypes.STRING },
  other_name:            { type: DataTypes.STRING },
  nykaa_orderno:         { type: DataTypes.STRING },
  externorderno:         { type: DataTypes.STRING },
  eretail_orderno:       { type: DataTypes.STRING },
  product_sku:           { type: DataTypes.STRING },
  product_name:          { type: DataTypes.TEXT },
  brand:                 { type: DataTypes.STRING },
  hsn_code:              { type: DataTypes.STRING },
  mrp_per_unit:          { type: DataTypes.DECIMAL(15,4) },
  dp_per_unit:           { type: DataTypes.DECIMAL(15,4) },
  sp_per_unit:           { type: DataTypes.DECIMAL(15,4) },
  dp_per_unit_brand:     { type: DataTypes.DECIMAL(15,4) },
  dp_nykaa_funded:       { type: DataTypes.DECIMAL(15,4) },
  dp_brand_funded:       { type: DataTypes.DECIMAL(15,4) },
  sp_coupon_nykaa_funded:{ type: DataTypes.DECIMAL(15,4) },
  sp_brand_funded:       { type: DataTypes.DECIMAL(15,4) },
  nsv_net_sale_value:    { type: DataTypes.DECIMAL(15,4) },
  taxable_amount:        { type: DataTypes.DECIMAL(15,4) },
  base_value:            { type: DataTypes.DECIMAL(15,4) },
  tax_amount:            { type: DataTypes.DECIMAL(15,4) },
  tax_percent:           { type: DataTypes.DECIMAL(10,4) },
  cgst:                  { type: DataTypes.DECIMAL(15,4) },
  sgst:                  { type: DataTypes.DECIMAL(15,4) },
  ugst:                  { type: DataTypes.DECIMAL(15,4) },
  igst:                  { type: DataTypes.DECIMAL(15,4) },
  order_shipping_city:   { type: DataTypes.STRING },
  order_shipping_state:  { type: DataTypes.STRING },
  order_type:            { type: DataTypes.STRING },
  child_vendor_gst:      { type: DataTypes.STRING },
  invoiceno:             { type: DataTypes.STRING },
  tracking_no:           { type: DataTypes.STRING },
  return_awb:            { type: DataTypes.STRING },
  order_date:            { type: DataTypes.DATE },
  ship_date:             { type: DataTypes.DATE },
  delivery_date:         { type: DataTypes.DATE },
  quantity:              { type: DataTypes.DECIMAL(15,4) },
  rule_name:             { type: DataTypes.STRING },
  yes_or_no:             { type: DataTypes.STRING },
  countif:               { type: DataTypes.DECIMAL(15,4) },
  tcs:                   { type: DataTypes.DECIMAL(15,4) },
  final_status:          { type: DataTypes.STRING },
  previous_final_status: { type: DataTypes.STRING },
  createdAt:             { type: DataTypes.DATE, allowNull: false },
  updatedAt:             { type: DataTypes.DATE, allowNull: false },
})
```

### Migration 14 — sales_shopify

```javascript
queryInterface.createTable('sales_shopify', {
  id:                         { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  brand_id:                   { type: DataTypes.UUID, allowNull: false, references: { model: 'brands', key: 'id' }, onDelete: 'CASCADE' },
  month:                      { type: DataTypes.INTEGER },
  year:                       { type: DataTypes.INTEGER },
  filename:                   { type: DataTypes.STRING },
  created_at:                 { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  date:                       { type: DataTypes.DATE },
  day:                        { type: DataTypes.DATE },
  sales:                      { type: DataTypes.STRING },
  product_variant_sku:        { type: DataTypes.STRING },
  fg:                         { type: DataTypes.STRING },
  product_variant_id:         { type: DataTypes.STRING },
  product_variant_title:      { type: DataTypes.STRING },
  shipping_region:            { type: DataTypes.STRING },
  billing_region:             { type: DataTypes.STRING },
  tally_ledger:               { type: DataTypes.STRING },
  sales_ledger:               { type: DataTypes.STRING },
  invoice_number:             { type: DataTypes.STRING },
  customer_name:              { type: DataTypes.STRING },
  order_fulfillment_status:   { type: DataTypes.STRING },
  product_id:                 { type: DataTypes.STRING },
  product_title:              { type: DataTypes.STRING },
  order_id:                   { type: DataTypes.STRING },
  billing_city:               { type: DataTypes.STRING },
  shipping_city:              { type: DataTypes.STRING },
  gross_sales:                { type: DataTypes.DECIMAL(15,4) },
  discounts:                  { type: DataTypes.DECIMAL(15,4) },
  returns:                    { type: DataTypes.DECIMAL(15,4) },
  net_sales:                  { type: DataTypes.DECIMAL(15,4) },
  shipping_charges:           { type: DataTypes.DECIMAL(15,4) },
  return_fees:                { type: DataTypes.DECIMAL(15,4) },
  taxes:                      { type: DataTypes.DECIMAL(15,4) },
  total_sales:                { type: DataTypes.DECIMAL(15,4) },
  quantity_returned:          { type: DataTypes.INTEGER },
  quantity_ordered:           { type: DataTypes.INTEGER },
  quantity_ordered_per_order: { type: DataTypes.INTEGER },
  final_qty:                  { type: DataTypes.INTEGER },
  gst_rate:                   { type: DataTypes.DECIMAL(10,4) },
  taxable_value:              { type: DataTypes.DECIMAL(15,4) },
  igst:                       { type: DataTypes.DECIMAL(15,4) },
  cgst:                       { type: DataTypes.DECIMAL(15,4) },
  sgst:                       { type: DataTypes.DECIMAL(15,4) },
  createdAt:                  { type: DataTypes.DATE, allowNull: false },
  updatedAt:                  { type: DataTypes.DATE, allowNull: false },
})
```

### Migration 15 — settlement_amazon

```javascript
queryInterface.createTable('settlement_amazon', {
  id:                    { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  brand_id:              { type: DataTypes.UUID, allowNull: false, references: { model: 'brands', key: 'id' }, onDelete: 'CASCADE' },
  date_time:             { type: DataTypes.DATE },
  settlement_id:         { type: DataTypes.STRING },
  type:                  { type: DataTypes.STRING },
  order_id:              { type: DataTypes.STRING },
  sku:                   { type: DataTypes.STRING },
  description:           { type: DataTypes.STRING },
  quantity:              { type: DataTypes.INTEGER },
  marketplace:           { type: DataTypes.STRING },
  account_type:          { type: DataTypes.STRING },
  fulfillment:           { type: DataTypes.STRING },
  order_city:            { type: DataTypes.STRING },
  order_state:           { type: DataTypes.STRING },
  order_postal:          { type: DataTypes.STRING },
  product_sales:         { type: DataTypes.DECIMAL(15,4) },
  shipping_credits:      { type: DataTypes.DECIMAL(15,4) },
  gift_wrap_credits:     { type: DataTypes.DECIMAL(15,4) },
  promotional_rebates:   { type: DataTypes.DECIMAL(15,4) },
  gst_before_tcs:        { type: DataTypes.DECIMAL(15,4) },
  tcs_cgst:              { type: DataTypes.DECIMAL(15,4) },
  tcs_sgst:              { type: DataTypes.DECIMAL(15,4) },
  tcs_igst:              { type: DataTypes.DECIMAL(15,4) },
  tds_194o:              { type: DataTypes.DECIMAL(15,4) },
  selling_fees:          { type: DataTypes.DECIMAL(15,4) },
  fba_fees:              { type: DataTypes.DECIMAL(15,4) },
  other_transaction_fees:{ type: DataTypes.DECIMAL(15,4) },
  other:                 { type: DataTypes.DECIMAL(15,4) },
  total:                 { type: DataTypes.DECIMAL(15,4) },
  created_at:            { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  filename:              { type: DataTypes.STRING },
  createdAt:             { type: DataTypes.DATE, allowNull: false },
  updatedAt:             { type: DataTypes.DATE, allowNull: false },
})
```

### Migration 16 — order_cycle_shopify

```javascript
queryInterface.createTable('order_cycle_shopify', {
  id:                              { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  brand_id:                        { type: DataTypes.UUID, allowNull: false, references: { model: 'brands', key: 'id' }, onDelete: 'CASCADE' },
  month:                           { type: DataTypes.INTEGER },
  year:                            { type: DataTypes.INTEGER },
  filename:                        { type: DataTypes.STRING },
  created_at:                      { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  date:                            { type: DataTypes.DATE },
  sale_order_number:               { type: DataTypes.STRING },
  platform:                        { type: DataTypes.STRING },
  invoice_number:                  { type: DataTypes.STRING },
  awb_number:                      { type: DataTypes.STRING },
  shipping_partner:                { type: DataTypes.STRING },
  dispatch_or_cancellation_date:   { type: DataTypes.DATE },
  return_date:                     { type: DataTypes.DATE },
  total_amount:                    { type: DataTypes.DECIMAL(15,4) },
  return_amount:                   { type: DataTypes.DECIMAL(15,4) },
  net_amount:                      { type: DataTypes.DECIMAL(15,4) },
  srn:                             { type: DataTypes.STRING },
  ekart_remittance_date:           { type: DataTypes.DATE },
  ekart_actual_remittance_date:    { type: DataTypes.DATE },
  ekart_cod_amount:                { type: DataTypes.DECIMAL(15,4) },
  delhivery_delivery_date:         { type: DataTypes.DATE },
  delhivery_cod_amount:            { type: DataTypes.DECIMAL(15,4) },
  xpressbees_delivery_date:        { type: DataTypes.DATE },
  xpressbees_transaction_date:     { type: DataTypes.DATE },
  xpressbees_net_payment:          { type: DataTypes.DECIMAL(15,4) },
  snapmint_settlement_date:        { type: DataTypes.DATE },
  snapmint_settlement_value:       { type: DataTypes.DECIMAL(15,4) },
  bharatx_settlement_timestamp:    { type: DataTypes.DATE },
  bharatx_ledger_amount:           { type: DataTypes.DECIMAL(15,4) },
  createdAt:                       { type: DataTypes.DATE, allowNull: false },
  updatedAt:                       { type: DataTypes.DATE, allowNull: false },
})
```

### Migration 17 — invoices

```javascript
queryInterface.createTable('invoices', {
  id:             { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  brand_id:       { type: DataTypes.UUID, allowNull: false, references: { model: 'brands', key: 'id' }, onDelete: 'CASCADE' },
  agent_id:       { type: DataTypes.UUID, references: { model: 'agents', key: 'id' } },
  processed_on:   { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  company:        { type: DataTypes.STRING },
  invoice_number: { type: DataTypes.STRING },
  invoice_date:   { type: DataTypes.DATE },
  due_date:       { type: DataTypes.DATE },
  seller_gstin:   { type: DataTypes.STRING },
  buyer_gstin:    { type: DataTypes.STRING },
  category:       { type: DataTypes.STRING },
  product_name:   { type: DataTypes.STRING },
  hsn_code:       { type: DataTypes.STRING },
  quantity:       { type: DataTypes.INTEGER },
  unit:           { type: DataTypes.STRING },
  rate:           { type: DataTypes.DECIMAL(15,4) },
  cgst_rate:      { type: DataTypes.DECIMAL(10,4) },
  sgst_rate:      { type: DataTypes.DECIMAL(10,4) },
  igst_rate:      { type: DataTypes.DECIMAL(10,4) },
  cgst_amount:    { type: DataTypes.DECIMAL(15,4) },
  sgst_amount:    { type: DataTypes.DECIMAL(15,4) },
  igst_amount:    { type: DataTypes.DECIMAL(15,4) },
  gst_amount:     { type: DataTypes.DECIMAL(15,4) },
  taxable_value:  { type: DataTypes.DECIMAL(15,4) },
  invoice_link:   { type: DataTypes.STRING },
  status:         { type: DataTypes.STRING, defaultValue: 'Pending' },
  createdAt:      { type: DataTypes.DATE, allowNull: false },
  updatedAt:      { type: DataTypes.DATE, allowNull: false },
})
```

---

## seed-agents/ — Agent Seeder Definitions

All seeders in `seed-agents/` follow this pattern. The `index.js` runner executes them in order.

### Agent Definitions (what each seeder inserts into `agents` table)

| File | Agent Name | Description |
|---|---|---|
| 01-sales-amazon.js | Sales-Amazon | Process Amazon B2C/B2B sales with GST, TCS, SKU and Ledger mapping |
| 02-sales-flipkart.js | Sales-Flipkart | Process Flipkart sales with SKU and Ledger mapping |
| 03-sales-myntra.js | Sales-Myntra | Process Myntra RTO/Packed/Return sales files |
| 04-sales-blinkit.js | Sales-Blinkit | Process Blinkit quick commerce sales data |
| 05-sales-jiomart.js | Sales-JioMart | Process JioMart marketplace sales with TCS/TDS |
| 06-sales-firstcry.js | Sales-FirstCry | Process FirstCry order sales with SR/RTO tracking |
| 07-sales-zepto.js | Sales-Zepto | Process Zepto quick commerce sales with state mapping |
| 08-sales-nykaa.js | Sales-Nykaa | Process Nykaa beauty marketplace sales |
| 09-sales-shopify.js | Sales-Shopify | Process Shopify DTC sales with region and GST mapping |
| 10-settlement-amazon.js | Settlement-Amazon | Parse Amazon settlement reports, generate MIS |
| 11-total-sales-analyzer.js | Total-Sales-Analyzer | Aggregate cross-channel sales without SKU/Ledger |
| 12-invoice-process.js | Invoice-Process | Extract invoice data via n8n webhook, track status |
| 13-order-cycle-shopify.js | Order-Cycle-Shopify | Track Shopify order lifecycle across logistics partners |

### seed-agents/index.js (runner)

```javascript
const path = require('path');
const { sequelize } = require('../config/database');
const fs = require('fs');

async function runAgentSeeders() {
  await sequelize.authenticate();
  const files = fs.readdirSync(__dirname)
    .filter(f => f !== 'index.js' && f.endsWith('.js'))
    .sort();
  for (const file of files) {
    const seeder = require(path.join(__dirname, file));
    await seeder.up(sequelize.getQueryInterface(), sequelize.constructor);
    console.log(`Seeded: ${file}`);
  }
  await sequelize.close();
}

runAgentSeeders().catch(console.error);
```

---

## Key Code Differences From colonel-emergent

### 1. database.js — Single Connection

**colonel-emergent:**
```javascript
// masterSequelize + brandConnections Map + getBrandConnection() + createBrandDatabase()
```

**colonel-v2:**
```javascript
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,
  { host: process.env.DB_HOST, port: process.env.DB_PORT, dialect: 'postgres', logging: false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 } }
);
module.exports = { sequelize };
```

### 2. Brand model — No db_name

**colonel-emergent:** `Brand.db_name` (PostgreSQL database name for that brand)

**colonel-v2:** Brand has no `db_name`. Creating a brand only inserts a record.

### 3. Agent Assignment — No Table Creation

**colonel-emergent:**
```javascript
// POST /api/agents/assign
await createBrandDatabase(brand.db_name);           // creates new PG database
const brandConn = getBrandConnection(brand.db_name);
await brandConn.sync();                              // creates tables in brand DB
```

**colonel-v2:**
```javascript
// POST /api/agents/assign
await BrandAgent.create({ brand_id, agent_id, sku_master: [], ledger_master: [] });
// No database creation, no dynamic table creation
```

### 4. BrandAgent model — Merged Table

**colonel-emergent:**
- Master DB `brand_agents`: junction only (brand_id, agent_id)
- Brand DB `brand_agents`: data table (brand_id, agent_id, sku_master, ledger_master)

**colonel-v2:**
- Single `brand_agents` table with: brand_id, agent_id, sku_master, ledger_master
- Unique constraint on (brand_id, agent_id)

### 5. Agent Data Controllers — Static Models With brand_id Filter

**colonel-emergent:**
```javascript
const brandConn = getBrandConnection(brand.db_name);
const SalesModel = getDynamicModel(brandConn, agent.id, agent.columns);
const records = await SalesModel.findAll({ where: { month, year } });
```

**colonel-v2:**
```javascript
const { SalesAmazon } = require('../../models');
const records = await SalesAmazon.findAll({ where: { brand_id: brandId, month, year } });
```

### 6. Master Data (SKU/Ledger) — Single Table Query

**colonel-emergent:**
```javascript
const brandConn = getBrandConnection(brand.db_name);
const BrandAgentModel = getBrandAgentModel(brandConn);
const brandAgent = await BrandAgentModel.findOne({ where: { brand_id, agent_id } });
```

**colonel-v2:**
```javascript
const { BrandAgent } = require('../../models');
const brandAgent = await BrandAgent.findOne({ where: { brand_id, agent_id } });
```

### 7. server.js — No Brand DB Sync on Startup

**colonel-emergent:**
```javascript
await masterSequelize.authenticate();
await masterSequelize.sync({ alter: false });
// Brand DBs are synced lazily on first connection
```

**colonel-v2:**
```javascript
const { sequelize } = require('./src/config/database');
await sequelize.authenticate();
// Tables created via migrations only — no .sync()
app.listen(PORT);
```

---

## Model Associations (models/index.js)

```javascript
User.hasMany(BrandUser, { foreignKey: 'user_id' });
Brand.hasMany(BrandUser, { foreignKey: 'brand_id' });
BrandUser.belongsTo(User, { foreignKey: 'user_id' });
BrandUser.belongsTo(Brand, { foreignKey: 'brand_id' });

Agent.hasMany(BrandAgent, { foreignKey: 'agent_id' });
Brand.hasMany(BrandAgent, { foreignKey: 'brand_id' });
BrandAgent.belongsTo(Agent, { foreignKey: 'agent_id' });
BrandAgent.belongsTo(Brand, { foreignKey: 'brand_id' });

Brand.hasMany(SalesAmazon, { foreignKey: 'brand_id' });
SalesAmazon.belongsTo(Brand, { foreignKey: 'brand_id' });
// ... same pattern for all 12 agent data models
```

---

## .sequelizerc

```javascript
const path = require('path');
module.exports = {
  'config':          path.resolve('src/config/database-cli.json'),
  'models-path':     path.resolve('src/models'),
  'seeders-path':    path.resolve('src/seeders'),
  'migrations-path': path.resolve('src/migrations'),
};
```

## src/config/database-cli.json (for sequelize-cli)

```json
{
  "development": {
    "username": "postgres",
    "password": "root",
    "database": "colonel_v2",
    "host": "localhost",
    "port": 5432,
    "dialect": "postgres"
  },
  "production": {
    "use_env_variable": "DATABASE_URL",
    "dialect": "postgres"
  }
}
```

---

## API Routes (Unchanged From colonel-emergent)

All routes are identical — no URL changes. Only internal implementation changes
(DB connection approach, model imports). Frontend requires zero changes.

| Prefix | File | Purpose |
|---|---|---|
| /api/auth | authRoutes.js | Login, register, profile |
| /api/brands | brandRoutes.js | CRUD brands, assign users |
| /api/agents | agentRoutes.js | CRUD agents, assign to brands |
| /api/brands/:id/agents/:id/amazon | salesRoutes.js | Amazon sales |
| /api/brands/:id/agents/:id/flipkart | salesRoutes.js | Flipkart sales |
| /api/brands/:id/agents/:id/myntra | salesRoutes.js | Myntra sales |
| /api/brands/:id/agents/:id/blinkit | salesRoutes.js | Blinkit sales |
| /api/brands/:id/agents/:id/jiomart | salesRoutes.js | JioMart sales |
| /api/brands/:id/agents/:id/firstcry | salesRoutes.js | FirstCry sales |
| /api/brands/:id/agents/:id/zepto | salesRoutes.js | Zepto sales |
| /api/brands/:id/agents/:id/nykaa | salesRoutes.js | Nykaa sales |
| /api/brands/:id/agents/:id/shopify | salesRoutes.js | Shopify sales |
| /api/brands/:id/agents/:id/settlement-amazon | settlementRoutes.js | Settlement |
| /api/brands/:id/agents/:id/order-cycle-shopify | orderCycleRoutes.js | Order cycle |
| /api/brands/:id/agents/:id/invoice | invoiceRoutes.js | Invoice processing |
| /api/brands/:id/agents/:id/cfo-dashboard | cfoAnalyticsRoutes.js | CFO analytics |
| /api/n8n/feed | invoiceRoutes.js | n8n webhook (no auth) |

---

## Business Logic (Unchanged)

The following are copied verbatim from colonel-emergent with only model import changes:

- **Two-phase generation**: preview → commit / discard (pendingGenerationsStore.js)
- **SKU Master mapping**: Map SKU → FG (Finished Goods)
- **Ledger Master mapping**: Map state → tally ledger + invoice prefix
- **Excel processors**: All files in services/processors/ (per channel)
- **CFO analytics service**: All 10+ analytics metrics (cfoAnalyticsService.js)
- **Settlement MIS generation**: Amazon settlement → Excel MIS report
- **Invoice processing**: n8n webhook → store → SSE status updates
- **Order cycle tracking**: Shopify + logistics partner reconciliation
- **SSE (Server-Sent Events)**: Real-time status for invoice processing
- **Role-based access**: admin, accountant, brand_executive

---

## Frontend (Identical to colonel-emergent)

The entire frontend is copied as-is. The only change is the API base URL pointing to the
colonel-v2 backend. No page, component, or route changes are needed because:
- All API endpoints have identical URLs
- The `db_name` field is internal to the backend — never exposed to frontend
- Brand creation response shape is the same (just without db_name)

---

## Environment Variables (.env)

```env
PORT=8001
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=root
DB_NAME=colonel_v2
DB_PORT=5432
JWT_SECRET=my_super_secret_key_123
JWT_EXPIRES_IN=24h
NODE_ENV=development

# Invoice n8n webhook URLs (per brand slug)
nestroots_invoice_url=https://colonel1234.app.n8n.cloud/webhook/Devloper
nestroots_invoice_sheet=https://docs.google.com/spreadsheets/d/...
stroom_invoice_url=https://colonel1234.app.n8n.cloud/webhook/Devloper
stroom_invoice_sheet=https://docs.google.com/spreadsheets/d/...
```

---

## Setup & Run Commands

```bash
# 1. Create database
createdb colonel_v2    # or via psql: CREATE DATABASE colonel_v2;

# 2. Install backend dependencies
cd colonel-v2/backend
npm install

# 3. Run all migrations (creates all tables)
npx sequelize-cli db:migrate

# 4. Seed admin user
npx sequelize-cli db:seed:all

# 5. Seed all agents
node src/seed-agents/index.js

# 6. Start backend
node server.js

# 7. Install and start frontend
cd ../frontend
npm install
npm start
```

---

## Implementation Order

1. Scaffold `colonel-v2/` directory structure
2. Create `backend/package.json` with all dependencies
3. Create `.sequelizerc` and `database-cli.json`
4. Create `src/config/database.js` (single Sequelize instance)
5. Create all 17 migration files
6. Create all 14 model files + `models/index.js` with associations
7. Create `seeders/20240101000001-admin-user.js`
8. Create all 13 files in `seed-agents/` + `seed-agents/index.js`
9. Copy + adapt `controllers/` from colonel-emergent (remove brand DB calls)
10. Copy + adapt `routes/` from colonel-emergent (unchanged)
11. Copy + adapt `services/` from colonel-emergent (unchanged)
12. Copy `middleware/` from colonel-emergent (unchanged)
13. Copy `utils/` from colonel-emergent (unchanged)
14. Create `src/app.js` and `server.js`
15. Copy entire `frontend/` from colonel-emergent (no changes needed)
16. Create `.env` file
17. Test: migrate → seed → start → login

---

## Files That Change vs colonel-emergent

| File | Change |
|---|---|
| src/config/database.js | Rewrite: single Sequelize, remove getBrandConnection/createBrandDatabase |
| src/models/\* | Rewrite: all models in one place, add brand_id to agent data models |
| src/models/index.js | New: loads all models + sets up associations |
| src/migrations/\* | New: 17 migration files (replaces .sync()) |
| src/seeders/\* | New: admin user seeder |
| src/seed-agents/\* | New: 13 agent seeders + runner |
| src/controllers/brandController.js | Remove createBrandDatabase() call |
| src/controllers/agentController.js | Simplify assign: just insert BrandAgent record |
| src/controllers/agents/\*/\*.js | Replace getDynamicModel() with static model import + brand_id filter |
| src/controllers/salesController.js | Same simplification |
| src/controllers/cfoAnalyticsController.js | Use static SalesAmazon model with brand_id |
| server.js | Remove masterSequelize.sync(), use single sequelize |
| .env | DB_NAME=colonel_v2 (no DB_NAME_MASTER) |
| frontend/\* | Zero changes needed |
| src/services/\* | Zero changes (business logic untouched) |
| src/routes/\* | Zero changes (URLs untouched) |
| src/middleware/\* | Zero changes |
| src/utils/\* | Zero changes |
