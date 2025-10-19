import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Select, SelectOption } from '../components/ui/select';
import { DataTable } from '../components/custom/DataTable';
import { StatusPill } from '../components/custom/StatusPill';
import { PriorityBadge } from '../components/custom/PriorityBadge';
import { TagBadge } from '../components/custom/TagBadge';
import { EmptyState } from '../components/custom/EmptyState';
import { formatRelativeTime } from '../lib/utils';
import ticketsData from '../lib/mock/tickets.json';
import { Ticket } from 'lucide-react';

export default function Tickets() {
  const [tickets, setTickets] = useState(ticketsData);
  const [filteredTickets, setFilteredTickets] = useState(ticketsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    let filtered = [...tickets];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    setFilteredTickets(filtered);
  }, [searchTerm, statusFilter, priorityFilter, tickets]);

  const columns = [
    {
      header: 'Ticket ID',
      accessorKey: 'id',
      cell: (row) => (
        <span className="font-medium text-primary">{row.id}</span>
      ),
    },
    {
      header: 'Konu',
      accessorKey: 'subject',
      cell: (row) => (
        <div className="max-w-md">
          <div className="font-medium">{row.subject}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {row.customer}
          </div>
        </div>
      ),
    },
    {
      header: 'Durum',
      accessorKey: 'status',
      cell: (row) => <StatusPill status={row.status} />,
    },
    {
      header: 'Öncelik',
      accessorKey: 'priority',
      cell: (row) => <PriorityBadge priority={row.priority} />,
    },
    {
      header: 'Atanan',
      accessorKey: 'assignee',
      cell: (row) => (
        <span className="text-sm">{row.assignee}</span>
      ),
    },
    {
      header: 'Etiketler',
      accessorKey: 'tags',
      cell: (row) => (
        <div className="flex gap-1 flex-wrap">
          {row.tags.slice(0, 2).map((tag, idx) => (
            <TagBadge key={idx} tag={tag} />
          ))}
        </div>
      ),
    },
    {
      header: 'Güncelleme',
      accessorKey: 'updatedAt',
      cell: (row) => (
        <span className="text-sm text-muted-foreground">
          {formatRelativeTime(row.updatedAt)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ticketlar</h1>
        <p className="text-muted-foreground mt-1">
          Tüm destek taleplerini yönetin
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Ticket ara... (ID, konu, müşteri)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <SelectOption value="all">Tüm Durumlar</SelectOption>
          <SelectOption value="open">Açık</SelectOption>
          <SelectOption value="in-progress">İşleniyor</SelectOption>
          <SelectOption value="resolved">Çözüldü</SelectOption>
        </Select>
        <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <SelectOption value="all">Tüm Öncelikler</SelectOption>
          <SelectOption value="high">Yüksek</SelectOption>
          <SelectOption value="medium">Orta</SelectOption>
          <SelectOption value="low">Düşük</SelectOption>
        </Select>
      </div>

      {/* Table */}
      <DataTable
        data={filteredTickets}
        columns={columns}
        pageSize={10}
        onRowClick={(row) => navigate(`/tickets/${row.id}`)}
        emptyState={
          <EmptyState
            icon={Ticket}
            title="Hiçbir ticket bulunamadı"
            description="Arama kriterlerinize uygun ticket bulunamadı. Filtreleri değiştirmeyi deneyin."
          />
        }
      />
    </div>
  );
}
