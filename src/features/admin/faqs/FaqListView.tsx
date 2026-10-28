import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  HelpCircle,
  CheckCircle,
  Eye,
  FileQuestion,
} from 'lucide-react';
import { AdminFaq, FaqCategory, FAQ_CATEGORIES } from './faqTypes';
import { loadAdminFaqs, saveAdminFaqs } from '../../../data/adminMockData';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { TableToolbar } from '../../../components/admin/TableToolbar';
import { AdminDataTable, Column } from '../../../components/admin/AdminDataTable';
import { Pagination } from '../../../components/admin/Pagination';
import { StatusBadge, StatusType } from '../../../components/ui/StatusBadge';
import { Button } from '../../../components/ui/Button';
import { Drawer } from '../../../components/ui/Drawer';
import { DeleteConfirmation } from '../../../components/admin/DeleteConfirmation';
import { FaqForm } from './FaqForm';
import { useToast } from '../../../components/ui/Toast';

export const FaqListView: React.FC = () => {
  const { showToast } = useToast();

  const [faqs, setFaqs] = useState<AdminFaq[]>(() => loadAdminFaqs());
  const [searchValue, setSearchValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortColumn, setSortColumn] = useState<string>('displayOrder');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Drawer state for Create / Edit
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<AdminFaq | null>(null);

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState<AdminFaq | null>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);

  // Sync state helper
  const updateFaqs = (newFaqs: AdminFaq[]) => {
    setFaqs(newFaqs);
    saveAdminFaqs(newFaqs);
  };

  // Filter & Search
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      // Search in EN question/answer and SV question/answer
      if (searchValue.trim()) {
        const query = searchValue.toLowerCase();
        const matchesQuery =
          faq.questionEn.toLowerCase().includes(query) ||
          faq.questionSv.toLowerCase().includes(query) ||
          faq.answerEn.toLowerCase().includes(query) ||
          faq.answerSv.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && faq.category !== categoryFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && faq.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [faqs, searchValue, categoryFilter, statusFilter]);

  // Sorting
  const sortedFaqs = useMemo(() => {
    const sorted = [...filteredFaqs];
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
  }, [filteredFaqs, sortColumn, sortDirection]);

  // Pagination
  const totalItems = sortedFaqs.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedFaqs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedFaqs.slice(start, start + pageSize);
  }, [sortedFaqs, currentPage, pageSize]);

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
    setStatusFilter('all');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    Boolean(searchValue) || categoryFilter !== 'all' || statusFilter !== 'all';

  // Selection handlers
  const handleSelectRow = (id: string, selected: boolean) => {
    setSelectedIds((prev) =>
      selected ? [...prev, id] : prev.filter((item) => item !== id)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      const allIdsOnPage = paginatedFaqs.map((f) => f.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allIdsOnPage])));
    } else {
      const allIdsOnPage = new Set(paginatedFaqs.map((f) => f.id));
      setSelectedIds((prev) => prev.filter((id) => !allIdsOnPage.has(id)));
    }
  };

  // CRUD Handlers
  const handleOpenCreate = () => {
    setEditingFaq(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (faq: AdminFaq) => {
    setEditingFaq(faq);
    setDrawerOpen(true);
  };

  const handleFormSubmit = (
    data: Omit<AdminFaq, 'id' | 'updatedAt'> & { id?: string }
  ) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    if (data.id) {
      // Update
      const updated = faqs.map((f) =>
        f.id === data.id
          ? {
              ...f,
              ...data,
              updatedAt: now,
            }
          : f
      );
      updateFaqs(updated);
      showToast({
        type: 'success',
        title: 'FAQ Updated',
        message: 'The FAQ item and bilingual translations were saved successfully.',
      });
    } else {
      // Create
      const newFaq: AdminFaq = {
        ...data,
        id: `faq-${Date.now()}`,
        updatedAt: now,
      };
      updateFaqs([newFaq, ...faqs]);
      showToast({
        type: 'success',
        title: 'FAQ Created',
        message: 'New FAQ has been added to the Hotel Nordic Gate directory.',
      });
    }

    setDrawerOpen(false);
    setEditingFaq(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    const updated = faqs.filter((f) => f.id !== deleteTarget.id);
    updateFaqs(updated);
    setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
    showToast({
      type: 'info',
      title: 'FAQ Deleted',
      message: `"${deleteTarget.questionEn}" was removed.`,
    });
    setDeleteTarget(null);
  };

  const handleBulkPublish = () => {
    const updated = faqs.map((f) =>
      selectedIds.includes(f.id) ? { ...f, status: 'published' as StatusType } : f
    );
    updateFaqs(updated);
    showToast({
      type: 'success',
      title: 'Bulk Update',
      message: `${selectedIds.length} FAQs marked as Published.`,
    });
    setSelectedIds([]);
  };

  const handleBulkDeleteConfirm = () => {
    const updated = faqs.filter((f) => !selectedIds.includes(f.id));
    updateFaqs(updated);
    showToast({
      type: 'info',
      title: 'Bulk Delete',
      message: `${selectedIds.length} FAQ items deleted.`,
    });
    setSelectedIds([]);
    setBulkDeleteConfirmOpen(false);
  };

  const getCategoryLabel = (cat: FaqCategory) => {
    const found = FAQ_CATEGORIES.find((c) => c.value === cat);
    return found ? found.labelEn : cat;
  };

  // Columns definition
  const columns: Column<AdminFaq>[] = [
    {
      key: 'displayOrder',
      header: 'Order',
      sortable: true,
      className: 'w-16 font-mono text-stone-500 text-center',
      headerClassName: 'w-16 text-center',
      render: (faq) => (
        <span className="inline-block px-2 py-0.5 rounded bg-[#EDE7DC]/70 font-semibold text-xs text-[#0D1A26]">
          {faq.displayOrder}
        </span>
      ),
    },
    {
      key: 'questionEn',
      header: 'Question (English / Swedish)',
      sortable: true,
      className: 'min-w-[280px] max-w-md',
      render: (faq) => (
        <div className="space-y-1">
          <div className="font-semibold text-[#0D1A26] flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-[#BF8641] px-1 py-0.2 bg-amber-50 rounded">
              EN
            </span>
            <span>{faq.questionEn}</span>
          </div>
          <div className="text-xs text-[#5D6B78] flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-bold text-stone-500 px-1 py-0.2 bg-stone-100 rounded">
              SV
            </span>
            <span className="truncate">{faq.questionSv}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      className: 'whitespace-nowrap',
      render: (faq) => (
        <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-[#EDE7DC]/50 text-[#0D1A26] border border-[#D3C8B9]/50">
          {getCategoryLabel(faq.category)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      className: 'whitespace-nowrap',
      render: (faq) => <StatusBadge status={faq.status} />,
    },
    {
      key: 'updatedAt',
      header: 'Last Modified',
      sortable: true,
      className: 'whitespace-nowrap text-stone-500 text-xs',
      render: (faq) => (
        <div>
          <div>{faq.updatedAt}</div>
          {faq.author && (
            <div className="text-[10px] text-stone-400">by {faq.author}</div>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right whitespace-nowrap w-24',
      headerClassName: 'text-right w-24',
      render: (faq) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => handleOpenEdit(faq)}
            className="p-1.5 text-stone-500 hover:text-[#0D1A26] hover:bg-[#EDE7DC]/60 rounded-md transition-colors cursor-pointer"
            title="Edit FAQ"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(faq)}
            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
            title="Delete FAQ"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header with Action */}
      <AdminPageHeader
        title="FAQs Management"
        subtitle="Manage frequently asked questions, answers, and multilingual Swedish/English content for hotel guests."
        badge={
          <span className="text-xs font-bold px-2.5 py-1 bg-[#BF8641]/15 text-[#BF8641] rounded-full">
            {faqs.length} Total
          </span>
        }
        actions={
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleOpenCreate}
          >
            Add New FAQ
          </Button>
        }
      />

      {/* Bulk Action Bar (when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-3.5 bg-[#0D1A26] text-white rounded-xl shadow-md animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <span className="w-6 h-6 rounded-full bg-[#BF8641] flex items-center justify-center text-xs font-bold">
              {selectedIds.length}
            </span>
            <span>Items Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkPublish}
              className="!border-white/30 !text-white hover:!bg-white/10"
              leftIcon={<CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
            >
              Publish Selected
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setBulkDeleteConfirmOpen(true)}
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Delete Selected
            </Button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-xs text-stone-300 hover:text-white px-2 py-1 cursor-pointer"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* Table Container Card */}
      <div className="bg-white rounded-xl border border-[#EDE7DC] shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <TableToolbar
          searchValue={searchValue}
          onSearchChange={(val) => {
            setSearchValue(val);
            setCurrentPage(1);
          }}
          searchPlaceholder="Search questions and answers..."
          categoryFilter={{
            label: 'Category',
            value: categoryFilter,
            options: [
              { label: 'All Categories', value: 'all' },
              ...FAQ_CATEGORIES.map((c) => ({
                label: c.labelEn,
                value: c.value,
              })),
            ],
            onChange: (val) => {
              setCategoryFilter(val);
              setCurrentPage(1);
            },
          }}
          statusFilter={{
            value: statusFilter,
            options: [
              { label: 'All Statuses', value: 'all' },
              { label: 'Published', value: 'published' },
              { label: 'Draft', value: 'draft' },
              { label: 'Archived', value: 'archived' },
            ],
            onChange: (val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            },
          }}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={handleResetFilters}
        />

        {/* Generic Typed Data Table */}
        <AdminDataTable<AdminFaq>
          columns={columns}
          data={paginatedFaqs}
          keyExtractor={(faq) => faq.id}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          selectable={true}
          selectedIds={selectedIds}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
          emptyState={{
            title: hasActiveFilters ? 'No matching FAQs' : 'No FAQs created yet',
            description: hasActiveFilters
              ? 'Try adjusting your search terms or filters.'
              : 'Create your first FAQ item to help guests learn about Hotel Nordic Gate.',
            actionLabel: hasActiveFilters ? 'Clear Filters' : 'Add First FAQ',
            onAction: hasActiveFilters ? handleResetFilters : handleOpenCreate,
          }}
        />

        {/* Pagination */}
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
          setEditingFaq(null);
        }}
        title={editingFaq ? 'Edit FAQ Item' : 'Add New FAQ Item'}
        description={
          editingFaq
            ? 'Update the questions, answers, and visibility for this FAQ.'
            : 'Fill in both Swedish and English translations for the website.'
        }
        size="lg"
      >
        <FaqForm
          initialData={editingFaq}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setDrawerOpen(false);
            setEditingFaq(null);
          }}
        />
      </Drawer>

      {/* Single Item Delete Confirmation */}
      {deleteTarget && (
        <DeleteConfirmation
          isOpen={true}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          itemName={deleteTarget.questionEn}
          itemType="FAQ"
        />
      )}

      {/* Bulk Delete Confirmation */}
      {bulkDeleteConfirmOpen && (
        <DeleteConfirmation
          isOpen={true}
          onClose={() => setBulkDeleteConfirmOpen(false)}
          onConfirm={handleBulkDeleteConfirm}
          itemName={`${selectedIds.length} selected FAQ items`}
          itemType="FAQs"
        />
      )}
    </div>
  );
};
