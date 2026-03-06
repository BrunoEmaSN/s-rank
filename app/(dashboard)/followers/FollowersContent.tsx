"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { PeopleIcon } from "@/components/icons";
import { buttonBase, buttonVariants, buttonSizes } from "@/components/ui";
import type { Follower } from "@/types/follows";

type FollowersState = {
  data: Follower[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  loading: boolean;
  error: string | null;
};

export function FollowersContent({ initialPage }: { initialPage: number }) {
  const [state, setState] = useState<FollowersState>({
    data: [],
    pagination: null,
    loading: true,
    error: null,
  });
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  const fetchFollowers = useCallback(async (p: number) => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch(`/api/users/me/followers?page=${p}&limit=12`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Error al cargar");
      }
      const json = await res.json();
      setState({
        data: json.data,
        pagination: json.pagination,
        loading: false,
        error: null,
      });
    } catch (e) {
      setState((s) => ({
        ...s,
        loading: false,
        error: e instanceof Error ? e.message : "Error desconocido",
      }));
    }
  }, []);

  useEffect(() => {
    fetchFollowers(page);
  }, [page, fetchFollowers]);

  const { data, pagination, loading, error } = state;

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (loading && data.length === 0) {
    return <p className="text-foreground-muted">Cargando...</p>;
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-secondary/80 bg-secondary/50 p-12 text-center">
        <PeopleIcon className="mx-auto mb-3 h-12 w-12 text-foreground-muted" aria-hidden />
        <p className="font-medium text-foreground">Aún no tienes seguidores</p>
        <p className="mt-1 text-sm text-foreground-muted">
          Comparte tu perfil y canal para que la gente te siga.
        </p>
      </div>
    );
  }

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <li
            key={item.userId}
            className="flex items-center gap-4 rounded-xl border border-secondary/80 bg-secondary/50 p-6"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary">
              {item.avatarUrl ? (
                <img
                  src={item.avatarUrl}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold text-foreground-muted">
                  {(item.displayName ?? item.username ?? "?").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground">
                {item.displayName ?? item.username ?? "Usuario"}
              </p>
              {item.username && item.displayName !== item.username && (
                <p className="text-sm text-foreground-muted">@{item.username}</p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {pagination && pagination.totalPages > 1 && (
        <nav
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
          aria-label="Paginación"
        >
          <Link
            href={page > 1 ? `/followers?page=${page - 1}` : "#"}
            className={`${buttonBase} ${buttonVariants.outline} ${buttonSizes.sm}`}
            style={{
              pointerEvents: pagination.hasPrev ? undefined : "none",
              opacity: pagination.hasPrev ? 1 : 0.5,
            }}
          >
            Anterior
          </Link>
          <span className="px-3 text-sm text-foreground-muted">
            Página {pagination.page} de {pagination.totalPages} ({pagination.total} en total)
          </span>
          <Link
            href={pagination.hasNext ? `/followers?page=${page + 1}` : "#"}
            className={`${buttonBase} ${buttonVariants.outline} ${buttonSizes.sm}`}
            style={{
              pointerEvents: pagination.hasNext ? undefined : "none",
              opacity: pagination.hasNext ? 1 : 0.5,
            }}
          >
            Siguiente
          </Link>
        </nav>
      )}
    </>
  );
}
