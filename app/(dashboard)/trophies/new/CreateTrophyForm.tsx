"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Label, LabelText, Select, Input, Alert } from "@/components/ui";
import { inputBase } from "@/components/ui/input";
import { createTrophy, type CreateTrophyInput, type TrophyRuleInput } from "../actions";
import { TROPHY_RULE_TYPES } from "@/lib/trophy-rules";
import { TrophyImageUpload } from "@/components/TrophyImageUpload";

type Rarity = "common" | "rare" | "epic" | "legendary";
type SourcePlatform = "Twitch" | "Kick";
type GrantMode = "auto" | "manual";

interface RuleBlock {
  id: string;
  ruleType: string;
  value: number;
}

export function CreateTrophyForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rarity, setRarity] = useState<Rarity>("common");
  const [icon, setIcon] = useState<string | null>(null);
  const [sourcePlatform, setSourcePlatform] = useState<SourcePlatform>("Twitch");
  const [grantMode, setGrantMode] = useState<GrantMode>("auto");
  const [rulesCombineMode, setRulesCombineMode] = useState<"and" | "or">("and");
  const [rules, setRules] = useState<RuleBlock[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const addRule = (ruleType: string) => {
    setRules((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ruleType, value: 0 },
    ]);
  };

  const removeRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRule = (id: string, updates: Partial<RuleBlock>) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const input: CreateTrophyInput = {
      title,
      description,
      rarity,
      icon: icon?.trim() || "",
      sourcePlatform,
      grantMode,
      rulesCombineMode,
      rules:
        grantMode === "auto" && rules.length > 0
          ? rules.map((r) => ({ ruleType: r.ruleType, value: r.value }))
          : undefined,
    };

    const result = await createTrophy(input);
    setLoading(false);

    if (result.ok) {
      router.push("/trophies");
      router.refresh();
    } else {
      setError(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-6">
      {error && <Alert variant="error">{error}</Alert>}

      <Label>
        <LabelText>Título</LabelText>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Viewer de 10 horas"
          required
        />
      </Label>

      <Label>
        <LabelText>Descripción</LabelText>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe qué representa este trofeo"
          rows={3}
          className={`${inputBase} min-h-[80px] w-full resize-y`}
          required
        />
      </Label>

      <Label>
        <LabelText>Tipo de rareza</LabelText>
        <Select
          value={rarity}
          onChange={(e) => setRarity(e.target.value as Rarity)}
        >
          <option value="common">Normal</option>
          <option value="rare">Raro</option>
          <option value="epic">Épico</option>
          <option value="legendary">Legendario</option>
        </Select>
      </Label>

      <Label>
        <LabelText>Imagen del trofeo</LabelText>
        <TrophyImageUpload
          value={icon}
          onChange={(urlOrPublicId) => setIcon(urlOrPublicId)}
          onRemove={() => setIcon(null)}
        />
        <span className="mt-1 block text-xs text-foreground-muted">
          Sube una imagen cuadrada (máx. 2 MB). Si no subes ninguna, se usará un icono por defecto.
        </span>
      </Label>

      <Label>
        <LabelText>Datos de desbloqueo</LabelText>
        <Select
          value={sourcePlatform}
          onChange={(e) => setSourcePlatform(e.target.value as SourcePlatform)}
        >
          <option value="Twitch">Twitch</option>
          <option value="Kick">Kick</option>
        </Select>
        <span className="mt-1 text-xs text-foreground-muted">
          Las estadísticas se comprueban con la API de la plataforma elegida.
        </span>
      </Label>

      <Label>
        <LabelText>Cómo se desbloquea</LabelText>
        <Select
          value={grantMode}
          onChange={(e) => setGrantMode(e.target.value as GrantMode)}
        >
          <option value="auto">Automático (por reglas)</option>
          <option value="manual">Manual (lo otorgas tú)</option>
        </Select>
      </Label>

      {grantMode === "auto" && (
        <>
          <Label>
            <LabelText>Combinar reglas</LabelText>
            <Select
              value={rulesCombineMode}
              onChange={(e) =>
                setRulesCombineMode(e.target.value as "and" | "or")
              }
            >
              <option value="and">Todas deben cumplirse (AND)</option>
              <option value="or">Al menos una (OR)</option>
            </Select>
          </Label>

          <div>
            <LabelText className="mb-2 block">Reglas</LabelText>
            <p className="mb-2 text-sm text-foreground-muted">
              Añade una o más reglas. Cada bloque es un requisito que se evalúa con los datos de la plataforma.
            </p>
            <ul className="mb-3 flex flex-col gap-2">
              {rules.map((rule) => {
                const meta = TROPHY_RULE_TYPES.find((t) => t.id === rule.ruleType);
                return (
                  <li
                    key={rule.id}
                    className="flex flex-wrap items-center gap-2 rounded-lg border border-secondary bg-secondary/30 p-3"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {meta?.label ?? rule.ruleType}
                    </span>
                    {meta?.unit && (
                      <span className="text-xs text-foreground-muted">
                        ({meta.unit})
                      </span>
                    )}
                    <Input
                      type="number"
                      min={0}
                      value={rule.value}
                      onChange={(e) =>
                        updateRule(rule.id, {
                          value: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="w-24"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRule(rule.id)}
                      aria-label="Quitar regla"
                    >
                      Quitar
                    </Button>
                  </li>
                );
              })}
            </ul>
            <div className="flex flex-wrap gap-2">
              {TROPHY_RULE_TYPES.map((type) => (
                <Button
                  key={type.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addRule(type.id)}
                >
                  + {type.label}
                </Button>
              ))}
            </div>
            {grantMode === "auto" && rules.length === 0 && (
              <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                Añade al menos una regla para que el trofeo se desbloquee automáticamente.
              </p>
            )}
          </div>
        </>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} size="lg">
          {loading ? "Creando…" : "Crear trofeo"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push("/dashboard")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
