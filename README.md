# Mkhzny Backend (Node.js + Express + MongoDB + Mongoose)

Backend REST API for the **Mkhzny** inventory management system.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file from `.env.example` and configure `MONGODB_URI`:
   ```bash
   cp .env.example .env
   ```
3. (Optional) Seed sample inventory data:
   ```bash
   npm run seed
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/items` - List all items (supports `?search=`, `?category=`, `?lowStock=true`)
- `GET /api/items/:id` - Get single item by ID
- `POST /api/items` - Create a new item
- `PUT /api/items/:id` - Update an item
- `DELETE /api/items/:id` - Delete an item (and optionally its moves via `?cascadeMoves=true`)
- `GET /api/moves` - List stock movements (supports `?itemId=`, `?type=in|out|adjust`)
- `POST /api/moves` - Record a stock movement (`in`, `out`, `adjust`) with transactional stock update
- `GET /api/settings` - Get warehouse settings
- `PUT /api/settings` - Update warehouse settings
- `GET /api/reports/summary` - Inventory totals, stock value, low-stock items, category breakdown, and recent moves
