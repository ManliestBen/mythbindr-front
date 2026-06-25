/**
 * Maps the URL segment (plural, used in routes + sidebar) to the backend element
 * `type` and display labels. `available` flips on as each slice ships its schema
 * + form; until then the section shows a "coming soon" notice.
 */
export interface ElementTypeConfig {
  type: string;
  label: string;
  plural: string;
  available: boolean;
}

export const ELEMENT_TYPE_BY_SEGMENT: Record<string, ElementTypeConfig> = {
  notes: { type: 'note', label: 'Note', plural: 'Notes', available: true },
  npcs: { type: 'npc', label: 'NPC', plural: 'NPCs', available: false },
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
