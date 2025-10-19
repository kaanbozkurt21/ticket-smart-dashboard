# API Contract Documentation

Bu döküman, SupportAI frontend uygulamasının beklediği API kontratlarını tanımlar. Şu anda tüm API çağrıları mock verilerle çalışmaktadır. Gerçek backend'e geçiş için sadece `/app/frontend/src/lib/api.js` dosyasındaki fonksiyonları güncellemeniz yeterlidir.

## 🔄 Mock'tan Gerçek API'ye Geçiş

**Mevcut Durum:** Tüm API çağrıları `lib/api.js` içinde mock veri döndürüyor.

**Gerçek API'ye Geçiş:**
1. `lib/api.js` dosyasını açın
2. Her fonksiyondaki `// TODO: Replace with real API call` yorumunu bulun
3. Mock mantığı yerine gerçek `fetch()` çağrısını aktif edin
4. UI kodu hiç değişmeden çalışmaya devam edecek

### Örnek Geçiş:

```javascript
// MOCK (Şu an)
export async function fetchTickets(params = {}) {
  await delay();
  let filtered = [...ticketsData];
  // ... filtering logic
  return { items: filtered, total: filtered.length };
}

// GERÇEK API (Backend hazır olduğunda)
export async function fetchTickets(params = {}) {
  const response = await fetch(`${API_URL}/api/tickets?${new URLSearchParams(params)}`);
  if (!response.ok) throw new Error('Failed to fetch tickets');
  return await response.json();
}
```

---

## 📋 API Endpoints

### 1. Tickets API

#### GET /api/tickets
Ticket listesini filtrelerle getirir.

**Query Parameters:**
- `query` (string, optional): Arama metni
- `status` (string, optional): 'open' | 'in-progress' | 'resolved' | 'closed'
- `priority` (string, optional): 'low' | 'medium' | 'high'
- `assignee` (string, optional): Atanan kişi adı
- `tag` (string, optional): Etiket
- `page` (number, optional): Sayfa numarası (default: 1)
- `pageSize` (number, optional): Sayfa boyutu (default: 25)

**Response:**
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
  description: string,
  status: 'open' | 'in-progress' | 'resolved' | 'closed',
  priority: 'low' | 'medium' | 'high',
  assignee: string,
  customer: string,
  customerId: string,
  tags: string[],
  createdAt: string (ISO 8601),
  updatedAt: string (ISO 8601),
  resolvedAt?: string (ISO 8601),
  messages?: Message[]
}
```

---

#### GET /api/tickets/:id
Tek bir ticket'ın detaylarını timeline ve notlar ile getirir.

**Response:**
```typescript
Ticket & {
  timeline: TimelineEvent[],
  notes: Note[],
  attachments: Attachment[]
}
```

**TimelineEvent Model:**
```typescript
{
  type: string,
  user: string,
  timestamp: string (ISO 8601),
  description: string
}
```

**Note Model:**
```typescript
{
  id: string,
  body: string,
  author: string,
  createdAt: string (ISO 8601)
}
```

**Attachment Model:**
```typescript
{
  id: string,
  name: string,
  size: string,
  type: string,
  url: string
}
```

---

#### POST /api/tickets/:id/notes
Ticket'a internal not ekler.

**Request Body:**
```typescript
{
  body: string
}
```

**Response:**
```typescript
{
  id: string,
  body: string,
  author: string,
  createdAt: string (ISO 8601)
}
```

---

### 2. AI API

#### POST /api/ai/summary
Ticket için AI özeti oluşturur.

**Request Body:**
```typescript
{
  ticketId: string
}
```

**Response:**
```typescript
{
  summary: string
}
```

---

#### POST /api/ai/draft-reply
Ticket için AI taslak yanıt oluşturur.

**Request Body:**
```typescript
{
  ticketId: string
}
```

**Response:**
```typescript
{
  draft: string
}
```

---

### 3. Customers API

#### GET /api/customers
Müşteri listesini getirir.

**Query Parameters:**
- `query` (string, optional): Arama metni

**Response:**
```typescript
{
  items: Customer[],
  total: number
}
```

**Customer Model:**
```typescript
{
  id: string,
  name: string,
  email: string,
  company: string,
  plan: 'Free' | 'Pro' | 'Enterprise',
  status: 'active' | 'inactive',
  totalTickets: number,
  openTickets: number,
  joinedAt: string (ISO 8601),
  lastActivity: string (ISO 8601)
}
```

---

#### GET /api/customers/:id
Tek bir müşterinin detaylarını ticket geçmişi ile getirir.

**Response:**
```typescript
Customer & {
  tickets: Ticket[]
}
```

---

### 4. Dashboard API

#### GET /api/dashboard/stats
Dashboard istatistiklerini getirir.

**Response:**
```typescript
{
  openTickets: number,
  resolvedToday: number,
  avgResponseTime: string,
  satisfactionRate: string
}
```

---

#### GET /api/dashboard/recent-tickets
Son ticketları getirir.

**Query Parameters:**
- `limit` (number, optional): Kaç tane (default: 5)

**Response:**
```typescript
Ticket[]
```

---

## 🔐 Authentication

Şu anda authentication localStorage tabanlı mock olarak çalışıyor. Gerçek API'de:

**Expected Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Login/Signup endpoints:** (şu an frontend-only mock)
- POST /api/auth/login
- POST /api/auth/signup
- POST /api/auth/logout

---

## ⚠️ Error Handling

API, hata durumunda şu formatta yanıt dönmelidir:

```typescript
{
  error: string,
  message: string,
  statusCode: number
}
```

Frontend'de tüm API çağrıları try-catch ile sarılıdır ve hataları toast notification ile kullanıcıya gösterir.

---

## 🚀 Geliştirme Notları

1. **CORS:** Backend API'nin CORS ayarlarını frontend URL'ine izin verecek şekilde yapılandırın
2. **Base URL:** `lib/api.js` dosyasında `API_URL` değişkenini environment variable olarak ayarlayın
3. **Loading States:** Tüm API çağrıları loading state'leri ile birlikte gelir
4. **Error Handling:** API hataları otomatik olarak toast ile gösterilir
5. **Retry Logic:** Gerekirse API layer'a retry logic eklenebilir

---

## 📝 Test Etme

Mock API ile test etmek için:
```bash
cd /app/frontend
yarn start
```

Gerçek API ile test etmek için:
1. Backend'i başlatın
2. `lib/api.js` dosyasında mock kod yerine fetch çağrılarını aktif edin
3. Environment variable'da `REACT_APP_API_URL` ayarlayın

---

## 📞 İletişim

Sorularınız için: API kontrat değişiklikleri için frontend ve backend ekipleri koordine olmalıdır.
