# Project Overview

## CoTiTra (Copro Tickets Tracker)

Web application for ticket management in co-ownership/residential buildings.

## Tech Stack

- **Framework**: Next.js 15+ (App Router) — No beta npm packages
- **Language**: TypeScript (strict mode)
- **UI**: React 19 (stable)
- **Database**: MongoDB (Atlas)
- **Testing**: Vitest + React Testing Library + Playwright
- **Hosting**: Render.com

## Main Features

- **Ticket Management**: Create, read, update, delete with statuses (NEW, IN_PROGRESS, RESOLVED, CLOSED)
- **Comments**: Add comments to tickets with full history
- **Timeline**: Display chronological events

## Deployment

**Render.com**

- Build: `npm install && npm run build`
- Start: `npm start`
- Environment variables: Configure in Render dashboard

## Database Setup

### Local (MongoDB)

```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# .env.local
MONGODB_URI=mongodb://localhost:27017/cotitra
```

### Production (MongoDB Atlas)

```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/cotitra
```
