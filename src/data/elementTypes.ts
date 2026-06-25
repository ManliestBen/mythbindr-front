/**
 * Maps the URL segment (plural, used in routes + sidebar) to the backend element
 * `type` and display labels. `available` flips on as each slice ships its schema
 * + form; until then the section shows a "coming soon" notice.
 */
export interface DataField {
  key: string;
  label: string;
  kind: 'text' | 'textarea' | 'select' | 'number';
  options?: string[];
}

export interface ElementTypeConfig {
  type: string;
  label: string;
  plural: string;
  available: boolean;
  /** Per-type structured `data` fields rendered by ElementForm. */
  dataFields?: DataField[];
  /** Whether to show the typed-relationships editor. */
  relationships?: boolean;
}

export const ELEMENT_TYPE_BY_SEGMENT: Record<string, ElementTypeConfig> = {
  notes: { type: 'note', label: 'Note', plural: 'Notes', available: true },
  npcs: {
    type: 'npc',
    label: 'NPC',
    plural: 'NPCs',
    available: true,
    relationships: true,
    dataFields: [
      { key: 'race', label: 'Race', kind: 'text' },
      { key: 'role', label: 'Role / occupation', kind: 'text' },
      { key: 'alignment', label: 'Alignment', kind: 'text' },
      {
        key: 'status',
        label: 'Status',
        kind: 'select',
        options: ['alive', 'dead', 'missing', 'unknown'],
      },
      { key: 'location', label: 'Location', kind: 'text' },
      { key: 'faction', label: 'Faction', kind: 'text' },
      { key: 'summary', label: 'One-line summary', kind: 'text' },
      { key: 'traits', label: 'Personality traits', kind: 'textarea' },
      { key: 'ideal', label: 'Ideal', kind: 'text' },
      { key: 'bond', label: 'Bond', kind: 'text' },
      { key: 'flaw', label: 'Flaw', kind: 'text' },
      { key: 'mannerism', label: 'Mannerism / voice', kind: 'text' },
      { key: 'catchphrase', label: 'Catchphrase', kind: 'text' },
    ],
  },
  locations: { type: 'location', label: 'Location', plural: 'Locations', available: false },
  encounters: { type: 'encounter', label: 'Encounter', plural: 'Encounters', available: false },
  items: { type: 'item', label: 'Item', plural: 'Items', available: false },
};

/** Reverse lookup: backend element `type` → URL segment (for linking to an element). */
export function segmentForType(type: string): string | undefined {
  return Object.keys(ELEMENT_TYPE_BY_SEGMENT).find(
    (seg) => ELEMENT_TYPE_BY_SEGMENT[seg].type === type,
  );
}
