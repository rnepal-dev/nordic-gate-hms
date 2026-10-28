import React, { useState, useMemo } from 'react';
import {
  Plus,
  LayoutGrid,
  Table as TableIcon,
  Star,
  Edit2,
  Trash2,
  BedDouble,
  Image as ImageIcon,
} from 'lucide-react';
import {
  ApiGalleryItem,
  ApiGalleryPayload,
  GALLERY_CATEGORIES,
  getGalleryCategoryDisplay,
  getRoomTypeName,
} from './galleryTypes';
import {
  loadAdminGallery,
  saveAdminGallery,
} from '../../../data/adminMockData';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { TableToolbar } from '../../../components/admin/TableToolbar';
import { AdminDataTable, Column } from '../../../components/admin/AdminDataTable';
import { Pagination } from '../../../components/admin/Pagination';
import { Button } from '../../../components/ui/Button';
import { Drawer } from '../../../components/ui/Drawer';
import { DeleteConfirmation } from '../../../components/admin/DeleteConfirmation';
import { ImageGalleryGrid } from './ImageGalleryGrid';
import { GalleryForm } from './GalleryForm';
import { useToast } from '../../../components/ui/Toast';

export const GalleryListView: React.FC = () => {
  const { showToast } = useToast();

  const [galleryItems, setGalleryItems] = useState<ApiGalleryItem[]>(() =>
    loadAdminGallery()
  );
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchValue, setSearchValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [featureFilter, setFeatureFilter] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<string>('display_order');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Drawer & Deletion states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ApiGalleryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiGalleryItem | null>(null);

  const updateGallery = (newItems: ApiGalleryItem[]) => {
    setGalleryItems(newItems);
    saveAdminGallery(newItems);
  };

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

      if (featureFilter === 'featured' && !item.is_featured) {
        return false;
      }
      if (featureFilter === 'standard' && item.is_featured) {
        return false;
      }
      if (featureFilter === 'rooms' && item.room_type === null) {
        return false;
      }

      return true;
    });
  }, [galleryItems, searchValue, categoryFilter, featureFilter]);

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

  // Pagination
  const totalItems = sortedItems.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedItems.slice(start, start + pageSize);
  }, [sortedItems, currentPage, pageSize]);

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
    setFeatureFilter('all');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(searchValue) || categoryFilter !== 'all' || featureFilter !== 'all';

  const handleOpenCreate = () => {
    setEditingItem(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (item: ApiGalleryItem) => {
    setEditingItem(item);
    setDrawerOpen(true);
  };

  const handleFormSubmit = (payload: ApiGalleryPayload & { id?: number }) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const roomName = getRoomTypeName(payload.room_type);
    const categoryDisplay = getGalleryCategoryDisplay(payload.category);

    if (payload.id) {
      // Update
      const updated = galleryItems.map((item) =>
        item.id === payload.id
          ? {
              ...item,
              ...payload,
              room_type_name: roomName,
              category_display: categoryDisplay,
            }
          : item
      );
      updateGallery(updated);
      showToast({
        type: 'success',
        title: 'Image Updated',
        message: `"${payload.title}" saved successfully.`,
      });
    } else {
      // Create
      const nextId =
        galleryItems.reduce((max, item) => Math.max(max, item.id), 0) + 1;
      const newItem: ApiGalleryItem = {
        ...payload,
        id: nextId,
        room_type: payload.room_type ?? null,
        room_type_name: roomName,
        category_display: categoryDisplay,
        created_at: now,
      };
      updateGallery([newItem, ...galleryItems]);
      showToast({
        type: 'success',
        title: 'Image Added',
        message: `"${payload.title}" added to Hotel Nordic Gate gallery.`,
      });
    }

    setDrawerOpen(false);
    setEditingItem(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    const updated = galleryItems.filter((i) => i.id !== deleteTarget.id);
    updateGallery(updated);
    showToast({
      type: 'info',
      title: 'Image Removed',
      message: `"${deleteTarget.title}" deleted from media gallery.`,
    });
    setDeleteTarget(null);
  };

  // Table Columns (for Table View)
  const columns: Column<ApiGalleryItem>[] = [
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
      key: 'image_url',
      header: 'Preview',
      className: 'w-20',
      headerClassName: 'w-20',
      render: (item) => (
        <div className="w-14 h-11 rounded-lg bg-stone-900 overflow-hidden border border-[#EDE7DC]">
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      key: 'title',
      header: 'Title & Description',
      sortable: true,
      className: 'min-w-[260px] max-w-md',
      render: (item) => (
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0D1A26] text-xs sm:text-sm">
              {item.title}
            </span>
            <span className="text-[10px] font-mono text-stone-400">
              #{item.id}
            </span>
          </div>
          {item.description && (
            <p className="text-xs text-[#5D6B78] line-clamp-1 leading-relaxed">
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
      className: 'whitespace-nowrap',
      render: (item) => (
        <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-[#EDE7DC]/50 text-[#0D1A26] border border-[#D3C8B9]/50">
          {item.category_display || getGalleryCategoryDisplay(item.category)}
        </span>
      ),
    },
    {
      key: 'room_type_name',
      header: 'Room Association',
      className: 'whitespace-nowrap',
      render: (item) =>
        item.room_type_name ? (
          <div className="flex items-center gap-1.5 text-xs text-[#0D1A26] font-medium">
            <BedDouble className="w-3.5 h-3.5 text-[#BF8641]" />
            <span>{item.room_type_name}</span>
          </div>
        ) : (
          <span className="text-xs text-stone-400">General Hotel</span>
        ),
    },
    {
      key: 'is_featured',
      header: 'Featured',
      sortable: true,
      className: 'whitespace-nowrap',
      render: (item) =>
        item.is_featured ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-[#BF8641] border border-amber-200 text-xs font-bold">
            <Star className="w-3 h-3 fill-[#BF8641]" />
            <span>Featured</span>
          </span>
        ) : (
          <span className="text-xs text-stone-400">Standard</span>
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
            title="Edit image"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(item)}
            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
            title="Delete image"
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
        subtitle="Curate high-resolution photography of suites, restaurant dining, indoor pool, and Gothenburg surroundings."
        badge={
          <span className="text-xs font-bold px-2.5 py-1 bg-[#BF8641]/15 text-[#BF8641] rounded-full">
            {galleryItems.length} Images
          </span>
        }
        actions={
          <div className="flex items-center gap-3">
            {/* View Mode Toggle: Grid vs Table */}
            <div className="flex items-center p-0.5 bg-white border border-[#D3C8B9] rounded-lg shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#0D1A26] text-white shadow-xs'
                    : 'text-[#5D6B78] hover:text-[#0D1A26]'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#0D1A26] text-white shadow-xs'
                    : 'text-[#5D6B78] hover:text-[#0D1A26]'
                }`}
                title="Table view"
              >
                <TableIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>

            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={handleOpenCreate}
            >
              Add Image
            </Button>
          </div>
        }
      />

      <div className="bg-white rounded-xl border border-[#EDE7DC] shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <TableToolbar
          searchValue={searchValue}
          onSearchChange={(val) => {
            setSearchValue(val);
            setCurrentPage(1);
          }}
          searchPlaceholder="Search titles, descriptions, or room types..."
          categoryFilter={{
            label: 'Category',
            value: categoryFilter,
            options: [
              { label: 'All Categories', value: 'all' },
              ...GALLERY_CATEGORIES.map((c) => ({
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
            value: featureFilter,
            options: [
              { label: 'All Photos', value: 'all' },
              { label: 'Featured Only', value: 'featured' },
              { label: 'Standard Only', value: 'standard' },
              { label: 'Room Associated Only', value: 'rooms' },
            ],
            onChange: (val) => {
              setFeatureFilter(val);
              setCurrentPage(1);
            },
          }}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={handleResetFilters}
        />

        {/* Dynamic Display: Grid View or Table View */}
        <div className="p-4 sm:p-5">
          {paginatedItems.length === 0 ? (
            <div className="p-12 text-center text-sm text-[#5D6B78]">
              No images match your active filters.
            </div>
          ) : viewMode === 'grid' ? (
            <ImageGalleryGrid
              items={paginatedItems}
              onEdit={handleOpenEdit}
              onDelete={setDeleteTarget}
            />
          ) : (
            <AdminDataTable<ApiGalleryItem>
              columns={columns}
              data={paginatedItems}
              keyExtractor={(item) => item.id.toString()}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          )}
        </div>

        {totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            pageSizeOptions={[12, 24, 48]}
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
          setEditingItem(null);
        }}
        title={
          editingItem ? `Edit Image #${editingItem.id}` : 'Add New Gallery Image'
        }
        description="Upload or link high-resolution hotel photography and associate with room tiers."
        size="lg"
      >
        <GalleryForm
          initialData={editingItem}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setDrawerOpen(false);
            setEditingItem(null);
          }}
        />
      </Drawer>

      {/* Delete Confirmation */}
      {deleteTarget && (
        <DeleteConfirmation
          isOpen={true}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          itemName={deleteTarget.title}
          itemType="Image"
        />
      )}
    </div>
  );
};
