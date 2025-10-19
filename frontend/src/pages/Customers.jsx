import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mail, Building, Calendar } from 'lucide-react';
import { Input } from '../components/ui/input';
import { DataTable } from '../components/custom/DataTable';
import { Badge } from '../components/ui/badge';
import { EmptyState } from '../components/custom/EmptyState';
import { formatDate } from '../lib/utils';
import { fetchCustomers } from '../lib/api';
import { Users } from 'lucide-react';

export default function Customers() {
  const [customers, setCustomers] = useState(customersData);
  const [filteredCustomers, setFilteredCustomers] = useState(customersData);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm) {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchTerm, customers]);

  const getPlanBadgeVariant = (plan) => {
    if (plan === 'Enterprise') return 'default';
    if (plan === 'Pro') return 'secondary';
    return 'outline';
  };

  const columns = [
    {
      header: 'Müşteri',
      accessorKey: 'name',
      cell: (row) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Mail className="h-3 w-3" />
            {row.email}
          </div>
        </div>
      ),
    },
    {
      header: 'Şirket',
      accessorKey: 'company',
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.company ? (
            <>
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{row.company}</span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          )}
        </div>
      ),
    },
    {
      header: 'Plan',
      accessorKey: 'plan',
      cell: (row) => (
        <Badge variant={getPlanBadgeVariant(row.plan)}>
          {row.plan}
        </Badge>
      ),
    },
    {
      header: 'Ticketlar',
      accessorKey: 'totalTickets',
      cell: (row) => (
        <div className="text-sm">
          <span className="font-medium">{row.totalTickets}</span>
          <span className="text-muted-foreground"> toplam</span>
          {row.openTickets > 0 && (
            <span className="ml-2 text-warning">({row.openTickets} açık)</span>
          )}
        </div>
      ),
    },
    {
      header: 'Kayıt Tarihi',
      accessorKey: 'joinedAt',
      cell: (row) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {formatDate(row.joinedAt)}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Müşteriler</h1>
        <p className="text-muted-foreground mt-1">
          Müşteri bilgilerini görüntüleyin ve yönetin
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Müşteri ara... (isim, email, şirket)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <DataTable
        data={filteredCustomers}
        columns={columns}
        pageSize={15}
        onRowClick={(row) => navigate(`/customers/${row.id}`)}
        emptyState={
          <EmptyState
            icon={Users}
            title="Hiçbir müşteri bulunamadı"
            description="Arama kriterlerinize uygun müşteri bulunamadı."
          />
        }
      />
    </div>
  );
}
