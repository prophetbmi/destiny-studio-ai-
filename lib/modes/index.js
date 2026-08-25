import * as faceless from "./faceless";
import * as faceCamera from "./face-camera";
import * as storytelling from "./storytelling";
import * as courtMetrage from "./court-metrage";

const CREDIT_COSTS = {
  [courtMetrage.id]: 2,
};

function toModeEntry(mode) {
  return {
    id: mode.id,
    label: mode.label,
    description: mode.description,
    SYSTEM_PROMPT: mode.SYSTEM_PROMPT,
    buildUserPrompt: mode.buildUserPrompt,
    outputType: mode.outputType,
    plannedOutputType: mode.plannedOutputType || null,
    maxTokens: mode.maxTokens || 4096,
    creditCost: CREDIT_COSTS[mode.id] || 1,
  };
}

export const MODES = {
  [faceless.id]: toModeEntry(faceless),
  [faceCamera.id]: toModeEntry(faceCamera),
  [storytelling.id]: toModeEntry(storytelling),
  [courtMetrage.id]: toModeEntry(courtMetrage),
};

export const DEFAULT_MODE_ID = faceless.id;

export function getMode(modeId) {
  return MODES[modeId] || MODES[DEFAULT_MODE_ID];
}
