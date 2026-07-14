"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import { Plus, Trash2, Save, X } from "lucide-react";
import { useGetKelas } from "@/features/kelas-program/hooks/use-kelas";
import { useGetProgram } from "@/features/kelas-program/hooks/use-program";
import { GuruSelector, type GuruSelection } from "./guru-selector";
import { SantriTransferList, type SantriSelection } from "./santri-transfer-list";

const HalaqohFormSchema = z.object({
  nama: z.string().min(1, "Nama halaqoh wajib diisi"),
  kelas: z.string().min(1, "Pilih kelas"),
  program: z.string().min(1, "Pilih program"),
  guruId: z.string().min(1, "Pilih guru pengampu"),
});

type HalaqohFormValues = z.infer<typeof HalaqohFormSchema>;

interface HalaqohFormProps {
  initialValues?: {
    nama: string;
    kelas: string;
    program: "R" | "T";
    guruId: string;
    santriIds: string[];
  } | null;
  onSubmit: (data: HalaqohFormValues & { santriIds: string[] }) => void;
  onCancel: () => void;
  guruList: GuruSelection[];
  allSantriList: SantriSelection[];
}

export function HalaqohForm({
  initialValues,
  onSubmit,
  onCancel,
  guruList,
  allSantriList,
}: HalaqohFormProps) {
  const [transferOpen, setTransferOpen] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState<SantriSelection[]>([]);

  const { data: kelasList = [] } = useGetKelas();
  const { data: programList = [] } = useGetProgram();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<HalaqohFormValues>({
    resolver: zodResolver(HalaqohFormSchema),
    defaultValues: {
      nama: "",
      kelas: "",
      program: "",
      guruId: "",
    },
  });

  // Load initial values if editing
  useEffect(() => {
    if (initialValues) {
      reset({
        nama: initialValues.nama,
        kelas: initialValues.kelas,
        program: initialValues.program,
        guruId: initialValues.guruId,
      });

      // Load initial selected santri details
      const initialSantri = allSantriList.filter((s) => 
        initialValues.santriIds.includes(s.id)
      );
      setSelectedSantri(initialSantri);
    } else {
      reset({
        nama: "",
        kelas: "",
        program: "",
        guruId: "",
      });
      setSelectedSantri([]);
    }
  }, [initialValues, reset, allSantriList]);

  const handleAddSantriFromList = (newlySelected: SantriSelection[]) => {
    setSelectedSantri(newlySelected);
  };

  const handleRemoveSantri = (id: string) => {
    setSelectedSantri((prev) => prev.filter((s) => s.id !== id));
  };

  const handleFormSubmit = (data: HalaqohFormValues) => {
    onSubmit({
      ...data,
      santriIds: selectedSantri.map((s) => s.id),
    });
  };

  return (
    <div className="bg-surface rounded-lg border border-border/40 p-6 shadow-card space-y-6 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <FieldGroup>
          {/* Nama Halaqoh */}
          <Controller
            control={control}
            name="nama"
            render={({ field }) => (
              <Field>
                <FieldLabel>Nama Halaqoh</FieldLabel>
                <Input placeholder="Contoh: Halaqoh 7A" {...field} />
                <FieldError errors={[errors.nama]} />
              </Field>
            )}
          />

          {/* Kelas & Program grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Controller
              control={control}
              name="kelas"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Kelas</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      {kelasList.map((k) => (
                        <SelectItem key={k.id} value={k.nama}>
                          Kelas {k.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[errors.kelas]} />
                </Field>
              )}
            />

            <Controller
              control={control}
              name="program"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Program</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programList.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError errors={[errors.program]} />
                </Field>
              )}
            />
          </div>

          {/* Pengampu (GuruSelector) */}
          <Controller
            control={control}
            name="guruId"
            render={({ field }) => (
              <Field>
                <FieldLabel>Pengampu (Guru)</FieldLabel>
                <GuruSelector
                  value={field.value}
                  onChange={(id) => field.onChange(id)}
                  guruList={guruList}
                />
                <FieldError errors={[errors.guruId]} />
              </Field>
            )}
          />
        </FieldGroup>

        {/* Daftar Santri Section */}
        <div className="space-y-3 border-t pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Daftar Santri</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5"
              onClick={() => setTransferOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Tambah Santri
            </Button>
          </div>

          {/* Santri List Container */}
          <div className="border rounded-lg bg-muted/10 divide-y max-h-[300px] overflow-y-auto">
            {selectedSantri.length === 0 ? (
              <div className="flex items-center justify-center p-8 text-muted-foreground text-sm font-medium">
                -
              </div>
            ) : (
              selectedSantri.map((santri) => (
                <div key={santri.id} className="flex items-center justify-between p-3 bg-surface hover:bg-muted/10 transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-primary block leading-none">
                      {santri.nis}
                    </span>
                    <span className="font-semibold text-xs text-foreground block">
                      {santri.nama}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex gap-1 items-center">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/20 text-primary bg-primary/5">
                        Kelas {santri.kelas}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 text-primary bg-primary/10">
                        {santri.program === "R" || santri.program === "Reguler" ? "Reguler" : "Takhassus"}
                      </Badge>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveSantri(santri.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Hapus</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Total Selected */}
          <div className="text-xs text-muted-foreground font-semibold">
            Total: {selectedSantri.length} Santri terpilih
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center justify-end gap-3 border-t pt-5">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            <X className="w-4 h-4 mr-2" />
            Batal
          </Button>
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="w-4 h-4 mr-2" />
            Simpan Halaqoh
          </Button>
        </div>
      </form>

      {/* Santri Transfer Dialog */}
      <SantriTransferList
        open={transferOpen}
        onOpenChange={setTransferOpen}
        allSantriList={allSantriList}
        alreadySelectedIds={selectedSantri.map((s) => s.id)}
        onAddSantri={handleAddSantriFromList}
      />
    </div>
  );
}
