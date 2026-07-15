import type { WarriorBase } from "./warriorTypes";
import {
  WARRIOR_CLASSES,
  type WarriorClass,
} from "./warriorPictureVariants";
import { getWarriorRace, type WarriorRace } from "./warriorRaces";

export type WarriorStageTheme = {
  background: string;
  borderInset: string;
  spotlight: string;
  groundShadow: string;
  spriteGlow: string;
};

type WarriorStageThemeInput = Pick<
  WarriorBase,
  "warriorClass" | "gender" | "picture"
>;

type StageAccent = Pick<
  WarriorStageTheme,
  "spotlight" | "groundShadow" | "spriteGlow"
>;

const DEFAULT_CLASS_STAGE_ACCENT: StageAccent = {
  spotlight:
    "radial-gradient(ellipse, rgba(245, 214, 122, 0.2) 0%, rgba(184, 160, 112, 0.1) 48%, transparent 72%)",
  groundShadow: "rgba(0, 0, 0, 0.38)",
  spriteGlow: "0 0 5px rgba(245, 214, 122, 0.12)",
};

const RACE_STAGE_BASES: Record<
  WarriorRace,
  Pick<WarriorStageTheme, "background" | "borderInset">
> = {
  Human: {
    background:
      "linear-gradient(180deg, #3a3630 0%, #1e1c18 58%, #121110 100%)",
    borderInset: "inset 0 0 0 2px rgba(92, 86, 76, 0.22)",
  },
  Dwarf: {
    background:
      "linear-gradient(180deg, #3d3228 0%, #261e18 52%, #121110 100%)",
    borderInset: "inset 0 0 0 2px rgba(120, 82, 48, 0.24)",
  },
  Elf: {
    background:
      "linear-gradient(180deg, #2a3432 0%, #1a2422 52%, #121110 100%)",
    borderInset: "inset 0 0 0 2px rgba(72, 98, 92, 0.24)",
  },
  Orc: {
    background:
      "linear-gradient(180deg, #3a2e28 0%, #241a16 52%, #121110 100%)",
    borderInset: "inset 0 0 0 2px rgba(110, 68, 52, 0.24)",
  },
};

const CLASS_STAGE_ACCENTS: Partial<Record<WarriorClass, StageAccent>> = {
  Knight: DEFAULT_CLASS_STAGE_ACCENT,
  Paladin: {
    spotlight:
      "radial-gradient(ellipse, rgba(250, 234, 190, 0.24) 0%, rgba(200, 180, 130, 0.12) 48%, transparent 72%)",
    groundShadow: "rgba(0, 0, 0, 0.36)",
    spriteGlow: "0 0 6px rgba(250, 234, 190, 0.16)",
  },
  King: {
    spotlight:
      "radial-gradient(ellipse, rgba(250, 234, 190, 0.22) 0%, rgba(184, 160, 112, 0.11) 45%, transparent 70%)",
    groundShadow: "rgba(0, 0, 0, 0.36)",
    spriteGlow: "0 0 5px rgba(250, 234, 190, 0.14)",
  },
  Sorcerer: {
    spotlight:
      "radial-gradient(ellipse, rgba(168, 132, 220, 0.22) 0%, rgba(110, 78, 160, 0.11) 48%, transparent 72%)",
    groundShadow: "rgba(24, 16, 36, 0.42)",
    spriteGlow: "0 0 6px rgba(168, 132, 220, 0.14)",
  },
  Warlock: {
    spotlight:
      "radial-gradient(ellipse, rgba(140, 96, 168, 0.22) 0%, rgba(72, 48, 96, 0.12) 48%, transparent 72%)",
    groundShadow: "rgba(28, 14, 32, 0.44)",
    spriteGlow: "0 0 6px rgba(140, 96, 168, 0.14)",
  },
  Shaman: {
    spotlight:
      "radial-gradient(ellipse, rgba(120, 168, 96, 0.22) 0%, rgba(72, 110, 68, 0.11) 48%, transparent 72%)",
    groundShadow: "rgba(18, 28, 14, 0.42)",
    spriteGlow: "0 0 6px rgba(120, 168, 96, 0.14)",
  },
  Priestess: {
    spotlight:
      "radial-gradient(ellipse, rgba(240, 228, 200, 0.22) 0%, rgba(184, 168, 140, 0.1) 48%, transparent 72%)",
    groundShadow: "rgba(0, 0, 0, 0.34)",
    spriteGlow: "0 0 6px rgba(240, 228, 200, 0.14)",
  },
  Berserker: {
    spotlight:
      "radial-gradient(ellipse, rgba(220, 120, 96, 0.22) 0%, rgba(160, 72, 56, 0.11) 48%, transparent 72%)",
    groundShadow: "rgba(36, 14, 10, 0.44)",
    spriteGlow: "0 0 5px rgba(220, 120, 96, 0.14)",
  },
  Brutalizer: {
    spotlight:
      "radial-gradient(ellipse, rgba(180, 72, 56, 0.24) 0%, rgba(110, 44, 32, 0.12) 48%, transparent 72%)",
    groundShadow: "rgba(42, 10, 6, 0.48)",
    spriteGlow: "0 0 5px rgba(180, 72, 56, 0.14)",
  },
  Charger: {
    spotlight:
      "radial-gradient(ellipse, rgba(230, 150, 96, 0.22) 0%, rgba(170, 96, 56, 0.11) 48%, transparent 72%)",
    groundShadow: "rgba(32, 16, 10, 0.42)",
    spriteGlow: "0 0 5px rgba(230, 150, 96, 0.14)",
  },
  Ranger: {
    spotlight:
      "radial-gradient(ellipse, rgba(180, 210, 190, 0.18) 0%, rgba(120, 150, 130, 0.09) 48%, transparent 72%)",
    groundShadow: "rgba(16, 24, 18, 0.4)",
    spriteGlow: "0 0 5px rgba(180, 210, 190, 0.12)",
  },
  Marksman: {
    spotlight:
      "radial-gradient(ellipse, rgba(190, 200, 210, 0.18) 0%, rgba(130, 140, 150, 0.09) 48%, transparent 72%)",
    groundShadow: "rgba(18, 20, 24, 0.4)",
    spriteGlow: "0 0 5px rgba(190, 200, 210, 0.12)",
  },
  Moonblade: {
    spotlight:
      "radial-gradient(ellipse, rgba(176, 210, 230, 0.24) 0%, rgba(110, 150, 180, 0.12) 48%, transparent 72%)",
    groundShadow: "rgba(14, 22, 30, 0.42)",
    spriteGlow: "0 0 7px rgba(176, 210, 230, 0.16)",
  },
  Peasant: {
    spotlight:
      "radial-gradient(ellipse, rgba(180, 160, 130, 0.12) 0%, rgba(120, 104, 84, 0.06) 42%, transparent 68%)",
    groundShadow: "rgba(0, 0, 0, 0.34)",
    spriteGlow: "0 0 4px rgba(180, 160, 130, 0.08)",
  },
  Infiltrator: {
    spotlight:
      "radial-gradient(ellipse, rgba(120, 110, 140, 0.14) 0%, rgba(60, 54, 72, 0.07) 36%, transparent 62%)",
    groundShadow: "rgba(8, 6, 12, 0.5)",
    spriteGlow: "0 0 4px rgba(120, 110, 140, 0.1)",
  },
};

function isWarriorClass(value: string): value is WarriorClass {
  return (WARRIOR_CLASSES as readonly string[]).includes(value);
}

function getClassStageAccent(warriorClass: string): StageAccent {
  if (isWarriorClass(warriorClass)) {
    return CLASS_STAGE_ACCENTS[warriorClass] ?? DEFAULT_CLASS_STAGE_ACCENT;
  }

  return DEFAULT_CLASS_STAGE_ACCENT;
}

export function getWarriorStageTheme(
  warrior: WarriorStageThemeInput
): WarriorStageTheme {
  const race = getWarriorRace(
    warrior.warriorClass as WarriorClass,
    warrior.gender as "Male" | "Female",
    warrior.picture
  );
  const base = RACE_STAGE_BASES[race];
  const accent = getClassStageAccent(warrior.warriorClass);

  return {
    background: base.background,
    borderInset: base.borderInset,
    spotlight: accent.spotlight,
    groundShadow: accent.groundShadow,
    spriteGlow: accent.spriteGlow,
  };
}
