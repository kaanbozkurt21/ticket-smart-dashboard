/**
 * API Contract Layer
 * 
 * Mock implementations that match the expected API contract.
 * To switch to real API: Replace mock logic with actual fetch calls.
 * 
 * Environment Variables:
 * - REACT_APP_API_URL: Backend API base URL
 * - REACT_APP_APP_NAME: Application name
 */

import ticketsData from './mock/tickets.json';
import customersData from './mock/customers.json';

// Get API URL from environment or use mock
const API_URL = process.env.REACT_APP_API_URL || '';
const USE_MOCK = !API_URL; // If no API_URL, use mock data

// Simulate network delay for realistic UX
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generic API call wrapper with error handling
 */
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/**
 * Generic AI API call with timeout and error handling
 * @param {string} path - AI endpoint path (e.g., '/summary', '/draft-reply')
 * @param {Object} payload - Request payload
 * @returns {Promise<any>}
 */
export async function callAI(path, payload, timeoutMs = 30000) {
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    if (USE_MOCK) {
      // MOCK: Simulate AI processing
      await delay(1500);
      
      if (path === '/summary') {
        return {
          summary: `Bu ticket, ${payload.ticket.customer} tarafından ${payload.ticket.priority} öncelikli olarak açılmıştır. ${payload.ticket.tags.join(', ')} kategorilerinde işaretlenmiştir.`
        };
      } else if (path === '/draft-reply') {
        return {
          draft: `Merhaba ${payload.ticket.customer},\\n\\nSorununuzu inceledik ve çözüm önerilerimiz aşağıdadır.\\n\\nİyi günler,\\n${payload.ticket.assignee}`
        };
      }
    }
    
    // REAL API:
    const response = await fetch(`${API_URL}/api/ai${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error('AI request failed');
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('AI request timeout - lütfen tekrar deneyin');
    }
    
    throw error;
  }
}

/**
 * Authentication APIs
 */

/**
 * Login user
 * POST /api/auth/login
 */
export async function login(email, password) {
  if (USE_MOCK) {
    await delay(800);
    
    // MOCK: Accept any credentials
    const mockToken = 'mock-jwt-token-' + Date.now();
    const mockUser = {
      id: 'user-1',
      name: 'Ayşe Yılmaz',
      email: email,
      role: 'agent',
    };
    
    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('isAuthenticated', 'true');
    
    return { token: mockToken, user: mockUser };
  }
  
  // REAL API:
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }
  
  const data = await response.json();
  
  // Store token and user info
  localStorage.setItem('auth_token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  localStorage.setItem('isAuthenticated', 'true');
  
  return data;
}

/**
 * Signup new user
 * POST /api/auth/signup
 */
export async function signup(name, email, password) {
  if (USE_MOCK) {
    await delay(800);
    
    // MOCK: Accept registration
    const mockToken = 'mock-jwt-token-' + Date.now();
    const mockUser = {
      id: 'user-' + Date.now(),
      name: name,
      email: email,
      role: 'agent',
    };
    
    localStorage.setItem('auth_token', mockToken);
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('isAuthenticated', 'true');
    
    return { token: mockToken, user: mockUser };
  }
  
  // REAL API:
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Signup failed');
  }
  
  const data = await response.json();
  
  // Store token and user info
  localStorage.setItem('auth_token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  localStorage.setItem('isAuthenticated', 'true');
  
  return data;
}

/**
 * Logout user
 * POST /api/auth/logout
 */
export async function logout() {
  if (USE_MOCK) {
    await delay(300);
    
    // MOCK: Clear local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    
    return { success: true };
  }
  
  // REAL API:
  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
      },
    });
  } catch (error) {
    console.error('Logout API error:', error);
  } finally {
    // Always clear local storage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
  }
  
  return { success: true };
}

/**
 * Get current user
 */
export function getCurrentUser() {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

/**
 * Tickets APIs
 */
export async function fetchTickets(params = {}) {
  await delay();
  
  // MOCK: Filter tickets based on params
  let filtered = [...ticketsData];
  
  if (params.query) {
    const query = params.query.toLowerCase();
    filtered = filtered.filter(t => 
      t.subject.toLowerCase().includes(query) ||
      t.customer.toLowerCase().includes(query) ||
      t.id.toLowerCase().includes(query)
    );
  }
  
  if (params.status && params.status !== 'all') {
    filtered = filtered.filter(t => t.status === params.status);
  }
  
  if (params.priority && params.priority !== 'all') {
    filtered = filtered.filter(t => t.priority === params.priority);
  }
  
  if (params.assignee && params.assignee !== 'all') {
    filtered = filtered.filter(t => t.assignee === params.assignee);
  }
  
  if (params.tag && params.tag !== 'all') {
    filtered = filtered.filter(t => t.tags.includes(params.tag));
  }
  
  // Pagination
  const page = params.page || 1;
  const pageSize = params.pageSize || 25;
  const total = filtered.length;
  const startIndex = (page - 1) * pageSize;
  const items = filtered.slice(startIndex, startIndex + pageSize);
  
  // TODO: Replace with real API call
  // const response = await fetch(`${API_URL}/api/tickets?${new URLSearchParams(params)}`);
  // return await response.json();
  
  return { items, total, page, pageSize };
}

/**
 * Fetch single ticket with timeline and notes
 * GET /api/tickets/:id
 * 
 * @param {string} ticketId
 * @returns {Promise<Ticket & {timeline: TimelineEvent[], notes: Note[], attachments: any[]}>}
 */
export async function fetchTicket(ticketId) {
  await delay();
  
  const ticket = ticketsData.find(t => t.id === ticketId);
  
  if (!ticket) {
    throw new Error('Ticket not found');
  }
  
  // MOCK: Generate timeline and notes
  const timeline = [
    { 
      type: 'created', 
      user: 'System', 
      timestamp: ticket.createdAt, 
      description: 'Ticket oluşturuldu' 
    },
    { 
      type: 'assigned', 
      user: 'Admin', 
      timestamp: ticket.createdAt, 
      description: `${ticket.assignee} kullanıcısına atandı` 
    },
    { 
      type: 'status_change', 
      user: ticket.assignee, 
      timestamp: ticket.updatedAt, 
      description: `Durum güncellendi: ${ticket.status}` 
    },
  ];
  
  const notes = [
    { 
      id: '1', 
      body: 'Müşteri ile telefon görüşmesi yapıldı. Problem detayları netleştirildi.', 
      author: 'Ayşe Yılmaz', 
      createdAt: new Date(Date.now() - 86400000).toISOString() 
    },
    { 
      id: '2', 
      body: 'Teknik ekibe yönlendirildi. Bug raporu oluşturuldu.', 
      author: 'Can Özkan', 
      createdAt: new Date(Date.now() - 43200000).toISOString() 
    },
  ];
  
  const attachments = [
    { id: '1', name: 'screenshot.png', size: '245 KB', type: 'image', url: '#' },
    { id: '2', name: 'error_log.txt', size: '12 KB', type: 'text', url: '#' },
  ];
  
  // TODO: Replace with real API call
  // const response = await fetch(`${API_URL}/api/tickets/${ticketId}`);
  // return await response.json();
  
  return { ...ticket, timeline, notes, attachments };
}

/**
 * Add internal note to ticket
 * POST /api/tickets/:id/notes
 * 
 * @param {string} ticketId
 * @param {string} body
 * @returns {Promise<Note>}
 */
export async function addTicketNote(ticketId, body) {
  await delay(500);
  
  // MOCK: Create new note
  const note = {
    id: `note-${Date.now()}`,
    body,
    author: 'Ayşe Yılmaz', // Current user
    createdAt: new Date().toISOString(),
  };
  
  // TODO: Replace with real API call
  // const response = await fetch(`${API_URL}/api/tickets/${ticketId}/notes`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ body }),
  // });
  // return await response.json();
  
  return note;
}

/**
 * Generate AI summary for ticket
 * POST /api/ai/summary
 * 
 * @param {Ticket} ticket
 * @returns {Promise<{summary: string}>}
 */
export async function generateAISummary(ticket) {
  await delay(1500);
  
  // MOCK: Generate summary
  const summaries = [
    `Bu ticket, ${ticket.customer} tarafından ${ticket.priority === 'high' ? 'yüksek' : ticket.priority === 'medium' ? 'orta' : 'düşük'} öncelikli olarak açılmıştır. Konu "${ticket.subject}" başlığı altında raporlanmıştır. ${ticket.tags.join(', ')} kategorilerinde etiketlenmiştir. Şu anda ${ticket.assignee} tarafından işlenmektedir.`,
    `Özet: Müşteri ${ticket.customer}, ${ticket.subject} konusunda destek talebinde bulunmuştur. Ticket ${new Date(ticket.createdAt).toLocaleDateString('tr-TR')} tarihinde oluşturulmuştur ve ${ticket.status === 'open' ? 'henüz çözümlenmemiştir' : ticket.status === 'in-progress' ? 'çözüm sürecindedir' : 'çözümlenmiştir'}.`,
    `AI Analizi: Bu sorun ${ticket.tags.includes('technical') ? 'teknik bir problem' : 'müşteri hizmetleri meselesi'} olarak sınıflandırılmıştır. Önerilen çözüm süresi: ${ticket.priority === 'high' ? '2-4 saat' : ticket.priority === 'medium' ? '1-2 gün' : '3-5 gün'}. Benzer ticketlarda başarılı çözüm oranı: %87.`
  ];
  
  const summary = summaries[Math.floor(Math.random() * summaries.length)];
  
  // TODO: Replace with real API call
  // const response = await fetch(`${API_URL}/api/ai/summary`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ ticketId: ticket.id }),
  // });
  // return await response.json();
  
  return { summary };
}

/**
 * Generate AI draft reply for ticket
 * POST /api/ai/draft-reply
 * 
 * @param {Ticket} ticket
 * @returns {Promise<{draft: string}>}
 */
export async function generateDraftReply(ticket) {
  await delay(1500);
  
  // MOCK: Generate draft
  const replies = [
    `Merhaba ${ticket.customer},\n\nSorununuzu inceledik ve aşağıdaki adımları denemenizi öneriyoruz:\n\n1. Tarayıcı önbelleğinizi temizleyin\n2. Farklı bir tarayıcı ile tekrar deneyin\n3. VPN kullanıyorsanız kapatıp tekrar deneyin\n\nSorun devam ederse lütfen bize tekrar ulaşın.\n\nİyi günler,\n${ticket.assignee}`,
    `Sayın ${ticket.customer},\n\nBu konuda size yardımcı olmaktan memnuniyet duyarız. İlgili departmanımız konuyu incelemekte ve en kısa sürede size dönüş yapacaktır.\n\nOrtalama yanıt süremiz 24 saat olup, acil durumlar için öncelik verilmektedir.\n\nAnlayışınız için teşekkür ederiz.\n\nSaygılarımızla,\n${ticket.assignee}`,
    `Merhaba,\n\nBildiriminiz için teşekkür ederiz. Sorununuzu analiz ettik ve çözüm için gerekli işlemleri başlattık.\n\nGüncelleme: ${ticket.status === 'open' ? 'Ekibimiz konuyu incelemekte' : 'Çözüm sürecindeyiz'}.\n\nBaşka bir sorunuz olursa lütfen çekinmeden iletişime geçin.\n\nİyi çalışmalar,\n${ticket.assignee}`
  ];
  
  const draft = replies[Math.floor(Math.random() * replies.length)];
  
  // TODO: Replace with real API call
  // const response = await fetch(`${API_URL}/api/ai/draft-reply`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ ticketId: ticket.id }),
  // });
  // return await response.json();
  
  return { draft };
}

/**
 * Fetch all customers
 * GET /api/customers
 * 
 * @param {Object} params
 * @param {string} [params.query]
 * @returns {Promise<{items: Customer[], total: number}>}
 */
export async function fetchCustomers(params = {}) {
  await delay();
  
  let filtered = [...customersData];
  
  if (params.query) {
    const query = params.query.toLowerCase();
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.company.toLowerCase().includes(query)
    );
  }
  
  // TODO: Replace with real API call
  // const response = await fetch(`${API_URL}/api/customers?${new URLSearchParams(params)}`);
  // return await response.json();
  
  return { items: filtered, total: filtered.length };
}

/**
 * Fetch single customer with ticket history
 * GET /api/customers/:id
 * 
 * @param {string} customerId
 * @returns {Promise<Customer & {tickets: Ticket[]}>}
 */
export async function fetchCustomer(customerId) {
  await delay();
  
  const customer = customersData.find(c => c.id === customerId);
  
  if (!customer) {
    throw new Error('Customer not found');
  }
  
  // MOCK: Get customer's tickets
  const tickets = ticketsData.filter(t => t.customerId === customerId);
  
  // TODO: Replace with real API call
  // const response = await fetch(`${API_URL}/api/customers/${customerId}`);
  // return await response.json();
  
  return { ...customer, tickets };
}

/**
 * Fetch dashboard statistics
 * GET /api/dashboard/stats
 * 
 * @returns {Promise<{openTickets: number, resolvedToday: number, avgResponseTime: string, satisfactionRate: string}>}
 */
export async function fetchDashboardStats() {
  await delay();
  
  // MOCK: Calculate stats
  const openTickets = ticketsData.filter(t => t.status === 'open').length;
  const resolvedToday = ticketsData.filter(t => {
    if (t.status === 'resolved' && t.resolvedAt) {
      const resolvedDate = new Date(t.resolvedAt);
      const today = new Date();
      return resolvedDate.toDateString() === today.toDateString();
    }
    return false;
  }).length;
  
  // TODO: Replace with real API call
  // const response = await fetch(`${API_URL}/api/dashboard/stats`);
  // return await response.json();
  
  return {
    openTickets,
    resolvedToday,
    avgResponseTime: '12 dk',
    satisfactionRate: '94%',
  };
}

/**
 * Fetch recent tickets for dashboard
 * GET /api/dashboard/recent-tickets
 * 
 * @param {number} limit
 * @returns {Promise<Ticket[]>}
 */
export async function fetchRecentTickets(limit = 5) {
  await delay();
  
  // MOCK: Get recent tickets
  const recent = [...ticketsData]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, limit);
  
  // TODO: Replace with real API call
  // const response = await fetch(`${API_URL}/api/dashboard/recent-tickets?limit=${limit}`);
  // return await response.json();
  
  return recent;
}
