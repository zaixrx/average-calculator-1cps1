import { BookPlus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { Archive } from "./ArchiveManager";

interface ArchiveCreatorProps {
  visible: boolean;
  archives: Record<string, Archive> | null;
  onClose: () => void;
  onCreateSave: (name: string) => void;
}

function ArchiveCreator({
  visible,
  onCreateSave,
  onClose,
  archives,
}: ArchiveCreatorProps) {
  const [saveName, setSaveName] = useState<string>("");
  const [error, setError] = useState<string | null>("");

  return (
    <Dialog open={visible} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="pb-4 flex flex-col lg:max-w-screen-lg overflow-y-scroll sm:max-w-[425px] bg-[#020203] text-white border-[#2A2A2A]">
        <DialogHeader>
          <DialogTitle>Archive Grades</DialogTitle>
          <DialogDescription className="text-gray-400">
            Save all your grades to avoid repetitive data entry
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-4 items-center">
          <Label htmlFor="name" className="col-span-1 text-gray-200">
            Archive Name:
          </Label>
          <Input
            id="name"
            value={saveName}
            placeholder="First Semester"
            className={`col-span-3 ${error && "border border-red"}`}
            onChange={({ target }) => {
              setSaveName(target.value);
              setError(
                archives && archives[target.value]
                  ? "Name Already Exists"
                  : null
              );
            }}
          />
        </div>
        {error && (
          <div className="p-3 bg-red-900 rounded">
            <span className="text-gray-300">{error}</span>
          </div>
        )}
        <DialogFooter className="border-t border-[#2A2A2A] pt-3">
          <Button
            disabled={error ? true : false}
            variant="mainer"
            className="px-3"
            onClick={() => {
              if (!saveName || (archives && archives[saveName])) return;

              onCreateSave(saveName);
              onClose();
              setSaveName("");
            }}
          >
            <BookPlus />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ArchiveCreator;
