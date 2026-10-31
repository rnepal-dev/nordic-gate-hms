import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  RoomAmenity,
  RoomAmenityPayload,
  generateAmenitySlug,
} from './amenityTypes';
import {
  loadRoomAmenities,
  saveRoomAmenities,
  loadRoomTypes,
} from '../../../data/adminMockData';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { TableToolbar } from '../../../components/admin/TableToolbar';
import { AdminDataTable, Column } from '../../../components/admin/AdminDataTable';
import { Pagination } from '../../../components/admin/Pagination';
import { Button } from '../../../components/ui/Button';
import { Drawer } from '../../../components/ui/Drawer';
import { DeleteConfirmation } from '../../../components/admin/DeleteConfirmation';
import { RoomAmenityForm } from './RoomAmenityForm';
import { getIconComponent } from '../../../components/ui/IconPicker';
import { useToast } from '../../../components/ui/Toast';

export const RoomAmenityListView: React.FC = () => {
  const { showToast } = useToast();

  const [amenities, setAmenities] = useState<RoomAmenity[]>(() =>
    loadRoomAmenities()
  );
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<string>('display_order');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Drawer & Delete Dialog
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<RoomAmenity | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoomAmenity | null>(null);

  const updateAmenities = (newItems: RoomAmenity[]) => {
    setAmenities(newItems);
    saveRoomAmenities(newItems);
  };

  // Search & Filtering
  const filteredAmenities = useMemo(() => {
    return amenities.filter((item) => {
      if (searchValue.trim()) {
        const q = searchValue.toLowerCase();
        const matches =
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.slug.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (statusFilter === 'active' && !item.is_active) {
        return false;
      }
      if (statusFilter === 'inactive' && item.is_active) {
        return false;
      }

      return true;
    });
  }, [amenities, searchValue, statusFilter]);

  // Sorting
  const sortedAmenities = useMemo(() => {
    const sorted = [...filteredAmenities];
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
  }, [filteredAmenities, sortColumn, sortDirection]);

  // Pagination
  const totalItems = sortedAmenities.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedAmenities = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedAmenities.slice(start, start + pageSize);
  }, [sortedAmenities, currentPage, pageSize]);

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
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(searchValue) || statusFilter !== 'all';

  const handleOpenCreate = () => {
    setEditingAmenity(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (item: RoomAmenity) => {
    setEditingAmenity(item);
    setDrawerOpen(true);
  };

  const handleFormSubmit = (
    payload: RoomAmenityPayload & { id?: number; slug?: string }
  ) => {
    if (payload.id) {
      // Update
      const updated = amenities.map((a) =>
        a.id === payload.id
          ? {
              ...a,
              ...payload,
              slug: payload.slug || a.slug,
              description: payload.description || '',
              icon: payload.icon || 'sparkles',
              is_active: payload.is_active ?? a.is_active,
              display_order: payload.display_order ?? a.display_order,
            }
          : a
      );
      updateAmenities(updated);
      showToast({
        type: 'success',
        title: 'Amenity Updated',
        message: `"${payload.name}" saved successfully.`,
      });
    } else {
      // Create
      const nextId =
        amenities.reduce((max, item) => Math.max(max, item.id), 0) + 1;
      const newItem: RoomAmenity = {
        id: nextId,
        name: payload.name,
        slug: payload.slug || generateAmenitySlug(payload.name),
        icon: payload.icon || 'sparkles',
        description: payload.description || '',
        is_active: payload.is_active ?? true,
        display_order: payload.display_order ?? nextId,
      };
      updateAmenities([newItem, ...amenities]);
      showToast({
        type: 'success',
        title: 'Amenity Created',
        message: `"${payload.name}" added to room amenities catalog.`,
      });
    }

    setDrawerOpen(false);
    setEditingAmenity(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    // Check if any Room Types reference this amenity
    const roomTypes = loadRoomTypes();
    const referencingTypes = roomTypes.filter(
      (rt) => rt.amenity_ids && rt.amenity_ids.includes(deleteTarget.id)
    );

    if (referencingTypes.length > 0) {
      showToast({
        type: 'error',
        title: 'Cannot Delete Amenity',
        message: `Cannot delete: "${deleteTarget.name}" is assigned to ${referencingTypes.length} room class(es) (${referencingTypes.map((r) => r.name).join(', ')}). Unlink it first.`,
      });
      setDeleteTarget(null);
      return;
    }

    const updated = amenities.filter((a) => a.id !== deleteTarget.id);
    updateAmenities(updated);
    showToast({
      type: 'info',
      title: 'Amenity Deleted',
      message: `"${deleteTarget.name}" was removed.`,
    });
    setDeleteTarget(null);
  };

  // Columns definition: S.N, Icon, Name, Description, Active Status, Display Order, Actions
  const columns: Column<RoomAmenity>[] = [
    {
      key: 'serial_number',
      header: 'S.N',
      className: 'w-14 font-mono text-center text-stone-500',
      headerClassName: 'w-14 text-center',
      render: (_, index) => {
        const serialNumber = (currentPage - 1) * pageSize + index + 1;
        return (
          <span className="font-semibold text-xs text-[#0D1A26]">
            {serialNumber}
          </span>
        );
      },
    },
    {
      key: 'icon',
      header: 'Icon',
      className: 'w-14 text-center',
      headerClassName: 'w-14 text-center',
      render: (item) => {
        const Icon = getIconComponent(item.icon);
        return (
          <div className="w-8 h-8 rounded-lg bg-[#0D1A26] text-[#F2C777] flex items-center justify-center mx-auto shadow-xs">
            <Icon className="w-4 h-4" />
          </div>
        );
      },
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      className: 'min-w-[180px] max-w-xs',
      render: (item) => (
        <div className="space-y-0.5">
          <span className="font-bold text-[#0D1A26] text-xs sm:text-sm block">
            {item.name}
          </span>
          <span className="font-mono text-[10px] text-stone-400 block truncate">
            {item.slug}
          </span>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      className: 'min-w-[240px] max-w-md',
      render: (item) => (
        <p className="text-xs text-[#5D6B78] line-clamp-2 leading-relaxed">
          {item.description || '—'}
        </p>
      ),
    },
    {
      key: 'is_active',
      header: 'Active Status',
      sortable: true,
      className: 'whitespace-nowrap w-28 text-center',
      headerClassName: 'w-28 text-center',
      render: (item) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
            item.is_active
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-stone-100 text-stone-600 border-stone-200'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              item.is_active ? 'bg-emerald-500' : 'bg-stone-400'
            }`}
          />
          {item.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'display_order',
      header: 'Display Order',
      sortable: true,
      className: 'w-28 font-mono text-center',
      headerClassName: 'w-28 text-center',
      render: (item) => (
        <span className="inline-block px-2 py-0.5 rounded bg-[#EDE7DC]/70 font-semibold text-xs text-[#0D1A26]">
          {item.display_order}
        </span>
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
            title="Edit Amenity"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(item)}
            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
            title="Delete Amenity"
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
        title="Room Amenities Management"
        subtitle="Configure guest room features, appliances, luxury toiletries, and fixtures."
        badge={
          <span className="text-xs font-bold px-2.5 py-1 bg-[#BF8641]/15 text-[#BF8641] rounded-full">
            {amenities.length} Amenities
          </span>
        }
        actions={
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleOpenCreate}
          >
            Add New Amenity
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
          searchPlaceholder="Search amenities by name, description, or slug..."
          statusFilter={{
            value: statusFilter,
            options: [
              { label: 'All Statuses', value: 'all' },
              { label: 'Active Only', value: 'active' },
              { label: 'Inactive Only', value: 'inactive' },
            ],
            onChange: (val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            },
          }}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={handleResetFilters}
        />

        <AdminDataTable<RoomAmenity>
          columns={columns}
          data={paginatedAmenities}
          keyExtractor={(item) => item.id.toString()}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          emptyState={{
            title: hasActiveFilters
              ? 'No matching room amenities'
              : 'No room amenities configured yet',
            description: hasActiveFilters
              ? 'Try adjusting your search terms or status filters.'
              : 'Create your first room amenity (e.g. Wi-Fi 6, Hansgrohe Rain Shower, Espresso Machine).',
            actionLabel: hasActiveFilters ? 'Clear Filters' : 'Add First Amenity',
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
          setEditingAmenity(null);
        }}
        title={
          editingAmenity
            ? `Edit Room Amenity #${editingAmenity.id}`
            : 'Add New Room Amenity'
        }
        description="Configure amenity naming, icon representation, description, and active status."
        size="lg"
      >
        <RoomAmenityForm
          initialData={editingAmenity}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setDrawerOpen(false);
            setEditingAmenity(null);
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
          itemType="Room Amenity"
        />
      )}
    </div>
  );
};
