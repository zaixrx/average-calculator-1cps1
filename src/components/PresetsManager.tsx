import { useEffect, useState } from "react";
import PresetCreator from "./PresetCreator";
import PresetLoader from "./PresetLoader";
import { getPresets, storePresets } from "@/lib/utils";
import { T_Module } from "./App";
import { GitGraph, Save } from "lucide-react";
import { Button } from "./ui/button";

export interface Preset {
  readonly name: string;
  modules: T_Module[];
}

enum UIState {
  Default,
  CreatorVisible,
  LoaderVisible,
}

interface PresetManagerProps {
  modules: T_Module[];
  setModules: (modules: T_Module[]) => void;
}

function PresetManager({ modules, setModules }: PresetManagerProps) {
  const [loadedPresets, setLoadedPresets] = useState<Preset[]>([]);
  const [loadedPreset, setLoadedPreset] = useState<Preset | null>(null);
  const [uiState, setUIState] = useState<UIState>(UIState.Default);

  useEffect(() => {
    setLoadedPresets(getPresets() || []);
  }, []);

  function handleCreateSave(name: string): void {
    let presets: Preset[] = [...loadedPresets];
    const target = presets.find((p) => p.name === name);

    if (target) {
      target.modules = modules;
    } else {
      presets.push({ name, modules });
    }

    storePresets(presets);
    setLoadedPresets(presets);
  }

  function handleLoad(presetName: string): void {
    let presets: Preset[] | null = getPresets() || [];
    const preset = presets.find((p) => p.name === presetName);
    if (!preset) return;

    setLoadedPreset(preset);
    setModules(preset.modules);
  }

  function handleDelete(presetName: string): void {
    let presets: Preset[] = [...loadedPresets];
    const preset = presets.find((p) => p.name === presetName);
    if (!preset) return;

    if (preset.name === loadedPreset?.name) setLoadedPreset(null);

    presets.splice(presets.indexOf(preset), 1);
    storePresets(presets);
    setLoadedPresets(presets);
  }

  return (
    <>
      <PresetLoader
        visible={uiState === UIState.LoaderVisible}
        presets={loadedPresets}
        onLoad={handleLoad}
        onDelete={handleDelete}
        onClose={() => setUIState(UIState.Default)}
      />
      <PresetCreator
        visible={uiState === UIState.CreatorVisible}
        onCreateSave={handleCreateSave}
        onClose={() => setUIState(UIState.Default)}
      />
      <div className="flex gap-2 my-2">
        <Button
          onClick={() => {
            setUIState(UIState.LoaderVisible);
          }}
          variant="mainer"
        >
          Archives
          <GitGraph />
        </Button>
        <Button
          onClick={() => {
            if (loadedPreset) {
              handleCreateSave(loadedPreset.name);
            } else {
              setUIState(UIState.CreatorVisible);
            }
          }}
          variant="mainer"
        >
          Save
          <Save />
        </Button>
      </div>
    </>
  );
}

export default PresetManager;
