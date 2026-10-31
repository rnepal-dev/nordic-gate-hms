import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  Bed,
  Maximize2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  RoomType,
  RoomTypePayload,
  generateRoomTypeSlug,
} from './roomTypeTypes';
import {
  loadRoomTypes,
  saveRoomTypes,
  loadRoomAmenities,
  loadRooms,
  loadAdminGallery,
} from '../../../data/adminMockData';
import { getPreferredRoomTypeImage } from '../gallery/galleryTypes';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { TableToolbar } from '../../../components/admin/TableToolbar';
import { AdminDataTable, Column } from '../../../components/admin/AdminDataTable';
import { Pagination } from '../../../components/admin/Pagination';
import { Button } from '../../../components/ui/Button';
import { Drawer } from '../../../components/ui/Drawer';
import { DeleteConfirmation } from '../../../components/admin/DeleteConfirmation';
import { RoomTypeForm } from './RoomTypeForm';
import { useToast } from '../../../components/ui/Toast';

export const RoomTypeListView: React.FC = () => {
  const { showToast } = useToast();

  const [roomTypes, setRoomTypes] = useState<RoomType[]>(() => loadRoomTypes());
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Drawer & Delete Dialog
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState<RoomType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoomType | null>(null);

  const updateRoomTypes = (newItems: RoomType[]) => {
    setRoomTypes(newItems);
    saveRoomTypes(newItems);
  };

  // Build amenity lookup for readable amenity summaries
  const amenityMap = useMemo(() => {
    const list = loadRoomAmenities();
    return new Map(list.map((a) => [a.id, a.name]));
  }, []);

  // Filtered list
  const filteredRoomTypes = useMemo(() => {
    return roomTypes.filter((item) => {
      if (searchValue.trim()) {
        const q = searchValue.toLowerCase();
        const matches =
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.amenities.toLowerCase().includes(q) ||
          item.slug.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (statusFilter === 'active' && !item.is_active) return false;
      if (statusFilter === 'inactive' && item.is_active) return false;

      return true;
    });
  }, [roomTypes, searchValue, statusFilter]);

  // Sorted list
  const sortedRoomTypes = useMemo(() => {
    const sorted = [...filteredRoomTypes];
    sorted.sort((a, b) => {
      let valA: any = a[sortColumn as keyof RoomType];
      let valB: any = b[sortColumn as keyof RoomType];

      if (sortColumn === 'size_sqm') {
        valA = parseFloat(a.size_sqm || '0');
        valB = parseFloat(b.size_sqm || '0');
      }

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = (valB as string).toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredRoomTypes, sortColumn, sortDirection]);

  // Paginated slice
  const paginatedRoomTypes = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedRoomTypes.slice(startIndex, startIndex + pageSize);
  }, [sortedRoomTypes, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedRoomTypes.length / pageSize) || 1;

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleOpenCreate = () => {
    setEditingRoomType(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (item: RoomType) => {
    setEditingRoomType(item);
    setDrawerOpen(true);
  };

  const handleFormSubmit = (payload: RoomTypePayload) => {
    const now = new Date().toISOString();

    // Generate amenity summary string from amenity_ids
    const amenityNames = (payload.amenity_ids || [])
      .map((id) => amenityMap.get(id))
      .filter(Boolean) as string[];
    const amenitiesSummary = amenityNames.join(', ');

    if (editingRoomType) {
      const updated: RoomType = {
        ...editingRoomType,
        ...payload,
        size_sqm: payload.size_sqm || null,
        amenity_ids: payload.amenity_ids || [],
        amenities: amenitiesSummary || editingRoomType.amenities,
        updated_at: now,
      };
      updateRoomTypes(roomTypes.map((r) => (r.id === updated.id ? updated : r)));
      showToast({ type: 'success', title: 'Room type updated successfully' });
    } else {
      const nextId = roomTypes.length > 0 ? Math.max(...roomTypes.map((r) => r.id)) + 1 : 1;
      const created: RoomType = {
        id: nextId,
        name: payload.name,
        slug: generateRoomTypeSlug(payload.name),
        description: payload.description || '',
        max_occupancy: payload.max_occupancy,
        bed_configuration: payload.bed_configuration,
        size_sqm: payload.size_sqm || null,
        amenities: amenitiesSummary,
        amenity_ids: payload.amenity_ids || [],
        is_active: payload.is_active !== undefined ? payload.is_active : true,
        created_at: now,
        updated_at: now,
      };
      updateRoomTypes([created, ...roomTypes]);
      showToast({ type: 'success', title: 'Room type created successfully' });
    }
    setDrawerOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;

    // Check if physical rooms depend on this room type
    const physicalRooms = loadRooms();
    const assignedRooms = physicalRooms.filter((r) => r.room_type === deleteTarget.id);

    // Check if gallery images are associated with this room type
    const galleryItems = loadAdminGallery();
    const associatedGallery = galleryItems.filter((g) => g.room_type === deleteTarget.id);

    if (assignedRooms.length > 0 || associatedGallery.length > 0) {
      const parts: string[] = [];
      if (assignedRooms.length > 0) {
        parts.push(`${assignedRooms.length} physical room(s)`);
      }
      if (associatedGallery.length > 0) {
        parts.push(`${associatedGallery.length} gallery image(s)`);
      }

      showToast({
        type: 'error',
        title: 'Cannot Delete Room Type',
        message: `Cannot delete: ${parts.join(' and ')} are linked to "${deleteTarget.name}". Reassign or unlink them first.`,
      });
      setDeleteTarget(null);
      return;
    }

    updateRoomTypes(roomTypes.filter((r) => r.id !== deleteTarget.id));
    showToast({
      type: 'success',
      title: 'Room Type Deleted',
      message: `Room type "${deleteTarget.name}" was removed`,
    });
    setDeleteTarget(null);
  };

  // Format bed config into human readable string
  const formatBedConfig = (config: Record<string, number | string>) => {
    if (!config || Object.keys(config).length === 0) return 'Standard';
    return Object.entries(config)
      .map(([key, count]) => {
        const cleanKey = key
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        return `${count}× ${cleanKey}`;
      })
      .join(', ');
  };

  // Gallery items for preferred thumbnail derivation
  const galleryItems = useMemo(() => loadAdminGallery(), []);

  // Table Columns
  const columns: Column<RoomType>[] = [
    {
      key: 'sn',
      header: 'S.N',
      className: 'w-16 text-center font-mono text-xs text-stone-400',
      headerClassName: 'w-16 text-center',
      render: (_, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      key: 'name',
      header: 'Room Type',
      sortable: true,
      render: (item) => {
        const preferredImg = getPreferredRoomTypeImage(item.id, galleryItems);
        return (
          <div className="flex items-center gap-3 py-1">
            {preferredImg ? (
              <img
                src={preferredImg.image_url}
                alt={item.name}
                className="w-12 h-9 rounded-lg object-cover shrink-0 shadow-2xs border border-[#EDE7DC]"
              />
            ) : (
              <div className="w-12 h-9 rounded-lg bg-[#F8F5EF] border border-dashed border-[#D3C8B9] flex items-center justify-center text-stone-300 shrink-0">
                <Bed className="w-4 h-4" />
              </div>
            )}
            <div>
              <div className="font-semibold text-[#02070D] flex items-center gap-2">
                <span>{item.name}</span>
                <span className="font-mono text-[10px] text-stone-400 font-normal">
                  #{item.id}
                </span>
              </div>
              <div className="text-[11px] text-[#5D6B78] font-mono">
                /{item.slug}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'max_occupancy',
      header: 'Max Guests',
      sortable: true,
      className: 'w-28 text-center',
      headerClassName: 'w-28 text-center',
      render: (item) => (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EDE7DC]/70 text-[#0D1A26]">
          <Users className="w-3.5 h-3.5 text-[#BF8641]" />
          <span>{item.max_occupancy} {item.max_occupancy === 1 ? 'Guest' : 'Guests'}</span>
        </span>
      ),
    },
    {
      key: 'bed_configuration',
      header: 'Bed Layout',
      render: (item) => (
        <div className="flex items-center gap-1.5 text-xs text-[#25303A] max-w-xs">
          <Bed className="w-3.5 h-3.5 text-[#BF8641] shrink-0" />
          <span className="truncate">{formatBedConfig(item.bed_configuration)}</span>
        </div>
      ),
    },
    {
      key: 'size_sqm',
      header: 'Room Area',
      sortable: true,
      className: 'w-28',
      render: (item) => (
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#0D1A26]">
          <Maximize2 className="w-3 h-3 text-stone-400" />
          <span>{item.size_sqm ? `${item.size_sqm} m²` : '—'}</span>
        </div>
      ),
    },
    {
      key: 'amenities',
      header: 'Included Amenities',
      render: (item) => (
        <div className="max-w-xs text-xs text-[#5D6B78] truncate" title={item.amenities}>
          {item.amenities || 'None specified'}
        </div>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      sortable: true,
      className: 'w-24 text-center',
      headerClassName: 'w-24 text-center',
      render: (item) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
            item.is_active
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-stone-100 text-stone-600 border border-stone-200'
          }`}
        >
          {item.is_active ? (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Active</span>
            </>
          ) : (
            <>
              <XCircle className="w-3 h-3 text-stone-400" />
              <span>Inactive</span>
            </>
          )}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'w-24 text-right',
      headerClassName: 'w-24 text-right',
      render: (item) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => handleOpenEdit(item)}
            className="p-1.5 text-[#5D6B78] hover:text-[#0D1A26] hover:bg-[#EDE7DC]/50 rounded-lg transition-colors cursor-pointer"
            title="Edit Room Type"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(item)}
            className="p-1.5 text-[#5D6B78] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Room Type"
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
        title="Room Types Management"
        subtitle="Configure guest room classes, bed configurations, maximum occupancy, and assigned amenity bundles according to Django REST Swagger specifications."
        actions={
          <Button
            variant="primary"
            onClick={handleOpenCreate}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Room Type
          </Button>
        }
      />

      {/* Toolbar */}
      <TableToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search room types by name, description, slug..."
        statusFilter={{
          value: statusFilter,
          onChange: setStatusFilter,
          options: [
            { label: 'All Statuses', value: 'all' },
            { label: 'Active Only', value: 'active' },
            { label: 'Inactive Only', value: 'inactive' },
          ],
        }}
      />

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-[#D3C8B9] shadow-xs overflow-hidden">
        <AdminDataTable
          columns={columns}
          data={paginatedRoomTypes}
          keyExtractor={(item) => String(item.id)}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={sortedRoomTypes.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Create / Edit Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingRoomType ? `Edit Room Type: ${editingRoomType.name}` : 'Create Room Type'}
        description="Specify name, maximum guest capacity, bed arrangement JSON, and room amenities."
        size="lg"
      >
        <RoomTypeForm
          initialData={editingRoomType}
          onSubmit={handleFormSubmit}
          onCancel={() => setDrawerOpen(false)}
        />
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={Boolean(deleteTarget)}
        itemName={deleteTarget?.name || 'Room Type'}
        itemType="Room Type"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
