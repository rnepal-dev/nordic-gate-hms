import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  LayoutGrid,
  List,
  DoorClosed,
  Wrench,
  Ban,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import {
  PhysicalRoom,
  RoomPayload,
  ROOM_STATUS_CONFIG,
} from './roomTypes';
import {
  loadRooms,
  saveRooms,
  loadRoomTypes,
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
import { RoomForm } from './RoomForm';
import { RoomFloorGrid } from './RoomFloorGrid';
import { useToast } from '../../../components/ui/Toast';

export const RoomListView: React.FC = () => {
  const { showToast } = useToast();

  const [rooms, setRooms] = useState<PhysicalRoom[]>(() => loadRooms());
  const roomTypes = useMemo(() => loadRoomTypes(), []);
  const galleryItems = useMemo(() => loadAdminGallery(), []);

  // View mode: 'table' or 'grid'
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Filters & Search
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Sorting & Pagination
  const [sortColumn, setSortColumn] = useState<string>('room_number');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Drawer & Delete Dialog
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<PhysicalRoom | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PhysicalRoom | null>(null);

  const updateRooms = (newItems: PhysicalRoom[]) => {
    setRooms(newItems);
    saveRooms(newItems);
  };

  // Status Metrics
  const metrics = useMemo(() => {
    const total = rooms.length;
    const active = rooms.filter((r) => r.status === 'active').length;
    const maintenance = rooms.filter((r) => r.status === 'maintenance').length;
    const outOfService = rooms.filter((r) => r.status === 'out_of_service').length;
    return { total, active, maintenance, outOfService };
  }, [rooms]);

  // Room type filter options for categoryFilter
  const typeFilterOptions = useMemo(() => {
    return [
      { label: 'All Room Classes', value: 'all' },
      ...roomTypes.map((rt) => ({ label: rt.name, value: String(rt.id) })),
    ];
  }, [roomTypes]);

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      if (searchValue.trim()) {
        const q = searchValue.toLowerCase();
        const matches =
          room.room_number.toLowerCase().includes(q) ||
          room.room_type_name.toLowerCase().includes(q) ||
          room.notes.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (statusFilter !== 'all' && room.status !== statusFilter) return false;
      if (typeFilter !== 'all' && String(room.room_type) !== typeFilter) return false;

      return true;
    });
  }, [rooms, searchValue, statusFilter, typeFilter]);

  // Sorted rooms
  const sortedRooms = useMemo(() => {
    const sorted = [...filteredRooms];
    sorted.sort((a, b) => {
      let valA: any = a[sortColumn as keyof PhysicalRoom];
      let valB: any = b[sortColumn as keyof PhysicalRoom];

      if (sortColumn === 'room_number') {
        return sortDirection === 'asc'
          ? a.room_number.localeCompare(b.room_number, undefined, { numeric: true })
          : b.room_number.localeCompare(a.room_number, undefined, { numeric: true });
      }

      if (sortColumn === 'floor') {
        const fA = a.floor ?? -1;
        const fB = b.floor ?? -1;
        return sortDirection === 'asc' ? fA - fB : fB - fA;
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
  }, [filteredRooms, sortColumn, sortDirection]);

  // Paginated rooms (for table view)
  const paginatedRooms = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedRooms.slice(startIndex, startIndex + pageSize);
  }, [sortedRooms, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedRooms.length / pageSize) || 1;

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleOpenCreate = () => {
    setEditingRoom(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (room: PhysicalRoom) => {
    setEditingRoom(room);
    setDrawerOpen(true);
  };

  const handleFormSubmit = (payload: RoomPayload) => {
    const now = new Date().toISOString();
    const typeObj = roomTypes.find((rt) => rt.id === payload.room_type);
    const roomTypeName = typeObj ? typeObj.name : `Type #${payload.room_type}`;

    if (editingRoom) {
      const updated: PhysicalRoom = {
        ...editingRoom,
        room_number: payload.room_number,
        room_type: payload.room_type,
        room_type_name: roomTypeName,
        floor: payload.floor !== undefined ? payload.floor : null,
        status: payload.status || 'active',
        notes: payload.notes || '',
        updated_at: now,
      };
      updateRooms(rooms.map((r) => (r.id === updated.id ? updated : r)));
      showToast({
        type: 'success',
        title: 'Room Updated',
        message: `Room ${payload.room_number} updated successfully`,
      });
    } else {
      // Check if room number already exists
      const duplicate = rooms.find(
        (r) => r.room_number.toLowerCase() === payload.room_number.toLowerCase()
      );
      if (duplicate) {
        showToast({
          type: 'error',
          title: 'Duplicate Room Number',
          message: `Room number "${payload.room_number}" already exists in hotel inventory.`,
        });
        return;
      }

      const nextId = rooms.length > 0 ? Math.max(...rooms.map((r) => r.id)) + 1 : 1;
      const created: PhysicalRoom = {
        id: nextId,
        room_number: payload.room_number,
        room_type: payload.room_type,
        room_type_name: roomTypeName,
        floor: payload.floor !== undefined ? payload.floor : null,
        status: payload.status || 'active',
        notes: payload.notes || '',
        created_at: now,
        updated_at: now,
      };
      updateRooms([created, ...rooms]);
      showToast({
        type: 'success',
        title: 'Room Created',
        message: `Physical Room ${payload.room_number} added to inventory`,
      });
    }
    setDrawerOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    updateRooms(rooms.filter((r) => r.id !== deleteTarget.id));
    showToast({
      type: 'success',
      title: 'Room Deleted',
      message: `Room ${deleteTarget.room_number} deleted from inventory`,
    });
    setDeleteTarget(null);
  };

  // Table Columns
  const columns: Column<PhysicalRoom>[] = [
    {
      key: 'sn',
      header: 'S.N',
      className: 'w-16 text-center font-mono text-xs text-stone-400',
      headerClassName: 'w-16 text-center',
      render: (_, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      key: 'room_number',
      header: 'Room Number',
      sortable: true,
      className: 'w-36',
      render: (item) => (
        <div className="flex items-center gap-2 py-0.5">
          <div className="w-8 h-8 rounded-lg bg-[#0D1A26] text-[#F2C777] flex items-center justify-center font-mono font-bold text-xs shrink-0">
            {item.room_number}
          </div>
          <div>
            <span className="font-mono font-bold text-xs text-[#02070D]">
              Room {item.room_number}
            </span>
            <div className="text-[10px] text-stone-400 font-mono">
              ID: #{item.id}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'room_type_name',
      header: 'Room Class',
      sortable: true,
      render: (item) => {
        const preferredImg = getPreferredRoomTypeImage(item.room_type, galleryItems);
        return (
          <div className="flex items-center gap-2.5">
            {preferredImg ? (
              <img
                src={preferredImg.image_url}
                alt={item.room_type_name}
                className="w-10 h-8 rounded-lg object-cover shrink-0 border border-[#EDE7DC] shadow-2xs"
              />
            ) : null}
            <div>
              <span className="font-semibold text-xs text-[#0D1A26] block">
                {item.room_type_name}
              </span>
              <div className="text-[10px] text-[#5D6B78] font-mono">
                Class ID: #{item.room_type}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: 'floor',
      header: 'Floor',
      sortable: true,
      className: 'w-24 text-center',
      headerClassName: 'w-24 text-center',
      render: (item) => (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#EDE7DC]/70 text-[#0D1A26]">
          <Layers className="w-3 h-3 text-[#BF8641]" />
          <span>{item.floor !== null && item.floor !== undefined ? `Floor ${item.floor}` : '—'}</span>
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Operational Status',
      sortable: true,
      className: 'w-36 text-center',
      headerClassName: 'w-36 text-center',
      render: (item) => {
        const cfg = ROOM_STATUS_CONFIG[item.status];
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${cfg.badgeBg} ${cfg.badgeText} border ${cfg.badgeBorder}`}
          >
            <span className={`w-2 h-2 rounded-full ${cfg.dotBg}`} />
            <span>{cfg.label}</span>
          </span>
        );
      },
    },
    {
      key: 'notes',
      header: 'Housekeeping / Staff Notes',
      render: (item) => (
        <div className="max-w-xs text-xs text-[#5D6B78] truncate" title={item.notes}>
          {item.notes || <span className="text-stone-300 italic">No notes</span>}
        </div>
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
            title="Edit Physical Room"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(item)}
            className="p-1.5 text-[#5D6B78] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Physical Room"
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
        title="Physical Rooms Management"
        subtitle="Manage the physical inventory of hotel rooms, floor mappings, and operational readiness statuses (Active, Maintenance, Out of Service) adhering to Django REST Swagger specifications."
        actions={
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#EDE7DC] p-0.5 rounded-xl border border-[#D3C8B9]">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#0D1A26] text-[#F2C777] shadow-xs'
                    : 'text-[#25303A] hover:text-[#0D1A26]'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#0D1A26] text-[#F2C777] shadow-xs'
                    : 'text-[#25303A] hover:text-[#0D1A26]'
                }`}
                title="Floor Matrix View"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Floor Plan</span>
              </button>
            </div>

            <Button
              variant="primary"
              onClick={handleOpenCreate}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Physical Room
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#D3C8B9] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0D1A26] text-[#F2C777] flex items-center justify-center shrink-0">
            <DoorClosed className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#5D6B78] uppercase tracking-wider">Total Rooms</p>
            <p className="text-xl font-bold text-[#0D1A26] font-mono">{metrics.total}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#D3C8B9] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#5D6B78] uppercase tracking-wider">Active Inventory</p>
            <p className="text-xl font-bold text-emerald-700 font-mono">{metrics.active}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#D3C8B9] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#5D6B78] uppercase tracking-wider">In Maintenance</p>
            <p className="text-xl font-bold text-amber-700 font-mono">{metrics.maintenance}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#D3C8B9] p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
            <Ban className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-[#5D6B78] uppercase tracking-wider">Out of Service</p>
            <p className="text-xl font-bold text-rose-700 font-mono">{metrics.outOfService}</p>
          </div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <TableToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        searchPlaceholder="Search room number, type, staff notes..."
        categoryFilter={{
          label: 'Room Class',
          value: typeFilter,
          onChange: setTypeFilter,
          options: typeFilterOptions,
        }}
        statusFilter={{
          value: statusFilter,
          onChange: setStatusFilter,
          options: [
            { label: 'All Statuses', value: 'all' },
            { label: 'Active', value: 'active' },
            { label: 'Maintenance', value: 'maintenance' },
            { label: 'Out of Service', value: 'out_of_service' },
          ],
        }}
      />

      {/* Content View: Table or Floor Grid */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-[#D3C8B9] shadow-xs overflow-hidden">
          <AdminDataTable
            columns={columns}
            data={paginatedRooms}
            keyExtractor={(item) => String(item.id)}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={sortedRooms.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>
      ) : (
        <RoomFloorGrid rooms={sortedRooms} onEditRoom={handleOpenEdit} />
      )}

      {/* Create / Edit Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingRoom ? `Edit Physical Room ${editingRoom.room_number}` : 'Add Physical Room'}
        description="Assign room number, link room type class, floor number, operational status, and staff notes."
        size="md"
      >
        <RoomForm
          initialData={editingRoom}
          onSubmit={handleFormSubmit}
          onCancel={() => setDrawerOpen(false)}
        />
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={Boolean(deleteTarget)}
        itemName={deleteTarget ? `Room ${deleteTarget.room_number}` : 'Room'}
        itemType="Physical Room"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};
