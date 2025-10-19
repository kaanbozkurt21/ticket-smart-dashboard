import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { 
  TicketCheck, 
  TicketX, 
  TrendingUp, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import ticketsData from '../lib/mock/tickets.json';

const chartData = [
  { name: 'Pzt', tickets: 12 },
  { name: 'Sal', tickets: 19 },
  { name: 'Çar', tickets: 15 },
  { name: 'Per', tickets: 25 },
  { name: 'Cum', tickets: 22 },
  { name: 'Cmt', tickets: 8 },
  { name: 'Paz', tickets: 5 },
];

const responseTimeData = [
  { time: '09:00', avgTime: 12 },
  { time: '12:00', avgTime: 8 },
  { time: '15:00', avgTime: 15 },
  { time: '18:00', avgTime: 10 },
  { time: '21:00', avgTime: 6 },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    openTickets: 0,
    resolvedToday: 0,
    avgResponseTime: '12 dk',
    satisfactionRate: '94%',
  });

  const [recentTickets, setRecentTickets] = useState([]);

  useEffect(() => {
    // Calculate stats from mock data
    const openCount = ticketsData.filter(t => t.status === 'open').length;
    const resolvedToday = ticketsData.filter(t => {
      if (t.status === 'resolved' && t.resolvedAt) {
        const resolvedDate = new Date(t.resolvedAt);
        const today = new Date();
        return resolvedDate.toDateString() === today.toDateString();
      }
      return false;
    }).length;

    setStats({
      openTickets: openCount,
      resolvedToday,
      avgResponseTime: '12 dk',
      satisfactionRate: '94%',
    });

    // Get 5 most recent tickets
    const recent = [...ticketsData]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);
    setRecentTickets(recent);
  }, []);

  const statCards = [
    {
      title: 'Açık Ticketlar',
      value: stats.openTickets,
      icon: TicketX,
      trend: '+2 bugün',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Bugün Çözülen',
      value: stats.resolvedToday,
      icon: TicketCheck,
      trend: '+12%',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'Ort. Yanıt Süresi',
      value: stats.avgResponseTime,
      icon: Clock,
      trend: '-3 dk',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Memnuniyet Oranı',
      value: stats.satisfactionRate,
      icon: TrendingUp,
      trend: '+2%',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Müşteri destek sistemine genel bakış
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} ${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.trend} geçen haftaya göre
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Haftalık Ticket Trendi</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Bar dataKey="tickets" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ortalama Yanıt Süresi (dk)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="avgTime" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--accent))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tickets */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Son Ticketlar</CardTitle>
          <Link to="/tickets">
            <Button variant="ghost" size="sm">
              Tümünü Gör <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTickets.map((ticket) => (
              <Link 
                key={ticket.id} 
                to={`/tickets/${ticket.id}`}
                className="flex items-start gap-4 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{ticket.subject}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {ticket.customer} • {new Date(ticket.updatedAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    ticket.status === 'open' ? 'bg-warning/10 text-warning' :
                    ticket.status === 'in-progress' ? 'bg-primary/10 text-primary' :
                    'bg-success/10 text-success'
                  }`}>
                    {ticket.status === 'open' ? 'Açık' : 
                     ticket.status === 'in-progress' ? 'İşleniyor' : 'Çözüldü'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
