import { useSyncExternalStore } from "react";

let state = {
  open: false,
  term: "",
  expanded: false,
  words: new Set<string>(
    JSON.parse(localStorage.getItem("bw-dictionary") || "[]"),
  ),
};
let listeners = [] as any[];

const dictionaryStore = {
  subscribe(listener: any) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((li) => li !== listener);
    };
  },
  getSnapshot() {
    return state;
  },
};

export const dictionaryActions = {
  watch() {
    const abortController = new AbortController();

    document.addEventListener(
      "selectionchange",
      () => {
        const selection = window.getSelection();
        if (selection && selection.toString().trim()) {
          dictionaryActions.setSearchTerm(selection.toString());
        } else {
          dictionaryActions.closeDialog();
        }
      },
      { signal: abortController.signal },
    );

    return () => {
      abortController.abort();
    };
  },
  setSearchTerm(term: string) {
    state = {
      ...state,
      term: term.toLowerCase(),
      open: true,
    };
    emitChange();
  },
  toggleExpanded() {
    state = {
      ...state,
      expanded: !state.expanded,
    };
    emitChange();
  },
  closeDialog() {
    state = {
      term: "",
      open: false,
      expanded: false,
      words: state.words,
    };
    emitChange();
  },
  addWordToDictionary() {
    state = {
      ...state,
      words: new Set([...state.words, state.term.trim().toLowerCase()]),
    };
    localStorage.setItem(
      "bw-dictionary",
      JSON.stringify(Array.from(state.words)),
    );
    emitChange();
  },
  removeWordToDictionary() {
    const words = new Set(state.words);
    words.delete(state.term.trim().toLowerCase());
    state = { ...state, words };
    localStorage.setItem(
      "bw-dictionary",
      JSON.stringify(Array.from(state.words)),
    );
    emitChange();
  },
  get isInDictionary() {
    if (!state.term.trim()) return false;
    return state.words.has(state.term);
  },
};

function emitChange() {
  listeners.forEach((l) => l());
}

function useDictionary() {
  return useSyncExternalStore(
    dictionaryStore.subscribe,
    dictionaryStore.getSnapshot,
  );
}

export { useDictionary };
