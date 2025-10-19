import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Select, SelectOption } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { DataTable } from '../components/custom/DataTable';
import { StatusPill } from '../components/custom/StatusPill';
import { PriorityBadge } from '../components/custom/PriorityBadge';
import { TagBadge } from '../components/custom/TagBadge';
import { EmptyState } from '../components/custom/EmptyState';
import { formatRelativeTime } from '../lib/utils';
import { fetchTickets } from '../lib/api';
import { Ticket } from 'lucide-react';

// Fuzzy search function
const fuzzySearch = (str, pattern) => {
  if (!pattern) return true;
  pattern = pattern.toLowerCase();
  str = str.toLowerCase();
  
  let patternIdx = 0;
  let strIdx = 0;
  
  while (patternIdx < pattern.length && strIdx < str.length) {
    if (pattern[patternIdx] === str[strIdx]) {
      patternIdx++;
    }
    strIdx++;
  }
  
  return patternIdx === pattern.length;
};

export default function Tickets() {
  const [searchParams] = useSearchParams();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  // Get unique assignees and tags for filters
  const uniqueAssignees = [...new Set(tickets.map(t => t.assignee))];
  const uniqueTags = [...new Set(tickets.flatMap(t => t.tags))];

  useEffect(() => {
    // Load tickets from API with filters
    const loadTickets = async () => {
      try {
        setLoading(true);
        
        const params = {};
        if (searchTerm) params.query = searchTerm;
        if (statusFilter !== 'all') params.status = statusFilter;
        if (priorityFilter !== 'all') params.priority = priorityFilter;
        if (assigneeFilter !== 'all') params.assignee = assigneeFilter;
        if (tagFilter !== 'all') params.tag = tagFilter;
        
        const response = await fetchTickets(params);
        setTickets(response.items);
        setFilteredTickets(response.items);
        setTotalCount(response.total);
        
        // Count active filters
        let filtersCount = 0;
        if (searchTerm) filtersCount++;
        if (statusFilter !== 'all') filtersCount++;
        if (priorityFilter !== 'all') filtersCount++;
        if (assigneeFilter !== 'all') filtersCount++;
        if (tagFilter !== 'all') filtersCount++;
        setActiveFiltersCount(filtersCount);
      } catch (error) {
        console.error('Failed to load tickets:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadTickets();
  }, [searchTerm, statusFilter, priorityFilter, assigneeFilter, tagFilter]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setAssigneeFilter('all');
    setTagFilter('all');
  };

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
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ticket ara... (fuzzy search)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              aria-label="Ticket arama"
            />
          </div>
          <Select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Durum filtresi"
          >
            <SelectOption value="all">Tüm Durumlar</SelectOption>
            <SelectOption value="open">Açık</SelectOption>
            <SelectOption value="in-progress">İşleniyor</SelectOption>
            <SelectOption value="resolved">Çözüldü</SelectOption>
          </Select>
          <Select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
            aria-label="Öncelik filtresi"
          >
            <SelectOption value="all">Tüm Öncelikler</SelectOption>
            <SelectOption value="high">Yüksek</SelectOption>
            <SelectOption value="medium">Orta</SelectOption>
            <SelectOption value="low">Düşük</SelectOption>
          </Select>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Select 
            value={assigneeFilter} 
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="flex-1"
            aria-label="Atanan kişi filtresi"
          >
            <SelectOption value="all">Tüm Atananlar</SelectOption>
            {uniqueAssignees.map((assignee) => (
              <SelectOption key={assignee} value={assignee}>
                {assignee}
              </SelectOption>
            ))}
          </Select>
          
          <Select 
            value={tagFilter} 
            onChange={(e) => setTagFilter(e.target.value)}
            className="flex-1"
            aria-label="Etiket filtresi"
          >
            <SelectOption value="all">Tüm Etiketler</SelectOption>
            {uniqueTags.map((tag) => (
              <SelectOption key={tag} value={tag}>
                {tag}
              </SelectOption>
            ))}
          </Select>
          
          {activeFiltersCount > 0 && (
            <Button 
              variant="outline" 
              onClick={clearAllFilters}
              aria-label="Filtreleri temizle"
            >
              <X className="mr-2 h-4 w-4" />
              Temizle ({activeFiltersCount})
            </Button>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>{filteredTickets.length} sonuç bulundu</span>
          </div>
        )}
      </div>

      {/* Table */}
      <DataTable
        data={filteredTickets}
        columns={columns}
        pageSize={25}
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
