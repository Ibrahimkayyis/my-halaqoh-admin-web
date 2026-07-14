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

export interface GuruDummy {
  id: string;
  nip: string;
  nama: string;
  phone?: string;
  program: "R" | "T";
}

const DUMMY_DATA: GuruDummy[] = [
  {
    id: "1",
    nip: "19880501201501",
    nama: "Ustadz H. Luqman Hakim, Lc.",
    phone: "081234567890",
    program: "T",
  },
  {
    id: "2",
    nip: "19900812201802",
    nama: "Ustadz Ahmad Fauzi, S.Pd.I.",
    phone: "081298765432",
    program: "R",
  },
  {
    id: "3",
    nip: "19920315201901",
    nama: "Ustadz Muhammad Ridho, M.Ag.",
    phone: "081345678901",
    program: "T",
  },
  {
    id: "4",
    nip: "19951120202102",
    nama: "Ustadzah Fatimah Azzahra, S.Ag.",
    phone: "081398765432",
    program: "R",
  },
  {
    id: "5",
    nip: "19960707202201",
    nama: "Ustadzah Aisyah Humaira, S.Pd.",
    phone: "081288889999",
    program: "R",
  },
];

interface GuruTableProps {
  onEdit?: (guru: GuruDummy) => void;
  onDelete?: (guru: GuruDummy) => void;
  onResetPassword?: (guru: GuruDummy) => void;
}

export function GuruTable({ onEdit, onDelete, onResetPassword }: GuruTableProps) {
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
          {DUMMY_DATA.map((guru) => (
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
                    onClick={() => onEdit?.(guru)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => onResetPassword?.(guru)}
                  >
                    <KeyRound className="h-4 w-4" />
                    <span className="sr-only">Reset Password</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete?.(guru)}
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
