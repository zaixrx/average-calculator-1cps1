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

interface PresetCreatorProps {
  visible: boolean;
  onCreateSave: (name: string) => void;
  onClose: () => void;
}

function PresetCreator({ visible, onCreateSave, onClose }: PresetCreatorProps) {
  const [saveName, setSaveName] = useState<string>("");

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
            className="col-span-3"
            onChange={({ target }) => {
              setSaveName(target.value);
            }}
          />
        </div>
        <DialogFooter className="border-t border-[#2A2A2A] pt-3">
          <Button
            variant="mainer"
            className="px-3"
            onClick={() => {
              if (!saveName) return;

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

export default PresetCreator;
