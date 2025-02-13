import { Preset } from "./PresetsManager";
import { TipButton } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Download, Trash } from "lucide-react";

interface PresetLoaderProps {
  presets: Preset[];
  visible: boolean;
  onLoad: (presetName: string) => void;
  onDelete: (presetName: string) => void;
  onClose: () => void;
}

function PresetLoader({
  visible,
  presets,
  onLoad,
  onDelete,
  onClose,
}: PresetLoaderProps) {
  return (
    <Dialog open={visible} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="flex flex-col lg:max-w-screen-lg overflow-y-scroll h-80 sm:max-w-[425px] bg-[#020203] text-white border-[#2A2A2A]">
        <DialogHeader>
          <DialogTitle>Manage Saves</DialogTitle>
          <DialogDescription className="text-gray-400">
            Here you can load, delete and modify your existing saves
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1">
          {presets.length ? (
            <div className="space-y-2">
              {presets.map((preset, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-3 px-4 rounded border border-[#3A3A3A]"
                >
                  <span>{preset.name}</span>
                  <div className="flex gap-2">
                    <TipButton
                      tooltip="Load"
                      onClick={() => onLoad(preset.name)}
                      size="sm"
                      variant="outline"
                      className="m-0 px-2"
                    >
                      <Download />
                    </TipButton>
                    <TipButton
                      tooltip="Delete"
                      className="m-0 px-2"
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(preset.name)}
                    >
                      <Trash />
                    </TipButton>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <NoPresetsIllustration />
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function NoPresetsIllustration() {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-4"
      >
        <rect
          x="40"
          y="40"
          width="120"
          height="120"
          rx="8"
          stroke="#4B5563"
          strokeWidth="4"
        />
        <path
          d="M70 80H130"
          stroke="#4B5563"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M70 100H130"
          stroke="#4B5563"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M70 120H130"
          stroke="#4B5563"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="160" cy="160" r="30" fill="#4B5563" />
        <path
          d="M150 160H170"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M160 150V170"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      <p className="text-gray-300 text-lg font-medium">No presets saved yet</p>
      <p className="text-gray-400 text-sm mt-2">
        Create a preset to get started
      </p>
    </div>
  );
}

export default PresetLoader;
