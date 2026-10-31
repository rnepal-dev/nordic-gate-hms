import React, { useState, useMemo } from 'react';
import {
  Plus,
  LayoutGrid,
  List,
  Star,
  Edit2,
  Trash2,
  BedDouble,
  CheckCircle2,
  XCircle,
  Eye,
  Filter,
} from 'lucide-react';
import {
  ApiGalleryItem,
  ApiGalleryPayload,
  GALLERY_CATEGORIES,
  getGalleryCategoryDisplay,
  prepareGalleryFormData,
} from './galleryTypes';
import {
  loadAdminGallery,
  saveAdminGallery,
  loadRoomTypes,
} from '../../../data/adminMockData';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { TableToolbar } from '../../../components/admin/TableToolbar';
import { AdminDataTable, Column } from '../../../components/admin/AdminDataTable';
import { Pagination } from '../../../components/admin/Pagination';
import { Button } from '../../../components/ui/Button';
import { Drawer } from '../../../components/ui/Drawer';
import { DeleteConfirmation } from '../../../components/admin/DeleteConfirmation';
import { ImageGalleryGrid } from './ImageGalleryGrid';
import { ImageLightboxModal } from './ImageLightboxModal';
import { GalleryForm } from './GalleryForm';
import { useToast } from '../../../components/ui/Toast';

export const GalleryListView: React.FC = () => {
  const { showToast } = useToast();

  const [galleryItems, setGalleryItems] = useState<ApiGalleryItem[]>(() =>
    loadAdminGallery()
  );
  const roomTypes = useMemo(() => loadRoomTypes(), []);

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchValue, setSearchValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [featureFilter, setFeatureFilter] = useState<string>('all');
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>('all');

  const [sortColumn, setSortColumn] = useState<string>('display_order');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Drawer, Lightbox & Deletion states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ApiGalleryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiGalleryItem | null>(null);
  const [previewTarget, setPreviewTarget] = useState<ApiGalleryItem | null>(null);

  const updateGallery = (newItems: ApiGalleryItem[]) => {
    setGalleryItems(newItems);
    saveAdminGallery(newItems);
  };

  // Build room type map for display
  const roomTypeMap = useMemo(() => {
    return new Map(roomTypes.map((rt) => [rt.id, rt.name]));
  }, [roomTypes]);

  // Search & Filtering
  const filteredItems = useMemo(() => {
    return galleryItems.filter((item) => {
      if (searchValue.trim()) {
        const q = searchValue.toLowerCase();
        const matches =
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.room_type_name && item.room_type_name.toLowerCase().includes(q));
        if (!matches) return false;
      }

      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }

      if (statusFilter === 'active' && !item.is_active) {
        return false;
      }
      if (statusFilter === 'inactive' && item.is_active) {
        return false;
      }

      if (featureFilter === 'featured' && !item.is_featured) {
        return false;
      }
      if (featureFilter === 'standard' && item.is_featured) {
        return false;
      }

      if (roomTypeFilter !== 'all') {
        if (roomTypeFilter === 'general' && item.room_type !== null) {
          return false;
        }
        if (roomTypeFilter !== 'general' && String(item.room_type) !== roomTypeFilter) {
          return false;
        }
      }

      return true;
    });
  }, [galleryItems, searchValue, categoryFilter, statusFilter, featureFilter, roomTypeFilter]);

  // Sorting
  const sortedItems = useMemo(() => {
    const sorted = [...filteredItems];
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
  }, [filteredItems, sortColumn, sortDirection]);

  // Paginated slice
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedItems.slice(startIndex, startIndex + pageSize);
  }, [sortedItems, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedItems.length / pageSize) || 1;

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (item: ApiGalleryItem) => {
    setEditingItem(item);
    setDrawerOpen(true);
  };

  const handleFormSubmit = (payload: ApiGalleryPayload, selectedFile?: File | null) => {
    const now = new Date().toISOString();

    // Prepare multipart FormData conforming to confirmed Django upload contract
    const formData = prepareGalleryFormData(
      {
        title: payload.title,
        description: payload.description,
        category: payload.category,
        is_featured: payload.is_featured,
        is_active: payload.is_active,
        display_order: payload.display_order,
        room_type: payload.room_type,
      },
      selectedFile
    );

    // Dynamic room type name resolution
    const roomTypeName = payload.room_type ? roomTypeMap.get(payload.room_type) || null : null;

    if (editingItem) {
      const updated: ApiGalleryItem = {
        ...editingItem,
        title: payload.title,
        description: payload.description,
        image_url: payload.image_url,
        image: payload.image_url,
        category: payload.category,
        category_display: getGalleryCategoryDisplay(payload.category),
        is_featured: payload.is_featured,
        is_active: payload.is_active,
        room_type: payload.room_type,
        room_type_name: roomTypeName,
        display_order: payload.display_order,
      };

      updateGallery(galleryItems.map((g) => (g.id === updated.id ? updated : g)));
      showToast({
        type: 'success',
        title: 'Gallery Image Updated',
        message: `Changes saved for "${payload.title}".`,
      });
    } else {
      const nextId =
        galleryItems.length > 0 ? Math.max(...galleryItems.map((g) => g.id)) + 1 : 1;
      const created: ApiGalleryItem = {
        id: nextId,
        title: payload.title,
        description: payload.description,
        image_url: payload.image_url,
        image: payload.image_url,
        category: payload.category,
        category_display: getGalleryCategoryDisplay(payload.category),
        is_featured: payload.is_featured,
        is_active: payload.is_active,
        room_type: payload.room_type,
        room_type_name: roomTypeName,
        display_order: payload.display_order,
        created_at: now,
      };

      updateGallery([created, ...galleryItems]);
      showToast({
        type: 'success',
        title: 'Image Added to Gallery',
        message: `"${payload.title}" is now part of the hotel asset catalog.`,
      });
    }

    setDrawerOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    updateGallery(galleryItems.filter((item) => item.id !== deleteTarget.id));
    showToast({
      type: 'success',
      title: 'Image Deleted',
      message: `"${deleteTarget.title}" was removed from the gallery catalog.`,
    });
    setDeleteTarget(null);
  };

  // Table Columns Definition
  const columns: Column<ApiGalleryItem>[] = [
    {
      key: 'sn',
      header: 'S.N',
      className: 'w-14 text-center font-mono text-xs text-stone-400',
      headerClassName: 'w-14 text-center',
      render: (_, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      key: 'image',
      header: 'Image',
      className: 'w-20 text-center',
      headerClassName: 'w-20 text-center',
      render: (item) => (
        <div
          onClick={() => setPreviewTarget(item)}
          className="relative w-14 h-11 rounded-lg overflow-hidden bg-stone-900 mx-auto cursor-pointer group shadow-2xs"
          title="Click to preview in lightbox"
        >
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
            <Eye className="w-3.5 h-3.5" />
          </div>
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Title & Context',
      sortable: true,
      className: 'min-w-[200px] max-w-sm',
      render: (item) => (
        <div className="py-0.5">
          <div className="font-semibold text-xs text-[#02070D] flex items-center gap-1.5">
            <span
              onClick={() => setPreviewTarget(item)}
              className="cursor-pointer hover:text-[#BF8641] transition-colors line-clamp-1"
            >
              {item.title}
            </span>
            <span className="font-mono text-[10px] text-stone-400 shrink-0 font-normal">
              #{item.id}
            </span>
          </div>
          {item.description && (
            <p className="text-[11px] text-[#5D6B78] line-clamp-1 mt-0.5">
              {item.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      className: 'w-36',
      render: (item) => (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EDE7DC] text-[#0D1A26]">
          {item.category_display || getGalleryCategoryDisplay(item.category)}
        </span>
      ),
    },
    {
      key: 'room_type',
      header: 'Room Class',
      className: 'w-44',
      render: (item) => (
        <div>
          {item.room_type_name ? (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#0D1A26]">
              <BedDouble className="w-3.5 h-3.5 text-[#BF8641] shrink-0" />
              <span className="truncate">{item.room_type_name}</span>
            </span>
          ) : (
            <span className="text-stone-400 text-xs italic">General Hotel</span>
          )}
        </div>
      ),
    },
    {
      key: 'is_featured',
      header: 'Featured',
      sortable: true,
      className: 'w-24 text-center',
      headerClassName: 'w-24 text-center',
      render: (item) =>
        item.is_featured ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0D1A26] text-[#F2C777]">
            <Star className="w-2.5 h-2.5 fill-[#F2C777]" />
            <span>Featured</span>
          </span>
        ) : (
          <span className="text-stone-400 text-xs">—</span>
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
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
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
      key: 'display_order',
      header: 'Order',
      sortable: true,
      className: 'w-20 text-center font-mono text-xs text-[#0D1A26]',
      headerClassName: 'w-20 text-center',
      render: (item) => `#${item.display_order}`,
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
            title="Edit Photography Asset"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(item)}
            className="p-1.5 text-[#5D6B78] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete Photography Asset"
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
        title="Hotel Gallery Management"
        subtitle="Organize, upload, and curate high-resolution hotel photography across guest rooms, dining, heated pool, wellness, and exterior architecture."
        actions={
          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-[#EDE7DC] p-0.5 rounded-xl border border-[#D3C8B9]">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#0D1A26] text-[#F2C777] shadow-xs'
                    : 'text-[#25303A] hover:text-[#0D1A26]'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
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
            </div>

            <Button
              variant="primary"
              onClick={handleOpenCreate}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add New Photo
            </Button>
          </div>
        }
      />

      {/* Toolbar & Filter Controls */}
      <div className="space-y-3">
        <TableToolbar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search photography by title, description, room..."
          categoryFilter={{
            label: 'All Categories',
            value: categoryFilter,
            onChange: setCategoryFilter,
            options: [
              { label: 'All Categories', value: 'all' },
              ...GALLERY_CATEGORIES.map((c) => ({ label: c.label, value: c.value })),
            ],
          }}
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

        {/* Supplementary Filters: Featured & Room Type */}
        <div className="flex flex-wrap items-center gap-2 px-1 text-xs text-[#5D6B78]">
          <span className="flex items-center gap-1 font-semibold text-[#0D1A26]">
            <Filter className="w-3.5 h-3.5 text-[#BF8641]" />
            Additional Filters:
          </span>

          {/* Featured Filter Chips */}
          <div className="flex items-center gap-1 bg-[#F8F5EF] p-1 rounded-xl border border-[#EDE7DC]">
            <button
              type="button"
              onClick={() => setFeatureFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                featureFilter === 'all'
                  ? 'bg-[#0D1A26] text-[#F2C777]'
                  : 'hover:bg-white text-[#25303A]'
              }`}
            >
              All Focus
            </button>
            <button
              type="button"
              onClick={() => setFeatureFilter('featured')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                featureFilter === 'featured'
                  ? 'bg-[#0D1A26] text-[#F2C777]'
                  : 'hover:bg-white text-[#25303A]'
              }`}
            >
              <Star className="w-3 h-3 fill-[#F2C777]" />
              Featured Only
            </button>
            <button
              type="button"
              onClick={() => setFeatureFilter('standard')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                featureFilter === 'standard'
                  ? 'bg-[#0D1A26] text-[#F2C777]'
                  : 'hover:bg-white text-[#25303A]'
              }`}
            >
              Standard
            </button>
          </div>

          {/* Room Type Association Filter Dropdown */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[11px] font-semibold text-stone-400">Room Class:</span>
            <select
              value={roomTypeFilter}
              onChange={(e) => setRoomTypeFilter(e.target.value)}
              className="px-2.5 py-1 text-xs bg-white border border-[#D3C8B9] rounded-xl text-[#0D1A26] focus:outline-none focus:border-[#BF8641]"
            >
              <option value="all">All Room Types</option>
              <option value="general">General Hotel Only</option>
              {roomTypes.map((rt) => (
                <option key={rt.id} value={String(rt.id)}>
                  {rt.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area: Grid or Table */}
      {viewMode === 'grid' ? (
        <div className="space-y-6">
          <ImageGalleryGrid
            items={paginatedItems}
            onEdit={handleOpenEdit}
            onDelete={(item) => setDeleteTarget(item)}
            onPreview={(item) => setPreviewTarget(item)}
          />
          <div className="bg-white rounded-2xl border border-[#D3C8B9] p-3 shadow-2xs">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={sortedItems.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#D3C8B9] shadow-xs overflow-hidden">
          <AdminDataTable
            columns={columns}
            data={paginatedItems}
            keyExtractor={(item) => String(item.id)}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            emptyState={{
              title: 'No photography assets found',
              description: 'Try adjusting your search keywords, category filters, or add a new photograph.',
            }}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={sortedItems.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
          />
        </div>
      )}

      {/* Create / Edit Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editingItem ? `Edit Photography: ${editingItem.title}` : 'Upload New Photography'}
        description="Upload high-resolution photography, configure categories, link room types, and manage featured display status."
        size="lg"
      >
        <GalleryForm
          initialData={editingItem}
          onSubmit={handleFormSubmit}
          onCancel={() => setDrawerOpen(false)}
        />
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmation
        isOpen={Boolean(deleteTarget)}
        itemName={deleteTarget?.title || 'Photo'}
        itemType="Photography Asset"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteTarget(null)}
      />

      {/* Image Lightbox Modal */}
      <ImageLightboxModal
        item={previewTarget}
        items={sortedItems}
        isOpen={Boolean(previewTarget)}
        onClose={() => setPreviewTarget(null)}
        onNavigate={(nextItem) => setPreviewTarget(nextItem)}
      />
    </div>
  );
};
