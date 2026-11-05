"use client";

import { useState, useMemo } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { FeedbackStatsCards } from "@/features/feedback/components/feedback-stats-cards";
import { FeedbackFilterBar } from "@/features/feedback/components/feedback-filter-bar";
import { FeedbackTable } from "@/features/feedback/components/feedback-table";
import { FeedbackDetailDialog } from "@/features/feedback/components/feedback-detail-dialog";
import { useGetFeedbackList } from "@/features/feedback/hooks/use-feedback";
import type { UserFeedback } from "@/types/models/feedback.types";
import { MessageSquareWarning } from "lucide-react";

export default function FeedbackPage() {
  const { data: feedbacks = [], isLoading } = useGetFeedbackList();

  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("semua");
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const [selectedRole, setSelectedRole] = useState("semua");

  const [selectedFeedback, setSelectedFeedback] = useState<UserFeedback | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Compute status counts for filter tabs
  const statusCounts = useMemo(() => {
    let open = 0;
    let inProgress = 0;
    let resolved = 0;

    for (const f of feedbacks) {
      if (f.status === "open") open++;
      else if (f.status === "in_progress") inProgress++;
      else if (f.status === "resolved") resolved++;
    }

    return {
      semua: feedbacks.length,
      open,
      in_progress: inProgress,
      resolved,
    };
  }, [feedbacks]);

  // Filtered list
  const filteredFeedbacks = useMemo(() => {
    const q = search.trim().toLowerCase();

    return feedbacks.filter((item) => {
      // 1. Status Filter
      if (activeStatus !== "semua" && item.status !== activeStatus) {
        return false;
      }

      // 2. Category Filter
      if (selectedCategory !== "semua" && item.category !== selectedCategory) {
        return false;
      }

      // 3. Role Filter
      if (selectedRole !== "semua" && item.userRole !== selectedRole) {
        return false;
      }

      // 4. Search Filter
      if (q) {
        const matchesName = item.userName?.toLowerCase().includes(q);
        const matchesIdentifier = item.userIdentifier?.toLowerCase().includes(q);
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);

        if (!matchesName && !matchesIdentifier && !matchesTitle && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [feedbacks, search, activeStatus, selectedCategory, selectedRole]);

  const handleOpenDetail = (item: UserFeedback) => {
    setSelectedFeedback(item);
    setDialogOpen(true);
  };

  return (
    <PageContainer>
      {/* Header section with icon and subtitle */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <MessageSquareWarning className="h-5 w-5" />
          </div>
          <div>
            <h1
              className="text-xl sm:text-2xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Manajemen Masukan &amp; Kendala
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-sans">
              Pantau laporan kendala, evaluasi saran fitur, dan berikan balasan tindak lanjut resmi langsung ke ponsel pengguna.
            </p>
          </div>
        </div>
      </div>

      {/* Summary metric cards */}
      <FeedbackStatsCards feedbacks={feedbacks} isLoading={isLoading} />

      {/* Filter and search bar */}
      <FeedbackFilterBar
        search={search}
        setSearch={setSearch}
        activeStatus={activeStatus}
        setActiveStatus={setActiveStatus}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        statusCounts={statusCounts}
        totalCount={feedbacks.length}
        filteredCount={filteredFeedbacks.length}
      />

      {/* Data Table */}
      <FeedbackTable
        data={filteredFeedbacks}
        isLoading={isLoading}
        onDetail={handleOpenDetail}
      />

      {/* Detail & Action Dialog */}
      <FeedbackDetailDialog
        feedback={selectedFeedback}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </PageContainer>
  );
}
