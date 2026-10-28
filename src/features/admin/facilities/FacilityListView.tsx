import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Coins,
  CalendarCheck,
} from 'lucide-react';
import {
  ApiFacilityItem,
  ApiFacilityPayload,
  FACILITY_CATEGORIES,
  getCategoryDisplay,
} from './facilityTypes';
import {
  loadAdminFacilities,
  saveAdminFacilities,
} from '../../../data/adminMockData';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { TableToolbar } from '../../../components/admin/TableToolbar';
import { AdminDataTable, Column } from '../../../components/admin/AdminDataTable';
import { Pagination } from '../../../components/admin/Pagination';
import { Button } from '../../../components/ui/Button';
import { Drawer } from '../../../components/ui/Drawer';
import { DeleteConfirmation } from '../../../components/admin/DeleteConfirmation';
import { FacilityForm } from './FacilityForm';
import { getIconComponent } from '../../../components/ui/IconPicker';
import { useToast } from '../../../components/ui/Toast';

export const FacilityListView: React.FC = () => {
  const { showToast } = useToast();

  const [facilities, setFacilities] = useState<ApiFacilityItem[]>(() =>
    loadAdminFacilities()
  );
  const [searchValue, setSearchValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<string>('display_order');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<ApiFacilityItem | null>(
    null
  );

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<ApiFacilityItem | null>(null);

  const updateFacilities = (newItems: ApiFacilityItem[]) => {
    setFacilities(newItems);
    saveAdminFacilities(newItems);
  };

  // Search & Filtering
  const filteredFacilities = useMemo(() => {
    return facilities.filter((item) => {
      if (searchValue.trim()) {
        const q = searchValue.toLowerCase();
        const matches =
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.additional_information &&
            item.additional_information.toLowerCase().includes(q)) ||
          item.slug.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }

      if (availabilityFilter === 'available' && !item.is_available) {
        return false;
      }
      if (availabilityFilter === 'unavailable' && item.is_available) {
        return false;
      }
      if (availabilityFilter === 'free' && !item.is_free) {
        return false;
      }
      if (availabilityFilter === 'paid' && item.is_free) {
        return false;
      }

      return true;
    });
  }, [facilities, searchValue, categoryFilter, availabilityFilter]);

  // Sorting
  const sortedFacilities = useMemo(() => {
    const sorted = [...filteredFacilities];
    sorted.sort((a, b) => {
      let aVal: any = (a as any)[sortColumn];
      let bVal: any = (b as any)[sortColumn];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal || '').toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredFacilities, sortColumn, sortDirection]);

  // Pagination
  const totalItems = sortedFacilities.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedFacilities = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedFacilities.slice(start, start + pageSize);
  }, [sortedFacilities, currentPage, pageSize]);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleResetFilters = () => {
    setSearchValue('');
    setCategoryFilter('all');
    setAvailabilityFilter('all');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(searchValue) ||
    categoryFilter !== 'all' ||
    availabilityFilter !== 'all';

  const handleOpenCreate = () => {
    setEditingFacility(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (item: ApiFacilityItem) => {
    setEditingFacility(item);
    setDrawerOpen(true);
  };

  const handleFormSubmit = (
    payload: ApiFacilityPayload & { id?: number; slug?: string }
  ) => {
    if (payload.id) {
      // Update
      const updated = facilities.map((f) =>
        f.id === payload.id
          ? {
              ...f,
              ...payload,
              category_display: getCategoryDisplay(payload.category),
              slug: payload.slug || f.slug,
              additional_information: payload.additional_information ?? null,
            }
          : f
      );
      updateFacilities(updated);
      showToast({
        type: 'success',
        title: 'Facility Saved',
        message: `"${payload.name}" updated successfully.`,
      });
    } else {
      // Create
      const nextId =
        facilities.reduce((max, item) => Math.max(max, item.id), 0) + 1;
      const newItem: ApiFacilityItem = {
        ...payload,
        id: nextId,
        slug: payload.slug || `facility-${nextId}`,
        category_display: getCategoryDisplay(payload.category),
        additional_information: payload.additional_information ?? null,
      };
      updateFacilities([newItem, ...facilities]);
      showToast({
        type: 'success',
        title: 'Facility Created',
        message: `"${payload.name}" added to hotel amenities catalog.`,
      });
    }

    setDrawerOpen(false);
    setEditingFacility(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    const updated = facilities.filter((f) => f.id !== deleteTarget.id);
    updateFacilities(updated);
    showToast({
      type: 'info',
      title: 'Facility Deleted',
      message: `"${deleteTarget.name}" removed from amenities list.`,
    });
    setDeleteTarget(null);
  };

  const columns: Column<ApiFacilityItem>[] = [
    {
      key: 'display_order',
      header: 'Order',
      sortable: true,
      className: 'w-16 font-mono text-center',
      headerClassName: 'w-16 text-center',
      render: (item) => (
        <span className="inline-block px-2 py-0.5 rounded bg-[#EDE7DC]/70 font-semibold text-xs text-[#0D1A26]">
          {item.display_order}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Facility & Overview',
      sortable: true,
      className: 'min-w-[300px] max-w-md',
      render: (item) => {
        const Icon = getIconComponent(item.icon);
        return (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0D1A26] text-[#F2C777] flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#0D1A26] text-xs sm:text-sm">
                  {item.name}
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  #{item.id}
                </span>
              </div>
              <p className="text-xs text-[#5D6B78] line-clamp-1 leading-relaxed">
                {item.description}
              </p>
              {item.additional_information && (
                <p className="text-[11px] text-[#BF8641] line-clamp-1 italic">
                  {item.additional_information}
                </p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      className: 'whitespace-nowrap',
      render: (item) => (
        <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-[#EDE7DC]/50 text-[#0D1A26] border border-[#D3C8B9]/50">
          {item.category_display || getCategoryDisplay(item.category)}
        </span>
      ),
    },
    {
      key: 'is_available',
      header: 'Status',
      sortable: true,
      className: 'whitespace-nowrap',
      render: (item) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${
            item.is_available
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              item.is_available ? 'bg-emerald-500' : 'bg-rose-500'
            }`}
          />
          {item.is_available ? 'Available' : 'Unavailable'}
        </span>
      ),
    },
    {
      key: 'policies',
      header: 'Pricing & Booking',
      className: 'whitespace-nowrap',
      render: (item) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              item.is_free
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {item.is_free ? 'Complimentary' : 'Paid Service'}
          </span>
          {item.requires_reservation && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Reservation Req.
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right whitespace-nowrap w-24',
      headerClassName: 'text-right w-24',
      render: (item) => (
        <div
          className="flex items-center justify-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => handleOpenEdit(item)}
            className="p-1.5 text-stone-500 hover:text-[#0D1A26] hover:bg-[#EDE7DC]/60 rounded-md transition-colors cursor-pointer"
            title="Edit Facility"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(item)}
            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
            title="Delete Facility"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Facilities & Amenities"
        subtitle="Manage hotel wellness areas, breakfast, Wi-Fi, transport, parking, and concierge services."
        badge={
          <span className="text-xs font-bold px-2.5 py-1 bg-[#BF8641]/15 text-[#BF8641] rounded-full">
            {facilities.length} Facilities
          </span>
        }
        actions={
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleOpenCreate}
          >
            Add New Facility
          </Button>
        }
      />

      <div className="bg-white rounded-xl border border-[#EDE7DC] shadow-xs overflow-hidden">
        <TableToolbar
          searchValue={searchValue}
          onSearchChange={(val) => {
            setSearchValue(val);
            setCurrentPage(1);
          }}
          searchPlaceholder="Search facilities, amenities, or descriptions..."
          categoryFilter={{
            label: 'Category',
            value: categoryFilter,
            options: [
              { label: 'All Categories', value: 'all' },
              ...FACILITY_CATEGORIES.map((c) => ({
                label: c.label,
                value: c.value,
              })),
            ],
            onChange: (val) => {
              setCategoryFilter(val);
              setCurrentPage(1);
            },
          }}
          statusFilter={{
            value: availabilityFilter,
            options: [
              { label: 'All Statuses & Types', value: 'all' },
              { label: 'Available Only', value: 'available' },
              { label: 'Unavailable Only', value: 'unavailable' },
              { label: 'Complimentary (Free)', value: 'free' },
              { label: 'Paid Services', value: 'paid' },
            ],
            onChange: (val) => {
              setAvailabilityFilter(val);
              setCurrentPage(1);
            },
          }}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={handleResetFilters}
        />

        <AdminDataTable<ApiFacilityItem>
          columns={columns}
          data={paginatedFacilities}
          keyExtractor={(item) => item.id.toString()}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          emptyState={{
            title: hasActiveFilters
              ? 'No matching facilities'
              : 'No facilities configured yet',
            description: hasActiveFilters
              ? 'Try adjusting your search terms or filters.'
              : 'Add your first hotel facility or amenity to display on Hotel Nordic Gate.',
            actionLabel: hasActiveFilters ? 'Clear Filters' : 'Add First Facility',
            onAction: hasActiveFilters ? handleResetFilters : handleOpenCreate,
          }}
        />

        {totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setCurrentPage(1);
            }}
          />
        )}
      </div>

      {/* Create / Edit Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingFacility(null);
        }}
        title={
          editingFacility
            ? `Edit Facility #${editingFacility.id}`
            : 'Add New Facility'
        }
        description="Configure amenity naming, icon, availability, complimentary status, and reservation rules."
        size="lg"
      >
        <FacilityForm
          initialData={editingFacility}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setDrawerOpen(false);
            setEditingFacility(null);
          }}
        />
      </Drawer>

      {/* Delete Confirmation */}
      {deleteTarget && (
        <DeleteConfirmation
          isOpen={true}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          itemName={deleteTarget.name}
          itemType="Facility"
        />
      )}
    </div>
  );
};
