"use client";

import { useMemo } from "react";
import {
  MessageSquare,
  Clock,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserFeedback } from "@/types/models/feedback.types";

interface FeedbackStatsCardsProps {
  feedbacks: UserFeedback[];
  isLoading?: boolean;
}

export function FeedbackStatsCards({
  feedbacks,
  isLoading = false,
}: FeedbackStatsCardsProps) {
  const counts = useMemo(() => {
    let open = 0;
    let inProgress = 0;
    let resolved = 0;

    for (const f of feedbacks) {
      if (f.status === "open") open++;
      else if (f.status === "in_progress") inProgress++;
      else if (f.status === "resolved") resolved++;
    }

    return {
      total: feedbacks.length,
      open,
      inProgress,
      resolved,
    };
  }, [feedbacks]);

  const cards = [
    {
      title: "Total Masukan",
      value: counts.total,
      icon: MessageSquare,
      iconColor: "text-muted-foreground/70",
      accentBg: "bg-muted",
    },
    {
      title: "Menunggu Tindak Lanjut",
      value: counts.open,
      icon: Clock,
      iconColor: "text-warning",
      accentBg: "bg-warning/10",
      badgeText: counts.open > 0 ? `${counts.open} Baru` : undefined,
      badgeColor: "bg-warning/15 text-warning font-semibold",
    },
    {
      title: "Sedang Diproses",
      value: counts.inProgress,
      icon: Loader2,
      iconColor: "text-info",
      accentBg: "bg-info/10",
    },
    {
      title: "Selesai Ditindaklanjuti",
      value: counts.resolved,
      icon: CheckCircle2,
      iconColor: "text-success",
      accentBg: "bg-success/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="shadow-xs border-border/60 rounded-xl bg-card">
            <CardContent className="p-4 sm:p-5 space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-7 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <Card
            key={i}
            className="shadow-xs border-border/60 rounded-xl bg-card transition-colors hover:border-border"
          >
            <CardContent className="p-4 sm:p-5 space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 min-w-0">
                  <span className={`p-1 rounded-md ${card.accentBg} shrink-0`}>
                    <Icon className={`h-3.5 w-3.5 ${card.iconColor}`} />
                  </span>
                  <span className="truncate">{card.title}</span>
                </span>
                {card.badgeText && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${card.badgeColor}`}
                  >
                    {card.badgeText}
                  </span>
                )}
              </div>
              <p className="text-xl sm:text-2xl font-medium font-mono text-foreground tracking-tight">
                {card.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
