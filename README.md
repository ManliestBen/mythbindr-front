# MythBindr

> _"Your Campaign. Bound by Myth."_

An assistant for new **and** experienced Dungeon Masters to build whole D&D campaigns,
partial arcs, or individual elements — and run them live at the table.

## Status

🚧 **Phase D — Discovery / Feature Definition.** The product plan and full feature catalog
live in [`PLAN.md`](./PLAN.md). No application code yet.

## What it will be

- **Build:** campaigns, NPCs, locations, encounters, items, quests, factions, lore — all cross-linked.
- **Run:** an at-the-table session mode (initiative tracker, HP/conditions, dice, quick reference).
- **5e-aware:** grounded in the D&D 5e SRD (stat blocks, CR, spells, conditions).
- **One-shot ready:** generate a party of partially-filled, player-claimable character sheets.
- **Collaborative:** multi-GM campaigns with roles.
- **Themeable:** four selectable UI themes (see below).

## Planned stack

- **Frontend:** React + Vite + TypeScript + Tailwind
- **Backend:** Node + Express + TypeScript, MongoDB (Mongoose)
- **Auth:** Passkeys only ([SimpleWebAuthn](https://simplewebauthn.dev/)) — no passwords
- **AI (later):** Claude API for campaign/element generation

## Themes

Four selectable UI themes derived from the brand sheets in
[`design/brand-themes-reference.png`](./design/brand-themes-reference.png):

| Theme | Mood |
|---|---|
| Mythic Gold (default) | Dark, heraldic, gold + violet accent |
| Arcane Navy | Midnight blue, scholarly |
| Parchment Tome (light) | Cozy parchment, hand-drawn |
| Ember Violet | Black + violet flame, modern |

Open [`design/theme-preview.html`](./design/theme-preview.html) in a browser to see all four applied to a live dashboard.
