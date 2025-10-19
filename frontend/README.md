# SupportAI - AI-Powered Customer Support SaaS

Modern, professional customer support platform with AI capabilities. Full-featured frontend prototype ready for backend integration.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and yarn
- (Optional) Backend API server

### Installation

```bash
cd /app/frontend
yarn install
```

### Configuration

1. Copy environment template:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local`:
```env
REACT_APP_API_URL=http://localhost:4000  # Your backend URL
REACT_APP_APP_NAME=SupportAI
```

### Running the App

```bash
# Development mode
yarn start

# Production build
yarn build

# Run tests
yarn test
```

App will run at: **http://localhost:3000**

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Shadcn base components
│   ├── custom/          # Custom business components
│   └── layout/          # Layout components (AppShell)
├── pages/               # Route pages
├── lib/
│   ├── api.js          # 🔥 API contract layer (mock + real)
│   ├── mock/           # Mock data (tickets, customers)
│   └── utils.js        # Helper functions
└── index.css           # Design system tokens
```

---

## 🔄 Mock → Real API Geçişi

### Şu Anki Durum: MOCK Mode

Uygulama şu anda **tamamen mock veri** ile çalışıyor. `REACT_APP_API_URL` tanımlı değilse, tüm API çağrıları mock data döndürür.

### Backend Hazır Olduğunda: 3 Adımda Geçiş

#### Adım 1: Environment Variable Ayarla

```bash
# .env.local
REACT_APP_API_URL=https://api.yourbackend.com
```

#### Adım 2: Backend API'yi Başlat

Backend aşağıdaki endpoint'leri sağlamalı:

**Authentication:**
- `POST /api/auth/login`
- `POST /api/auth/signup`
- `POST /api/auth/logout`

**Tickets:**
- `GET /api/tickets?query=&status=&priority=&assignee=&tag=&page=&pageSize=`
- `GET /api/tickets/:id`
- `POST /api/tickets/:id/notes`

**AI:**
- `POST /api/ai/summary` (with timeout support)
- `POST /api/ai/draft-reply`

**Customers:**
- `GET /api/customers?query=`
- `GET /api/customers/:id`

**Dashboard:**
- `GET /api/dashboard/stats`
- `GET /api/dashboard/recent-tickets?limit=`

**Billing (Optional - Stripe):**
- `POST /api/billing/checkout`
- `GET /api/billing/subscription`
- `POST /api/billing/cancel`

#### Adım 3: Restart Frontend

```bash
yarn start
```

**O kadar!** Frontend artık gerçek API'yi kullanıyor. UI kodu hiç değişmedi.

---

## 📋 API Contract Detayları

### Örnek: fetchTickets Fonksiyonu

**Mevcut (`lib/api.js`):**
```javascript
export async function fetchTickets(params = {}) {
  if (USE_MOCK) {
    // Mock: Filter local data
    let filtered = [...ticketsData];
    // ... filtering logic
    return { items: filtered, total: filtered.length };
  }
  
  // REAL API (automatically used when REACT_APP_API_URL is set)
  const response = await fetch(
    `${API_URL}/api/tickets?${new URLSearchParams(params)}`
  );
  return await response.json();
}
```

### API Response Formats

**Tickets List Response:**
```typescript
{
  items: Ticket[],
  total: number,
  page: number,
  pageSize: number
}
```

**Ticket Model:**
```typescript
{
  id: string,
  subject: string,
  status: 'open' | 'in-progress' | 'resolved' | 'closed',
  priority: 'low' | 'medium' | 'high',
  assignee: string,
  customer: string,
  tags: string[],
  createdAt: string,
  updatedAt: string
}
```

Detaylı API kontrat için: **[API_CONTRACT.md](./API_CONTRACT.md)**

---

## 🎨 Design System

### Theme Tokens (`src/index.css`)

Tüm renkler HSL formatında semantic token olarak tanımlı:

```css
:root {
  --primary: 239 70% 58%;        /* Indigo */
  --secondary: 210 15% 92%;      /* Slate */
  --success: 142 71% 45%;        /* Green */
  --warning: 38 92% 50%;         /* Orange */
  --destructive: 0 84% 60%;      /* Red */
  /* ... */
}

.dark {
  --primary: 239 70% 62%;        /* Lighter indigo */
  /* ... */
}
```

### Typography

- **Font:** Inter (Google Fonts)
- **Scales:** text-xs (12px) → text-4xl (36px)
- **Weights:** 400 (normal), 500 (medium), 600 (semibold)

### Components

- **Base:** Shadcn/ui (Radix primitives + Tailwind)
- **Custom:** DataTable, StatusPill, AIModal, EmptyState

---

## ✨ Key Features

### 🔐 Authentication
- Mock login/signup (localStorage token)
- Ready for JWT/cookie-based auth
- Protected routes

### 🎫 Ticket Management
- Multi-filter system (status, priority, assignee, tag)
- Fuzzy search
- Pagination (25 items/page)
- Timeline & activity tracking
- Internal notes

### 🤖 AI Features
- AI Summary generation
- Draft Reply with apply-to-textarea
- Timeout handling (30s default)
- Loading states & error handling

### 👥 Customer Portal
- Customer list with search
- Detailed profiles
- Ticket history

### 💳 Billing (Stripe Ready)
- 3-tier pricing (Free, Pro, Enterprise)
- Checkout session creation
- Subscription management (ready for Stripe)

### 🎨 UI/UX
- Light/dark theme (persistent)
- Responsive mobile-first design
- Accessibility (ARIA labels, focus rings)
- Toast notifications (sonner)
- Loading states & skeletons

---

## 🧪 Testing

### Manual Testing

1. **Login:** Any email/password works (mock)
2. **Dashboard:** See stats and charts
3. **Tickets:** 
   - Try filters
   - Click on a ticket
   - Use AI Summary/Draft Reply buttons
4. **Customers:** Browse and view details
5. **Theme Toggle:** Switch between light/dark
6. **Logout:** Clears session

### Test Credentials (Mock)

```
Email: any@email.com
Password: any password
```

---

## 🔧 Development

### Adding New API Endpoints

1. Open `src/lib/api.js`
2. Add new function:

```javascript
export async function myNewEndpoint(params) {
  if (USE_MOCK) {
    await delay();
    return { mock: 'data' };
  }
  
  // Real API
  return await apiCall('/api/my-endpoint', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
```

3. Import and use in components:

```javascript
import { myNewEndpoint } from '../lib/api';

const data = await myNewEndpoint({ foo: 'bar' });
```

### Environment Variables

```bash
REACT_APP_API_URL       # Backend API URL (optional, uses mock if not set)
REACT_APP_APP_NAME      # Application name
REACT_APP_ENV           # development | staging | production
```

---

## 📦 Tech Stack

- **Framework:** React 18 + React Router 6
- **Styling:** Tailwind CSS 3
- **Components:** Shadcn/ui (Radix UI)
- **Icons:** Lucide React
- **Charts:** Recharts
- **Notifications:** Sonner
- **Build:** Create React App (Craco)

---

## 🚢 Deployment

### Build for Production

```bash
yarn build
```

Output: `build/` directory

### Deploy to Vercel/Netlify

```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod
```

### Environment Variables (Production)

Set in your deployment platform:

```
REACT_APP_API_URL=https://api.production.com
REACT_APP_APP_NAME=SupportAI
REACT_APP_ENV=production
```

---

## 🤝 Contributing

### Code Style

- Use semantic tokens (no hardcoded colors)
- Add aria-labels to interactive elements
- Include loading and error states
- Write try-catch for all API calls

### Git Workflow

```bash
git checkout -b feature/my-feature
git commit -m "feat: add new feature"
git push origin feature/my-feature
```

---

## 📄 License

MIT License - feel free to use for commercial projects.

---

## 📞 Support

For questions about:
- **API Contract:** See `API_CONTRACT.md`
- **Design System:** Check `src/index.css` and `tailwind.config.js`
- **Components:** Browse `src/components/`

---

## 🎯 Roadmap

- [ ] Connect to real backend API
- [ ] Implement real-time updates (WebSocket)
- [ ] Add unit tests (Vitest)
- [ ] Integrate Stripe checkout
- [ ] Add file upload for attachments
- [ ] Implement advanced search (Algolia)
- [ ] Add analytics dashboard
- [ ] Multi-language support (i18n)

---

**Built with ❤️ by the SupportAI Team**
