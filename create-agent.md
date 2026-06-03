# Creating a New Agent

This guide walks through the complete process of adding a new **agent** to the Colonel automation platform. It covers:

1. **Defining the agent schema** (database columns).
2. **Creating the seeder** in `backend/src/seed-agents`.
3. **Implementing the controller** in `backend/src/controller`.
4. **Registering the routes** (if needed).
5. **Testing the new endpoint**.

---

## 1. Project Layout Overview

```
backend/
├─ src/
│  ├─ controller/          # Controllers for API endpoints
│  │   └─ agentController.js
│  ├─ model/               # DB models (if using an ORM like Sequelize)
│  │   └─ Agent.js
│  ├─ seed-agents/         # Seeder files for initial data
│  │   └─ 2023-01-create-agent-seeder.js
│  ├─ routes/              # Express route definitions
│  │   └─ agentRoutes.js
│  └─ db.js                # Database connection helper
└─ ...
```

---

## 2. Defining the Agent Schema

If you use **Sequelize**, create a model file `backend/src/model/Agent.js` (skip if the model already exists).

```javascript
// backend/src/model/Agent.js
const { DataTypes } = require('sequelize');
const db = require('../db');

const Agent = db.define('Agent', {
  // Primary key
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  // Human‑readable name
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  // Description of what the agent does
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  // Status – e.g., active, inactive, deprecated
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'deprecated'),
    defaultValue: 'active',
  },
  // JSON configuration payload (optional)
  config: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  // Timestamps (createdAt, updatedAt) are added automatically by Sequelize
});

module.exports = Agent;
```

> **Tip**: Adjust the columns to match any additional business requirements (e.g., `ownerId`, `version`).

---

## 3. Creating the Seeder

Create a seeder file inside `backend/src/seed-agents`. Name it with a timestamp prefix so it runs in order, for example `2023-10-01-create-agent-seeder.js`.

```javascript
// backend/src/seed-agents/2023-10-01-create-agent-seeder.js
/**
 * Seed the initial agents required for the platform.
 * This file will be executed by the seed runner (see package.json scripts).
 */

const Agent = require('../model/Agent');

async function seedAgents() {
  const agents = [
    {
      name: 'EmailNotifier',
      description: 'Sends email notifications to users.',
      status: 'active',
      config: { smtpHost: 'smtp.example.com', port: 587 },
    },
    {
      name: 'DataCollector',
      description: 'Collects telemetry data from devices.',
      status: 'active',
      config: { intervalSec: 300 },
    },
    // Add more agents here as needed
  ];

  // Upsert to avoid duplicate entries when re‑running the seed
  for (const agent of agents) {
    await Agent.upsert(agent);
  }

  console.log('✅ Agents seeded successfully');
}

module.exports = seedAgents;
```

### 3.1 Registering the Seeder

Add the seeder to your seed script (commonly in `package.json` under `scripts`). Example:

```json
"scripts": {
  "seed": "node -e \"require('./backend/src/seed-agents/2023-10-01-create-agent-seeder')().then(() => process.exit())\""
}
```

Run it with:

```bash
npm run seed
```

---

## 4. Implementing the Agent Controller

Create (or extend) `backend/src/controller/agentController.js`.

```javascript
// backend/src/controller/agentController.js
const Agent = require('../model/Agent');

/**
 * GET /agents
 * Returns a list of all agents.
 */
async function getAllAgents(req, res) {
  try {
    const agents = await Agent.findAll();
    res.json(agents);
  } catch (err) {
    console.error('Error fetching agents:', err);
    res.status(500).json({ error: 'Failed to retrieve agents' });
  }
}

/**
 * POST /agents
 * Creates a new agent.
 */
async function createAgent(req, res) {
  const { name, description, status, config } = req.body;
  try {
    const newAgent = await Agent.create({ name, description, status, config });
    res.status(201).json(newAgent);
  } catch (err) {
    console.error('Error creating agent:', err);
    res.status(400).json({ error: err.message });
  }
}

/**
 * PUT /agents/:id
 * Updates an existing agent.
 */
async function updateAgent(req, res) {
  const { id } = req.params;
  const updates = req.body;
  try {
    const [updatedRows] = await Agent.update(updates, { where: { id } });
    if (!updatedRows) return res.status(404).json({ error: 'Agent not found' });
    const updatedAgent = await Agent.findByPk(id);
    res.json(updatedAgent);
  } catch (err) {
    console.error('Error updating agent:', err);
    res.status(400).json({ error: err.message });
  }
}

/**
 * DELETE /agents/:id
 * Removes an agent.
 */
async function deleteAgent(req, res) {
  const { id } = req.params;
  try {
    const deletedRows = await Agent.destroy({ where: { id } });
    if (!deletedRows) return res.status(404).json({ error: 'Agent not found' });
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting agent:', err);
    res.status(500).json({ error: 'Failed to delete agent' });
  }
}

module.exports = {
  getAllAgents,
  createAgent,
  updateAgent,
  deleteAgent,
};
```

---

## 5. Registering Routes (if not already present)

Update `backend/src/routes/agentRoutes.js` to wire the controller.

```javascript
// backend/src/routes/agentRoutes.js
const express = require('express');
const router = express.Router();
const agentController = require('../controller/agentController');

// List agents
router.get('/', agentController.getAllAgents);

// Create a new agent
router.post('/', agentController.createAgent);

// Update an existing agent
router.put('/:id', agentController.updateAgent);

// Delete an agent
router.delete('/:id', agentController.deleteAgent);

module.exports = router;
```

Make sure the main server file (e.g., `app.js` or `server.js`) loads this route:

```javascript
app.use('/api/agents', require('./routes/agentRoutes'));
```

---

## 6. Testing the New Endpoints

You can test the endpoints with **cURL**, **Postman**, or **VS Code REST Client**.

```bash
# List agents
curl http://localhost:3000/api/agents

# Create an agent
curl -X POST http://localhost:3000/api/agents \
  -H 'Content-Type: application/json' \
  -d '{"name":"ChatBot","description":"Handles chat interactions","status":"active"}'

# Update an agent (replace <id>)
curl -X PUT http://localhost:3000/api/agents/<id> \
  -H 'Content-Type: application/json' \
  -d '{"status":"inactive"}'

# Delete an agent (replace <id>)
curl -X DELETE http://localhost:3000/api/agents/<id>
```

---

## 7. Summary Checklist

- [ ] **Model** – Verify `backend/src/model/Agent.js` reflects required columns.
- [ ] **Seeder** – Add a new seeder file under `backend/src/seed-agents` and register it.
- [ ] **Controller** – Implement CRUD functions in `backend/src/controller/agentController.js`.
- [ ] **Routes** – Ensure `backend/src/routes/agentRoutes.js` is up‑to‑date.
- [ ] **Database Migration** – Run any pending migrations if you use a migration tool (e.g., `sequelize-cli db:migrate`).
- [ ] **Testing** – Verify all endpoints work with sample requests.

---

### Next Steps
1. **Add unit tests** for the controller using a testing framework like Jest.
2. **Document API** (Swagger/OpenAPI) for consumer reference.
3. **Define role‑based access** if agents need protection.

That’s it! Following this guide will give you a consistent, repeatable process for adding new agents to the platform.
