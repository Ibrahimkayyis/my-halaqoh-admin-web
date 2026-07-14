"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, KeyRound, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Guru } from "../types/guru.types";

interface GuruTableProps {
  data: Guru[];
  isLoading: boolean;
  onEdit: (guru: Guru) => void;
  onDelete: (guru: Guru) => void;
  onResetPassword: (guru: Guru) => void;
}

export function GuruTable({
  data,
  isLoading,
  onEdit,
  onDelete,
  onResetPassword,
}: GuruTableProps) {
  if (isLoading) {
    return (
      <div className="bg-surface rounded-lg border border-border/40 p-4 space-y-3">
        <div className="flex gap-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-6 w-1/4" />
        </div>
        <hr className="border-border/40" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <Skeleton className="h-5 flex-1" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-surface rounded-lg border border-dashed border-border/60 p-8 text-center text-muted-foreground">
        Tidak ada data guru ditemukan.
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-lg border border-border/40 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NAMA LENGKAP</TableHead>
            <TableHead>NIP</TableHead>
            <TableHead className="w-[150px]">PROGRAM</TableHead>
            <TableHead className="text-right w-[150px]">AKSI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((guru) => (
            <TableRow key={guru.id}>
              <TableCell>
                <span className="font-semibold text-foreground">
                  {guru.nama}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-primary font-medium">
                  {guru.nip}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-medium text-xs px-2 py-0.5 text-primary bg-primary/10">
                  {guru.program === "R" ? "Reguler" : "Takhassus"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => onEdit(guru)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => onResetPassword(guru)}
                    disabled={!guru.authUid}
                    title={!guru.authUid ? "Akun Auth belum aktif" : "Reset Password"}
                  >
                    <KeyRound className="h-4 w-4" />
                    <span className="sr-only">Reset Password</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(guru)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Hapus</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
