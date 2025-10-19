import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Building, Calendar, Ticket } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { formatDate, formatRelativeTime } from '../lib/utils';
import customersData from '../lib/mock/customers.json';
import ticketsData from '../lib/mock/tickets.json';
import { StatusPill } from '../components/custom/StatusPill';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [customerTickets, setCustomerTickets] = useState([]);

  useEffect(() => {
    const foundCustomer = customersData.find(c => c.id === id);
    if (foundCustomer) {
      setCustomer(foundCustomer);
      const tickets = ticketsData.filter(t => t.customerId === id);
      setCustomerTickets(tickets);
    } else {
      navigate('/customers');
    }
  }, [id, navigate]);

  if (!customer) {
    return <div>Yüklenyor...</div>;
  }

  const getPlanBadgeVariant = (plan) => {
    if (plan === 'Enterprise') return 'default';
    if (plan === 'Pro') return 'secondary';
    return 'outline';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Link to="/customers">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{customer.name}</h1>
            <Badge variant={getPlanBadgeVariant(customer.plan)}>
              {customer.plan}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <Mail className="h-4 w-4" />
            <span>{customer.email}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Müşteri Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {customer.company && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Şirket</p>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{customer.company}</p>
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Durum</p>
                <Badge variant="success">Aktif</Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Kayıt Tarihi</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{formatDate(customer.joinedAt)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Son Aktivite</p>
                <p className="text-sm">{formatRelativeTime(customer.lastActivity)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ticket İstatistikleri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Toplam Ticket</span>
                <span className="text-lg font-bold">{customer.totalTickets}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Açık Ticket</span>
                <span className="text-lg font-bold text-warning">{customer.openTickets}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Çözülmüş</span>
                <span className="text-lg font-bold text-success">
                  {customer.totalTickets - customer.openTickets}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tickets History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Geçmişi</CardTitle>
            </CardHeader>
            <CardContent>
              {customerTickets.length > 0 ? (
                <div className="space-y-3">
                  {customerTickets.map((ticket) => (
                    <Link
                      key={ticket.id}
                      to={`/tickets/${ticket.id}`}
                      className="block p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm text-primary">
                              {ticket.id}
                            </span>
                            <StatusPill status={ticket.status} />
                          </div>
                          <p className="text-sm font-medium mb-1">{ticket.subject}</p>
                          <p className="text-xs text-muted-foreground">
                            {ticket.assignee} • {formatRelativeTime(ticket.updatedAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Bu müşteriye ait hiçbir ticket yok
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
