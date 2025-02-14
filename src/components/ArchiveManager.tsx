import { useEffect, useState } from "react";
import { getArchives, storeArchives } from "@/lib/utils";
import { Module } from "./App";

import { GitGraph, Save } from "lucide-react";
import { Button } from "./ui/button";
import ArchiveCreator from "./ArchiveCreator";
import ArchiveLoader from "./ArchiveLoader";

export interface Archive {
  readonly name: string;
  modules: Record<string, Module>;
}

enum UIState {
  Default,
  CreatorVisible,
  LoaderVisible,
}

interface ArchiveManagerProps {
  modules: Record<string, Module>;
  setModules: (modules: Record<string, Module>) => void;
}

function ArchiveManager({ modules, setModules }: ArchiveManagerProps) {
  const [loadedArchives, setLoadedArchives] = useState<Record<
    string,
    Archive
  > | null>(null);
  const [loadedArchive, setLoadedArchive] = useState<string | null>(null);
  const [uiState, setUIState] = useState<UIState>(UIState.Default);

  useEffect(() => {
    setLoadedArchives(getArchives());
  }, []);

  function handleCreateSave(name: string): void {
    let archives = { ...loadedArchives };
    const target = archives[name];

    if (target) {
      target.modules = modules;
    } else {
      archives[name] = { name, modules };
    }

    storeArchives(archives);
    setLoadedArchives(archives);
  }

  function handleLoad(name: string): void {
    let archives = { ...loadedArchives };
    if (!(archives && archives[name])) return;

    setLoadedArchive(name);
    setModules(archives[name].modules);
  }

  function handleDelete(name: string): void {
    let archives = { ...loadedArchives };
    const archive = archives[name];
    if (!archive) return;

    if (archive.name === loadedArchive) setLoadedArchive(null);

    delete archives[name];

    storeArchives(archives);
    setLoadedArchives(archives);
  }

  return (
    <>
      <ArchiveLoader
        visible={uiState === UIState.LoaderVisible}
        archives={loadedArchives}
        onLoad={(archiveName: string) => {
          handleLoad(archiveName);
          setUIState(UIState.Default);
        }}
        onDelete={handleDelete}
        onClose={() => setUIState(UIState.Default)}
      />
      <ArchiveCreator
        visible={uiState === UIState.CreatorVisible}
        archives={loadedArchives}
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
            if (loadedArchive) {
              handleCreateSave(loadedArchive);
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

export default ArchiveManager;
