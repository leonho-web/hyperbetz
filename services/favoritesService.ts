"use client";

// Simple favorites storage independent of user session
const FAVORITES_KEY = "mw_favorite_games";

export type FavoriteGameId = number | string;

function readFavorites(): FavoriteGameId[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FavoriteGameId[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeFavorites(ids: FavoriteGameId[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent("favorites:changed"));
  } catch {
    // no-op
  }
}

export const favoritesService = {
  getAll(): FavoriteGameId[] {
    return readFavorites();
  },
  isFavorite(id: FavoriteGameId): boolean {
    return readFavorites().some((fav) => String(fav) === String(id));
  },
  add(id: FavoriteGameId): void {
    const current = readFavorites();
    if (!current.some((fav) => String(fav) === String(id))) {
      writeFavorites([...current, id]);
    }
  },
  remove(id: FavoriteGameId): void {
    const current = readFavorites();
    writeFavorites(current.filter((fav) => String(fav) !== String(id)));
  },
  toggle(id: FavoriteGameId): boolean {
    const current = readFavorites();
    const exists = current.some((fav) => String(fav) === String(id));
    if (exists) {
      writeFavorites(current.filter((fav) => String(fav) !== String(id)));
      return false;
    }
    writeFavorites([...current, id]);
    return true;
  },
  onChange(handler: () => void): () => void {
    const listener = () => handler();
    if (typeof window !== "undefined") {
      window.addEventListener("favorites:changed", listener);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("favorites:changed", listener);
      }
    };
  },
};

export default favoritesService;



