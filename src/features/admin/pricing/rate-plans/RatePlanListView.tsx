import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Eye,
  ShieldCheck,
  Coffee,
  Waves,
  CheckCircle2,
  XCircle,
  Tag,
  Bed,
  RefreshCw,
} from 'lucide-react';
import { AdminPageHeader } from '../../../../components/admin/AdminPageHeader';
import { TableToolbar } from '../../../../components/admin/TableToolbar';
import { AdminDataTable, Column } from '../../../../components/admin/AdminDataTable';
import { Pagination } from '../../../../components/admin/Pagination';
import { Button } from '../../../../components/ui/Button';
import { Drawer } from '../../../../components/ui/Drawer';
import { useToast } from '../../../../components/ui/Toast';
import { RatePlanForm } from './RatePlanForm';
import {
  useGetRatePlansQuery,
  useCreateRatePlanMutation,
  useUpdateRatePlanMutation,
} from '../../../../redux/feature/pricing/pricingApi';
import type { RatePlan, RatePlanPayload } from '../../../../redux/feature/pricing/pricingTypes';
import { loadRoomTypes } from '../../../../data/adminMockData';

export const RatePlanListView: React.FC = () => {
  const { showToast } = useToast();

  // Queries & Mutations
  const {
    data: ratePlans = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetRatePlansQuery();

  const [createRatePlanMutation, { isLoading: isCreating }] = useCreateRatePlanMutation();
  const [updateRatePlanMutation, { isLoading: isUpdating }] = useUpdateRatePlanMutation();

  // Search & Filter state
  const [searchValue, setSearchValue] = useState('');
  const [policyFilter, setPolicyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedRatePlan, setSelectedRatePlan] = useState<RatePlan | null>(null);

  // Room Types lookup map
  const roomTypes = useMemo(() => loadRoomTypes(), []);
  const roomTypeMap = useMemo(() => {
    return new Map(roomTypes.map((r) => [r.id, r.name]));
  }, [roomTypes]);

  // Filtered List
  const filteredPlans = useMemo(() => {
    return ratePlans.filter((plan) => {
      if (searchValue.trim()) {
        const q = searchValue.toLowerCase();
        const matches =
          plan.name.toLowerCase().includes(q) ||
          plan.code.toLowerCase().includes(q) ||
          (plan.description && plan.description.toLowerCase().includes(q));
        if (!matches) return false;
      }

      if (policyFilter !== 'all' && plan.cancellation_policy !== policyFilter) {
        return false;
      }

      if (statusFilter === 'active' && !plan.is_active) return false;
      if (statusFilter === 'inactive' && plan.is_active) return false;

      return true;
    });
  }, [ratePlans, searchValue, policyFilter, statusFilter]);

  // Sorted List
  const sortedPlans = useMemo(() => {
    const list = [...filteredPlans];
    list.sort((a, b) => {
      let valA: any = a[sortColumn as keyof RatePlan];
      let valB: any = b[sortColumn as keyof RatePlan];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB as string).toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [filteredPlans, sortColumn, sortDirection]);

  // Paginated List
  const totalPages = Math.max(1, Math.ceil(sortedPlans.length / pageSize));
  const paginatedPlans = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedPlans.slice(start, start + pageSize);
  }, [sortedPlans, currentPage, pageSize]);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleOpenCreate = () => {
    setSelectedRatePlan(null);
    setDrawerMode('create');
    setDrawerOpen(true);
  };

  const handleOpenEdit = (plan: RatePlan) => {
    setSelectedRatePlan(plan);
    setDrawerMode('edit');
    setDrawerOpen(true);
  };

  const handleOpenView = (plan: RatePlan) => {
    setSelectedRatePlan(plan);
    setDrawerMode('view');
    setDrawerOpen(true);
  };

  const handleFormSubmit = async (data: RatePlanPayload) => {
    try {
      if (drawerMode === 'create') {
        await createRatePlanMutation(data).unwrap();
        showToast({
          title: 'Rate Plan Created',
          message: `Rate plan "${data.name}" has been published successfully.`,
          type: 'success',
        });
      } else if (drawerMode === 'edit' && selectedRatePlan) {
        await updateRatePlanMutation({ id: selectedRatePlan.id, data }).unwrap();
        showToast({
          title: 'Rate Plan Updated',
          message: `Rate plan "${data.name}" has been updated successfully.`,
          type: 'success',
        });
      }
      setDrawerOpen(false);
      refetch();
    } catch (err: any) {
      showToast({
        title: 'Error Saving Rate Plan',
        message: err?.data?.detail || err?.message || 'A network error occurred.',
        type: 'error',
      });
    }
  };

  const columns: Column<RatePlan>[] = [
    {
      key: 'name',
      header: 'Rate Plan Name & Code',
      sortable: true,
      render: (plan) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-[#0D1A26]">{plan.name}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EDE7DC] text-[#0D1A26] border border-[#D3C8B9]">
              {plan.code}
            </span>
          </div>
          {plan.description && (
            <p className="text-[11px] text-[#5D6B78] line-clamp-1 max-w-sm">
              {plan.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'cancellation_policy',
      header: 'Cancellation Policy',
      sortable: true,
      render: (plan) => (
        <div className="space-y-0.5">
          {plan.cancellation_policy === 'flexible' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Flexible ({plan.free_cancellation_deadline_hours || 24}h)</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
              <span>Non-Refundable</span>
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'room_types',
      header: 'Applicable Room Types',
      render: (plan) => {
        const linkedRooms = plan.room_types || [];
        if (linkedRooms.length === 0) {
          return <span className="text-[11px] text-amber-700 font-medium">None linked</span>;
        }
        if (linkedRooms.length >= 5) {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-900 text-[11px] font-medium border border-amber-200">
              <Bed className="w-3 h-3 text-[#BF8641]" />
              <span>All Room Types ({linkedRooms.length})</span>
            </span>
          );
        }
        return (
          <div className="flex flex-wrap gap-1 max-w-xs">
            {linkedRooms.map((id) => (
              <span
                key={id}
                className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-[#0D1A26] font-medium border border-stone-200"
              >
                {roomTypeMap.get(id) || `#${id}`}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      key: 'inclusions',
      header: 'Inclusions',
      render: (plan) => (
        <div className="flex items-center gap-2 text-xs">
          <span
            title={plan.breakfast_included ? 'Breakfast buffet included' : 'No breakfast'}
            className={`flex items-center gap-0.5 text-[11px] font-semibold ${
              plan.breakfast_included ? 'text-emerald-700' : 'text-stone-400 line-through'
            }`}
          >
            <Coffee className="w-3 h-3" />
            <span>Breakfast</span>
          </span>
          <span className="text-stone-300">·</span>
          <span
            title={plan.pool_included ? 'Pool & sauna access included' : 'No pool access'}
            className={`flex items-center gap-0.5 text-[11px] font-semibold ${
              plan.pool_included ? 'text-emerald-700' : 'text-stone-400 line-through'
            }`}
          >
            <Waves className="w-3 h-3" />
            <span>Pool</span>
          </span>
        </div>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      sortable: true,
      render: (plan) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
            plan.is_active
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              : 'bg-stone-200 text-stone-700'
          }`}
        >
          {plan.is_active ? (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Active</span>
            </>
          ) : (
            <>
              <XCircle className="w-3 h-3 text-stone-500" />
              <span>Inactive</span>
            </>
          )}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right',
      headerClassName: 'text-right',
      render: (plan) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenView(plan);
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
              handleOpenEdit(plan);
            }}
            title="Edit Rate Plan"
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
        title="Rate Plans"
        subtitle="Configure pricing packages, meal plans, cancellation policies, and room applicability."
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
              Create Rate Plan
            </Button>
          </div>
        }
      />

      {/* Toolbar */}
      <TableToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search rate plans by name, code, description..."
        categoryFilter={{
          label: 'Cancellation Policy',
          value: policyFilter,
          options: [
            { value: 'all', label: 'All Policies' },
            { value: 'flexible', label: 'Flexible' },
            { value: 'non_refundable', label: 'Non-Refundable' },
          ],
          onChange: setPolicyFilter,
        }}
        statusFilter={{
          value: statusFilter,
          options: [
            { value: 'all', label: 'All Statuses' },
            { value: 'active', label: 'Active Only' },
            { value: 'inactive', label: 'Inactive Only' },
          ],
          onChange: setStatusFilter,
        }}
        hasActiveFilters={policyFilter !== 'all' || statusFilter !== 'all'}
        onResetFilters={() => {
          setSearchValue('');
          setPolicyFilter('all');
          setStatusFilter('all');
        }}
      />

      {/* Data Table */}
      <AdminDataTable<RatePlan>
        columns={columns}
        data={paginatedPlans}
        keyExtractor={(item) => item.id.toString()}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        isLoading={isLoading}
        emptyState={{
          title: 'No Rate Plans Found',
          description: 'No rate plans match your active search or filter criteria. Create a new rate plan to get started.',
        }}
      />

      {/* Pagination */}
      {!isLoading && filteredPlans.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredPlans.length}
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
            ? 'Create New Rate Plan'
            : drawerMode === 'edit'
            ? `Edit Rate Plan: ${selectedRatePlan?.name}`
            : `Rate Plan Details: ${selectedRatePlan?.name}`
        }
        description={
          drawerMode === 'view'
            ? 'Read-only inspection of rate plan metadata and policy terms.'
            : 'Configure pricing rules, meal plans, and room availability.'
        }
      >
        <RatePlanForm
          initialData={selectedRatePlan}
          onSubmit={handleFormSubmit}
          onCancel={() => setDrawerOpen(false)}
          isLoading={isCreating || isUpdating}
          isViewOnly={drawerMode === 'view'}
        />
      </Drawer>
    </div>
  );
};
