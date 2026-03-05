"use client";

import {
  GiTrophy,
  GiConversation,
  GiGamepad,
  GiPresent,
  GiPadlock,
  GiThreeFriends,
  GiChart,
  GiPuzzle,
  GiShield,
  GiPlayButton,
  GiArrowhead,
  GiConsoleController,
} from "react-icons/gi";

const iconProps = (className?: string) => ({
  className: className ?? undefined,
  "aria-hidden": true as const,
});

export function TrophyIcon({ className }: { className?: string }) {
  return <GiTrophy {...iconProps(className)} />;
}

export function EngagementIcon({ className }: { className?: string }) {
  return <GiConversation {...iconProps(className)} />;
}

export function GamepadIcon({ className }: { className?: string }) {
  return <GiGamepad {...iconProps(className)} />;
}

export function GiftIcon({ className }: { className?: string }) {
  return <GiPresent {...iconProps(className)} />;
}

export function LockIcon({ className }: { className?: string }) {
  return <GiPadlock {...iconProps(className)} />;
}

export function PeopleIcon({ className }: { className?: string }) {
  return <GiThreeFriends {...iconProps(className)} />;
}

export function ChartIcon({ className }: { className?: string }) {
  return <GiChart {...iconProps(className)} />;
}

export function PuzzleIcon({ className }: { className?: string }) {
  return <GiPuzzle {...iconProps(className)} />;
}

export function ShieldIcon({ className }: { className?: string }) {
  return <GiShield {...iconProps(className)} />;
}

export function PlayIcon({ className }: { className?: string }) {
  return <GiPlayButton {...iconProps(className)} />;
}

export function ArrowRightIcon({ className }: { className?: string }) {
  return <GiArrowhead {...iconProps(className)} />;
}

export function ControllerIcon({ className }: { className?: string }) {
  return <GiConsoleController {...iconProps(className)} />;
}