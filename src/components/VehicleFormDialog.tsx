import type { VehicleInventory } from "@/types/inventory";
import VehicleForm from "./VehicleForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VehicleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<VehicleInventory>;
  onSubmit: (data: any) => void;
  mode: "add" | "edit";
}

export function VehicleFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  mode,
}: VehicleFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Vehicle" : "Edit Vehicle"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Add a new vehicle to your fleet inventory"
              : "Update vehicle information"}
          </DialogDescription>
        </DialogHeader>
        <VehicleForm
          initialData={initialData}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
