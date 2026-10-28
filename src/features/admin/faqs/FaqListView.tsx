import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  HelpCircle,
  FileQuestion,
  Hash,
} from 'lucide-react';
import {
  AdminFaq,
  ApiFaqPayload,
  FAQ_CATEGORIES,
} from './faqTypes';
import { loadAdminFaqs, saveAdminFaqs } from '../../../data/adminMockData';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { TableToolbar } from '../../../components/admin/TableToolbar';
import { AdminDataTable, Column } from '../../../components/admin/AdminDataTable';
import { Pagination } from '../../../components/admin/Pagination';
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
  const [sortColumn, setSortColumn] = useState<string>('display_order');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Drawer state for Create / Edit
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<AdminFaq | null>(null);

  // Delete dialog state
  const [deleteTarget, setDeleteTarget] = useState<AdminFaq | null>(null);

  const updateFaqs = (newFaqs: AdminFaq[]) => {
    setFaqs(newFaqs);
    saveAdminFaqs(newFaqs);
  };

  // Search & Filters
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      if (searchValue.trim()) {
        const query = searchValue.toLowerCase();
        const matchesQuery =
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query) ||
          (faq.questionSv && faq.questionSv.toLowerCase().includes(query)) ||
          (faq.answerSv && faq.answerSv.toLowerCase().includes(query));
        if (!matchesQuery) return false;
      }

      if (categoryFilter !== 'all' && faq.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [faqs, searchValue, categoryFilter]);

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
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(searchValue) || categoryFilter !== 'all';

  const handleOpenCreate = () => {
    setEditingFaq(null);
    setDrawerOpen(true);
  };

  const handleOpenEdit = (faq: AdminFaq) => {
    setEditingFaq(faq);
    setDrawerOpen(true);
  };

  const handleFormSubmit = (payload: ApiFaqPayload & { id?: number }) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    if (payload.id) {
      // Update existing FAQ
      const updated = faqs.map((f) =>
        f.id === payload.id
          ? {
              ...f,
              question: payload.question,
              answer: payload.answer,
              category: payload.category,
              display_order: payload.display_order,
              updated_at: now,
            }
          : f
      );
      updateFaqs(updated);
      showToast({
        type: 'success',
        title: 'FAQ Updated',
        message: `FAQ #${payload.id} successfully updated with schema-aligned payload.`,
      });
    } else {
      // Create new FAQ
      const nextId = faqs.reduce((max, item) => Math.max(max, item.id), 0) + 1;
      const newFaq: AdminFaq = {
        id: nextId,
        question: payload.question,
        answer: payload.answer,
        category: payload.category,
        display_order: payload.display_order,
        created_at: now,
        updated_at: now,
      };
      updateFaqs([newFaq, ...faqs]);
      showToast({
        type: 'success',
        title: 'FAQ Created',
        message: `New FAQ #${nextId} created successfully.`,
      });
    }

    setDrawerOpen(false);
    setEditingFaq(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    const updated = faqs.filter((f) => f.id !== deleteTarget.id);
    updateFaqs(updated);
    showToast({
      type: 'info',
      title: 'FAQ Removed',
      message: `FAQ #${deleteTarget.id} was deleted.`,
    });
    setDeleteTarget(null);
  };

  const getCategoryLabel = (cat?: string) => {
    const found = FAQ_CATEGORIES.find((c) => c.value === cat);
    return found ? found.label : cat || 'General';
  };

  const columns: Column<AdminFaq>[] = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      className: 'w-16 font-mono text-stone-400 text-center',
      headerClassName: 'w-16 text-center',
      render: (faq) => (
        <span className="text-xs text-stone-400 font-mono">#{faq.id}</span>
      ),
    },
    {
      key: 'display_order',
      header: 'Order',
      sortable: true,
      className: 'w-16 font-mono text-center',
      headerClassName: 'w-16 text-center',
      render: (faq) => (
        <span className="inline-block px-2 py-0.5 rounded bg-[#EDE7DC]/70 font-semibold text-xs text-[#0D1A26]">
          {faq.display_order}
        </span>
      ),
    },
    {
      key: 'question',
      header: 'Question & Answer Preview',
      sortable: true,
      className: 'min-w-[320px] max-w-lg',
      render: (faq) => (
        <div className="space-y-1">
          <p className="font-semibold text-[#0D1A26] line-clamp-2">
            {faq.question}
          </p>
          <p className="text-xs text-[#5D6B78] line-clamp-2 leading-relaxed">
            {faq.answer}
          </p>
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
      key: 'updated_at',
      header: 'Last Modified',
      sortable: true,
      className: 'whitespace-nowrap text-stone-500 text-xs',
      render: (faq) => <span>{faq.updated_at || faq.updatedAt || '—'}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      className: 'text-right whitespace-nowrap w-24',
      headerClassName: 'text-right w-24',
      render: (faq) => (
        <div
          className="flex items-center justify-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
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
      <AdminPageHeader
        title="FAQs Management"
        subtitle="Manage frequently asked questions, answers, display order, and categorization."
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

      <div className="bg-white rounded-xl border border-[#EDE7DC] shadow-xs overflow-hidden">
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
                label: c.label,
                value: c.value,
              })),
            ],
            onChange: (val) => {
              setCategoryFilter(val);
              setCurrentPage(1);
            },
          }}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={handleResetFilters}
        />

        <AdminDataTable<AdminFaq>
          columns={columns}
          data={paginatedFaqs}
          keyExtractor={(faq) => faq.id.toString()}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          emptyState={{
            title: hasActiveFilters ? 'No matching FAQs' : 'No FAQs created yet',
            description: hasActiveFilters
              ? 'Try adjusting your search terms or filters.'
              : 'Create your first FAQ item for Hotel Nordic Gate guests.',
            actionLabel: hasActiveFilters ? 'Clear Filters' : 'Add First FAQ',
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

      <Drawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingFaq(null);
        }}
        title={editingFaq ? `Edit FAQ #${editingFaq.id}` : 'Add New FAQ Item'}
        description="Configure guest question, answer, category, and display order."
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

      {deleteTarget && (
        <DeleteConfirmation
          isOpen={true}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          itemName={deleteTarget.question}
          itemType="FAQ"
        />
      )}
    </div>
  );
};
