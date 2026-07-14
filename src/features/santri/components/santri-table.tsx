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

const DUMMY_DATA = [
  {
    id: "1",
    nis: "554202507001",
    nama: "Abyan Nazhir Ikbaarruddin",
    kelas: "10",
    program: "R",
  },
  {
    id: "2",
    nis: "554202507002",
    nama: "Ach. Fikrie Ardana",
    kelas: "10",
    program: "R",
  },
  {
    id: "3",
    nis: "554202507003",
    nama: "Ach. Lutfian",
    kelas: "10",
    program: "R",
  },
  {
    id: "4",
    nis: "554202507004",
    nama: "Achmad Fadil Muzzaki",
    kelas: "10",
    program: "R",
  },
  {
    id: "5",
    nis: "554202507005",
    nama: "Ahmad Alfiyano",
    kelas: "11",
    program: "T",
  },
];

interface SantriTableProps {
  onEdit?: () => void;
}

export function SantriTable({ onEdit }: SantriTableProps) {
  return (
    <div className="bg-surface">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NAMA LENGKAP</TableHead>
            <TableHead>NIS</TableHead>
            <TableHead className="w-[100px]">KELAS</TableHead>
            <TableHead className="text-right w-[150px]">AKSI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {DUMMY_DATA.map((santri) => (
            <TableRow key={santri.id}>
              <TableCell>
                <span className="font-semibold text-foreground">
                  {santri.nama}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-primary">
                  {santri.nis}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-medium text-xs px-2 py-0.5 text-primary bg-primary/10">
                  {santri.kelas}{santri.program}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={onEdit}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                    <KeyRound className="h-4 w-4" />
                    <span className="sr-only">Reset Password</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
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
