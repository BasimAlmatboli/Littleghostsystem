import { Loader2, Save, Undo2 } from 'lucide-react';

interface SaveBarProps {
  visible: boolean;
  message: string;
  saveLabel: string;
  isSaving?: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

/** Floating bar shown at the bottom of the screen while there are unsaved changes. */
export const SaveBar = ({ visible, message, saveLabel, isSaving = false, onSave, onDiscard }: SaveBarProps) => (
  <div
    className={`fixed inset-x-0 bottom-6 z-40 flex justify-center px-4 transition-all duration-300 ${visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-8 opacity-0'
      }`}
  >
    <div className="flex w-full max-w-xl items-center gap-3 rounded-2xl bg-gray-900/95 py-3 pl-5 pr-3 text-white shadow-2xl shadow-gray-900/30 ring-1 ring-white/10 backdrop-blur">
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />
      </span>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onDiscard}
        disabled={isSaving}
        className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
      >
        <Undo2 className="h-4 w-4" />
        <span className="hidden sm:inline">Discard</span>
      </button>
      <button
        onClick={onSave}
        disabled={isSaving}
        className="flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-colors hover:bg-blue-400 disabled:opacity-60"
      >
        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        <span>{isSaving ? 'Saving...' : saveLabel}</span>
      </button>
    </div>
  </div>
);
