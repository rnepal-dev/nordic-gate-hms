import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { AdminPageHeader } from '../../../../components/admin/AdminPageHeader';
import { TableToolbar } from '../../../../components/admin/TableToolbar';
import { AdminDataTable, Column } from '../../../../components/admin/AdminDataTable';
import { Pagination } from '../../../../components/admin/Pagination';
import { Button } from '../../../../components/ui/Button';
import { Drawer } from '../../../../components/ui/Drawer';
import { useToast } from '../../../../components/ui/Toast';
import { NightlyRateForm } from './NightlyRateForm';
import {
  useGetNightlyRatesQuery,
  useGetRatePlansQuery,
  useCreateNightlyRateMutation,
  useUpdateNightlyRateMutation,
} from '../../../../redux/feature/pricing/pricingApi';
import type { 
  NightlyRate, 
  NightlyRatePayload, 
  RatePlan 
} from '../../../../redux/feature/pricing/pricingTypes';
import { loadRoomTypes } from '../../../../data/adminMockData';
import { formatSEK } from '../../../../lib/pricing';

export const NightlyRateListView: React.FC = () => {
  const { showToast } = useToast();

  // Rate plans and room types for dropdowns
  const { data: ratePlans = [] } = useGetRatePlansQuery();
  const roomTypes = useMemo(() => loadRoomTypes(), []);

  // Filter state
  const [selectedRoomTypeFilter, setSelectedRoomTypeFilter] = useState<string>('all');
  const [selectedRatePlanFilter, setSelectedRatePlanFilter] = useState<string>('all');
  const [searchValue, setSearchValue] = useState<string>('');

  // Sorting and Pagination
  const [sortColumn, setSortColumn] = useState<string>('stay_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Queries & Mutations
  const queryParams = useMemo(() => {
    return {
      ...(selectedRoomTypeFilter !== 'all' ? { room_type: Number(selectedRoomTypeFilter) } : {}),
      ...(selectedRatePlanFilter !== 'all' ? { rate_plan: Number(selectedRatePlanFilter) } : {}),
    };
  }, [selectedRoomTypeFilter, selectedRatePlanFilter]);

  const {
    data: nightlyRates = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetNightlyRatesQuery(queryParams);

  const [createNightlyRateMutation, { isLoading: isCreating }] = useCreateNightlyRateMutation();
  const [updateNightlyRateMutation, { isLoading: isUpdating }] = useUpdateNightlyRateMutation();

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedRate, setSelectedRate] = useState<NightlyRate | null>(null);

  // Client-side text search filter
  const filteredRates = useMemo(() => {
    return nightlyRates.filter((item) => {
      if (searchValue.trim()) {
        const q = searchValue.toLowerCase();
        const matches =
          item.stay_date.includes(q) ||
          item.room_type_name.toLowerCase().includes(q) ||
          item.rate_plan_name.toLowerCase().includes(q) ||
          item.price.includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [nightlyRates, searchValue]);

  // Sorted list
  const sortedRates = useMemo(() => {
    const list = [...filteredRates];
    list.sort((a, b) => {
      let valA: any = a[sortColumn as keyof NightlyRate];
      let valB: any = b[sortColumn as keyof NightlyRate];

      if (sortColumn === 'price') {
        valA = parseFloat(a.price);
        valB = parseFloat(b.price);
      }

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB as string).toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [filteredRates, sortColumn, sortDirection]);

  // Paginated list
  const totalPages = Math.max(1, Math.ceil(sortedRates.length / pageSize));
  const paginatedRates = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRates.slice(start, start + pageSize);
  }, [sortedRates, currentPage, pageSize]);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleOpenCreate = () => {
    setSelectedRate(null);
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  const handleOpenEdit = (rate: NightlyRate) => {
    setSelectedRate(rate);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleOpenView = (rate: NightlyRate) => {
    setSelectedRate(rate);
    setDrawerMode('view');
    setDrawerOpen(true);
  };

  const handleFormSubmit = async (data: NightlyRatePayload) => {
    try {
      if (drawerMode === 'create') {
        await createNightlyRateMutation(data).unwrap();
        showToast({
          title: 'Nightly Rate Created',
          message: `Nightly rate for ${data.stay_date} (${data.price} ${data.currency}) created successfully.`,
          type: 'success',
        });
      } else if (drawerMode === 'edit' && selectedRate) {
        await updateNightlyRateMutation({ id: selectedRate.id, data }).unwrap();
        showToast({
          title: 'Nightly Rate Updated',
          message: `Nightly rate #${selectedRate.id} updated to ${data.price} ${data.currency}.`,
          type: 'success',
        });
      }
      setDrawerOpen(false);
      refetch();
    } catch (err: any) {
      showToast({
        title: 'Error Saving Nightly Rate',
        message: err?.data?.detail || err?.message || 'A network error occurred.',
        type: 'error',
      });
    }
  };

  const columns: Column<NightlyRate>[] = [
    {
      key: 'stay_date',
      header: 'Stay Date',
      sortable: true,
      render: (rate) => {
        const d = new Date(rate.stay_date);
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        const isWeekend = d.getUTCDay() === 5 || d.getUTCDay() === 6;

        return (
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex flex-col items-center justify-center font-mono text-[10px] font-bold border ${
              isWeekend 
                ? 'bg-amber-50 text-amber-900 border-amber-300' 
                : 'bg-stone-50 text-[#0D1A26] border-stone-200'
            }`}>
              <span>{dayName}</span>
              <span className="text-[9px] text-[#BF8641]">{rate.stay_date.slice(8)}</span>
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-[#0D1A26] block">
                {rate.stay_date}
              </span>
              <span className="text-[10px] text-[#5D6B78]">
                {isWeekend ? 'Weekend Yield' : 'Midweek Standard'}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: 'room_type_name',
      header: 'Room Type',
      sortable: true,
      render: (rate) => (
        <div>
          <span className="text-xs font-bold text-[#0D1A26] block">
            {rate.room_type_name}
          </span>
          <span className="text-[10px] text-[#5D6B78] font-mono">
            Room Type ID #{rate.room_type}
          </span>
        </div>
      ),
    },
    {
      key: 'rate_plan_name',
      header: 'Rate Plan',
      sortable: true,
      render: (rate) => (
        <div>
          <span className="text-xs font-semibold text-[#0D1A26] block">
            {rate.rate_plan_name}
          </span>
          <span className="text-[10px] text-[#5D6B78] font-mono">
            Plan ID #{rate.rate_plan}
          </span>
        </div>
      ),
    },
    {
      key: 'price',
      header: 'Price / Currency',
      sortable: true,
      render: (rate) => (
        <div className="space-y-0.5">
          <span className="font-mono text-xs font-bold text-[#0D1A26]">
            {formatSEK(parseFloat(rate.price))}
          </span>
          <span className="block text-[10px] text-stone-500 font-mono">
            {rate.price} {rate.currency}
          </span>
        </div>
      ),
    },
    {
      key: 'minimum_stay',
      header: 'Min Stay',
      sortable: true,
      render: (rate) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-100 text-[#0D1A26] border border-stone-200">
          {rate.minimum_stay} {rate.minimum_stay > 1 ? 'nights' : 'night'}
        </span>
      ),
    },
    {
      key: 'restrictions',
      header: 'CTA / CTD Restrictions',
      render: (rate) => {
        const hasCta = rate.is_closed_to_arrival;
        const hasCtd = rate.is_closed_to_departure;

        if (!hasCta && !hasCtd) {
          return (
            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Open</span>
            </span>
          );
        }

        return (
          <div className="flex items-center gap-1.5">
            {hasCta && (
              <span
                title="Closed to Arrival"
                className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-200"
              >
                CTA
              </span>
            )}
            {hasCtd && (
              <span
                title="Closed to Departure"
                className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-200"
              >
                CTD
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      headerClassName: 'text-right',
      render: (rate) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenView(rate);
            }}
            title="View Details"
            className="p-1.5 text-stone-600 hover:text-[#0D1A26] hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEdit(rate);
            }}
            title="Edit Nightly Rate"
            className="p-1.5 text-[#BF8641] hover:text-[#8C5F27] hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        title="Nightly Rates"
        subtitle="Manage calendar-specific nightly prices, minimum length of stay, and CTA/CTD restrictions."
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />}
            >
              Sync
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenCreate}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create Nightly Rate
            </Button>
          </div>
        }
      />

      {/* Toolbar */}
      <TableToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search rates by date (YYYY-MM-DD), room, or plan..."
        categoryFilter={{
          label: 'Room Type',
          value: selectedRoomTypeFilter,
          options: [
            { value: 'all', label: 'All Room Types' },
            ...roomTypes.map((rt) => ({
              value: rt.id.toString(),
              label: rt.name,
            })),
          ],
          onChange: setSelectedRoomTypeFilter,
        }}
        statusFilter={{
          value: selectedRatePlanFilter,
          options: [
            { value: 'all', label: 'All Rate Plans' },
            ...ratePlans.map((rp) => ({
              value: rp.id.toString(),
              label: `${rp.name} (${rp.code})`,
            })),
          ],
          onChange: setSelectedRatePlanFilter,
        }}
        hasActiveFilters={selectedRoomTypeFilter !== 'all' || selectedRatePlanFilter !== 'all'}
        onResetFilters={() => {
          setSearchValue('');
          setSelectedRoomTypeFilter('all');
          setSelectedRatePlanFilter('all');
        }}
      />

      {/* Data Table */}
      <AdminDataTable<NightlyRate>
        columns={columns}
        data={paginatedRates}
        keyExtractor={(item) => item.id.toString()}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        isLoading={isLoading}
        emptyState={{
          title: 'No Nightly Rates Configured',
          description: 'No nightly pricing rules match your active filters. Click "Create Nightly Rate" to add custom date pricing.',
        }}
      />

      {/* Pagination */}
      {!isLoading && filteredRates.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredRates.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      )}

      {/* Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={
          drawerMode === 'create'
            ? 'Create Nightly Rate'
            : drawerMode === 'edit'
            ? `Edit Nightly Rate #${selectedRate?.id} (${selectedRate?.stay_date})`
            : `Nightly Rate Details #${selectedRate?.id}`
        }
        description={
          drawerMode === 'view'
            ? 'Inspect calendar pricing metadata and yield constraints.'
            : 'Configure date-specific room rates, minimum stays, and arrival/departure locks.'
        }
      >
        <NightlyRateForm
          initialData={selectedRate}
          ratePlans={ratePlans}
          onSubmit={handleFormSubmit}
          onCancel={() => setDrawerOpen(false)}
          isLoading={isCreating || isUpdating}
          isViewOnly={drawerMode === 'view'}
        />
      </Drawer>
    </div>
  );
};
