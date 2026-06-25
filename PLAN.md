# MythBindr — Product Plan

> _"Your Campaign. Bound by Myth."_
> An assistant for new **and** experienced Dungeon Masters to build whole campaigns,
> partial arcs, or individual elements — and run them live at the table.

**Status:** Phase D (Discovery / Feature Definition) — _this document is the output of that phase._
**Last updated:** 2026-06-25

---

## 1. Product vision

MythBindr helps a GM go from blank page → playable campaign, and then helps them
*run* that campaign during a session. It is opinionated toward **D&D 5e (SRD)** so it
can be rules-aware (stat blocks, CR, conditions), but stays flexible enough that a GM
can freeform anything. It serves brand-new GMs with guidance and templates, and
experienced GMs with speed and power tools, via **progressive disclosure**.

### Scope decisions (locked in Phase D)
| Dimension | Decision | Implication |
|---|---|---|
| Audience | **Both new & experienced**, equally | Progressive disclosure: simple defaults, power features on demand |
| Usage | **Prep + at-the-table mode** | A live "Run Session" runtime, not just a builder |
| System | **D&D 5e (SRD)** | Rules-aware: stat blocks, CR, spells, conditions, encounter math |
| Collaboration | **Multi-GM co-editing** | Membership, roles/permissions, concurrent edits, invites |
| AI | **Architected now, built later** | `ContentGenerator` interface stubbed; Claude API drops in (Phase 3) |

---

## 2. Tech stack & architecture

- **Frontend:** React + Vite + TypeScript, Tailwind CSS, theme tokens as CSS variables.
- **Backend:** Node + Express + TypeScript, MongoDB via Mongoose.
- **Auth:** **Passkeys only** via `@simplewebauthn` (server + browser), httpOnly session cookies. No passwords.
- **AI (later):** `ContentGenerator` interface; concrete impl uses the **Claude API** (Opus/Sonnet).

```
mythbindr/
├── client/        React + Vite + TS + Tailwind
│   └── themes/    4 theme token sets (see §4) + Settings theme switcher
├── server/        Express + TS
│   ├── auth/      SimpleWebAuthn ceremonies, sessions
│   ├── models/    Mongoose schemas (see §6)
│   ├── srd/       5e SRD data (monsters, spells, conditions, items)
│   └── ai/        ContentGenerator interface (stub now → Claude later)
├── design/        theme-preview.html (live 4-theme reference)
└── PLAN.md        this file
```

---

## 3. Roadmap (phases)

- **Phase D — Discovery / Feature Definition** ✅ _(this document)_
- **Phase 0 — Foundation:** passkeys, MongoDB, theme system + **Settings menu (all 4 themes selectable)**, app shell.
- **Phase 1 — Core building:** campaigns + the core element types (CRUD + cross-linking).
- **Phase 2 — Collaboration & workflow:** multi-GM membership/roles, search, sessions/notes.
- **Phase 3 — At-the-table mode:** initiative tracker, HP/conditions, dice, encounter runner.
- **Phase 4 — 5e rules-awareness:** SRD stat blocks, CR/encounter balancing, spell/condition reference.
- **Phase 5 — AI assist:** generate/refine campaigns, arcs, and elements via Claude.

> Phases are dependency-ordered, not rigid. Some Phase 4 SRD data can land earlier to enrich Phase 1.

---

## 4. Themes (Settings → Appearance)

All four are selectable in the Settings menu; choice persists to the user's profile.
Default = **Mythic Gold**. Live reference: `design/theme-preview.html`.

| # | Name | Mood | Heading / Body | Key colors |
|---|---|---|---|---|
| 1 | **Mythic Gold** (default) | Dark, heraldic, gold + violet accent | Cinzel / Inter | `#0E0F13` · `#C9A24B` · `#7C4DEF` |
| 3 | **Arcane Navy** | Midnight blue, scholarly, gold | Lora / Inter | `#0C1726` · `#4C7CA8` · `#D9A93E` |
| 6 | **Parchment Tome** (light) | Cozy parchment, hand-drawn | IM Fell English / Inter | `#F3ECDD` · `#5B3FA0` · `#C07F46` |
| 9 | **Ember Violet** | Black + violet flame, modern | Playfair Display / Inter | `#100E16` · `#7C3AED` · `#A78BFA` |

---

## 5. Feature catalog

Priority tags: **[MVP]** Phase 0–1 · **[P1]** Phase 2–3 · **[P2]** Phase 4–5 · **[Later]** backlog.
Every feature below is intentionally granular — concrete fields, UI behaviors, and 5e mechanics.

### 5.1 Authentication & account
- **[MVP]** Register with a passkey: enter display name → browser WebAuthn prompt → account created (no password field anywhere).
- **[MVP]** Log in with a passkey via the platform authenticator (Touch ID / Windows Hello / phone), with "use a different device" (cross-device QR) fallback.
- **[MVP]** Log out; auto-expire idle sessions; "remember this browser" option.
- **[MVP]** Add a second/third passkey to one account; give each a friendly name (e.g. "Work laptop").
- **[MVP]** List registered passkeys with last-used date; rename or revoke any one.
- **[P1]** Generate 10 one-time backup recovery codes at signup; regenerate set; warn when fewer than 3 remain.
- **[P1]** Recovery flow: sign in with a backup code when no passkey is available, then forced to enroll a new passkey.
- **[P1]** Profile page: display name, optional avatar upload, pronouns, default landing campaign, default theme.
- **[P2]** Session/device manager: see active sessions with browser + location, "sign out everywhere" button.

### 5.2 Appearance & UX
- **[MVP]** Settings → Appearance: 4 theme cards (Mythic Gold, Arcane Navy, Parchment Tome, Ember Violet), each a live mini-preview; click to apply instantly; selection persisted to profile.
- **[MVP]** Selected theme loads on next login without a flash of the wrong theme (server-rendered theme attribute / cookie).
- **[MVP]** App shell: collapsible left sidebar (Dashboard, Campaigns, NPCs, Locations, Encounters, Items, Notes), top bar with campaign switcher + global search + user menu.
- **[MVP]** Breadcrumbs (Campaign › NPCs › "Lady Mara") and a recent-items quick-jump list.
- **[P1]** "Beginner vs Advanced" mode toggle: Beginner hides power fields (raw stat-block JSON, bulk actions) and shows inline explainers; Advanced reveals everything.
- **[P1]** First-run onboarding: 4-step tour (create a campaign → add an NPC → link it → open Run Session), skippable, resumable.
- **[P1]** Contextual help: dismissible "?" tooltips defining terms (CR, initiative, DC) for new GMs.
- **[P2]** Command palette (Ctrl/Cmd-K): jump to any element, run actions ("new NPC", "start session").
- **[P2]** Keyboard shortcuts for power users (n = new element, / = focus search, g then c = go to campaigns).
- **[P2]** Per-element "favorite/pin" so hot prep items surface on the dashboard.

### 5.3 Campaigns
- **[MVP]** Create campaign with: name, one-line hook, premise/synopsis (rich text), tone tags (e.g. grimdark, heroic, comedic), starting party level, target end level, setting name.
- **[MVP]** Edit and delete a campaign (delete = soft-delete to a 30-day trash, then purge).
- **[MVP]** Duplicate a campaign as a template (copies structure, optionally strips player-specific data).
- **[MVP]** Campaign dashboard: stat tiles (Locations / NPCs / Encounters / Items / Quests counts), "next session" date, last-edited elements, open quests.
- **[MVP]** "Story so far" summary field the GM maintains, shown at the top of the dashboard.
- **[P1]** Story arcs / chapters: ordered list of arcs, each with status (planned / active / done) and assigned elements.
- **[P1]** Campaign starter kits for new GMs: pick a one-shot or short-campaign template that pre-fills arcs, sample NPCs, and a starting encounter.
- **[P1]** Session scheduling: next-session date/time, recurring cadence, per-session prep checklist.
- **[P2]** World calendar: custom month/day names, track in-world dates and events on a timeline.
- **[P2]** Relationship map / graph view: nodes = elements, edges = links, filter by type.

### 5.4 NPCs
- **[MVP]** Fields: name, portrait, race, role/occupation, alignment, location, faction, status (alive/dead/missing), one-line summary.
- **[MVP]** Roleplay aids: personality traits, ideal, bond, flaw, mannerism/voice note, catchphrase.
- **[MVP]** GM-only secrets field (hidden from any player-facing share view).
- **[MVP]** Relationships: typed links to other NPCs (ally/rival/family/employer) and to locations/factions/quests.
- **[P1]** Quick-NPC generator: roll a random name + trait + quirk for an on-the-spot NPC during a session.
- **[P2]** Attach an SRD stat block (or homebrew) so the NPC can be dropped into combat; show CR.
- **[P2]** Voice/accent prompt + a "describe this NPC to players" read-aloud box.

### 5.5 Locations
- **[MVP]** Fields: name, type (city / dungeon / wilderness / building / plane), parent location (for nesting), description (rich text), read-aloud boxed text.
- **[MVP]** Inhabitants (linked NPCs), connected locations (with travel time/method), notable features list.
- **[MVP]** GM secrets (traps, hidden doors, ambushes) separate from player-visible description.
- **[P1]** Map image upload with optional pinned markers linking to sub-locations/encounters.
- **[P1]** Random encounter table attached to a location (roll on it during travel).
- **[P2]** Loot/shop inventory for a location (links to Items, with prices).

### 5.6 Encounters
- **[MVP]** Fields: name, type (combat / social / exploration / puzzle / trap), location, trigger ("when players enter the crypt"), objective, GM notes.
- **[MVP]** Combatant list: add monsters (manual now / SRD later) and NPCs with quantity, plus expected enemy tactics.
- **[MVP]** Rewards: XP, gold, linked Items, story rewards.
- **[MVP]** Status: planned / in-progress / completed, with outcome notes.
- **[P2]** XP/difficulty calculator: enter party (count + levels), get trivial/easy/medium/hard/deadly rating vs the combatant list; warn if deadly.
- **[P2]** "Start in Run Session" button: pushes all combatants into the initiative tracker pre-loaded.
- **[P2]** Scaling helper: suggest add/remove monsters to hit a target difficulty.
- **[P2]** Puzzle/trap details: DC, detection method, disarm method, consequences.

### 5.7 Items
- **[MVP]** Fields: name, type (weapon / armor / potion / wondrous / quest item / currency), rarity (common→legendary), attunement (yes/no), description, mechanical effect text.
- **[MVP]** Ownership tracking: unassigned / held by NPC / held by PC / stashed at location.
- **[MVP]** Value (gp) and weight.
- **[P1]** "Player handout" toggle so an item card can be revealed to players.
- **[P2]** SRD magic-item lookup to auto-fill effect text and rarity.
- **[Later]** Homebrew item builder with a formatted stat-card output.

### 5.8 Quests / plot hooks
- **[P1]** Fields: title, hook (the lure), giver (linked NPC), objective(s) checklist, status (rumored / active / completed / failed), reward (XP/gold/items).
- **[P1]** Sub-objectives with individual completion state and a progress bar.
- **[P1]** Links to involved NPCs, locations, encounters, and parent arc.
- **[P2]** Branching/consequence notes ("if players side with the thieves' guild…").
- **[P2]** Quest log view filtered by status across the whole campaign.

### 5.9 Factions, PCs, notes (supporting elements)
- **[P1] Factions:** name, goals, leader (NPC), members, allies/enemies (linked factions), influence/notoriety track, secret agenda (GM-only).
- **[P1] Player Characters:** player name, character name, race, class + subclass, level, AC, HP max, passive perception, key flaws/bonds, backstory hooks the GM can weaponize.
- **[MVP] Notes / lore:** free-form rich-text notes, attachable to any element or standalone; folders/tags; pin to dashboard.
- **[MVP]** Universal cross-linking: `@mention` any element inside any rich-text field to create a typed, clickable link; a "Linked from" backlinks panel on every element.
- **[P1]** Global search across all elements + types with filters (type, tag, status, arc) and full-text on bodies.
- **[P1]** Bulk actions for power users: multi-select elements → tag, move to arc, delete, export.

### 5.10 Pregenerated character sheets (one-shots)
_Designed for the "build a one-shot for the family" workflow: generate a ready-to-play party, hand each sheet to a player, let them make it their own._
- **[P1]** "Generate a party" action on a campaign: GM enters **N** = how many character sheets to create at once.
- **[P1]** Generation inputs: party level, optional concept/constraint (e.g. "all guards of the same keep"), allowed sources (SRD races/classes), and ability-score method (standard array / point-buy / rolled).
- **[P1]** **Field-selection checklist** — per-field checkboxes for what MythBindr auto-fills vs. leaves blank, grouped as:
  - _Identity:_ name, race, class + subclass, background, alignment, level
  - _Mechanics:_ ability scores, HP, AC, proficiency bonus, saving throws, skills, proficiencies
  - _Kit:_ starting equipment, weapons, armor, spells known/prepared
  - _Flavor:_ personality traits, ideal, bond, flaw, backstory, appearance, portrait
- **[P1]** Auto-fill is 5e-legal: class-appropriate proficiencies, level-appropriate HP/spell slots, valid score arrays (uses SRD data, §5.13).
- **[P1]** Party-balance toggle: ensure a viable mix (e.g. at least one healer / tank / face) instead of N random duplicates.
- **[P1]** Generated sheets save as `pc`-type elements flagged **pregen / unclaimed**; auto-filled values carry a "suggested" badge and stay editable.
- **[P1]** Blank fields show friendly prompts ("Give your character a name", "What does your hero fear?") so the player adds the rest and feels ownership.
- **[P1]** Per-group **lock toggle**: GM can lock _Mechanics_ (keep the build legal/balanced) while leaving _Flavor_ fully open — or unlock everything.
- **[P1]** Hand-off via **no-account claim link**: GM generates one tokenized link per sheet; the player opens it, enters a display name, and edits — no signup. On first save the sheet becomes **claimed by <that name>**. (Player accounts are out of scope for v1 — see §7.5.)
- **[P2]** Granular re-roll: regenerate just one field or group ("new name", "new backstory", "re-roll ability scores") without touching player-entered fields.
- **[P2]** Guided fill mode for the player: a step-through wizard that explains each blank as they go (ideal for first-time players / kids).
- **[P2]** Print/export a pregen sheet to a fillable PDF for table play (ties to §5.15).
- **[Later]** Level-up assistant that applies the same "suggest vs. let the player choose" pattern when a one-shot character advances.

### 5.11 Collaboration (multi-GM)
- **[P1]** Invite a co-GM to a campaign by their account handle/email; pending-invite list; accept/decline.
- **[P1]** Roles: Owner (full + manage members/delete), Editor (create/edit content), Viewer (read-only).
- **[P1]** Per-element and per-campaign permission respect throughout the UI (hide edit controls for Viewers).
- **[P1]** Activity log: chronological "who changed what, when" feed per campaign, filterable by member/element.
- **[P2]** Optimistic concurrency: if two GMs save the same element, show a conflict banner with both versions to merge.
- **[P2]** Presence indicators: show which co-GMs are currently viewing a campaign/element.
- **[Later]** Read-only player-facing share: publish selected elements (no GM-secrets) to a campaign wiki link / handout view.
- **[Later]** Real-time co-editing of a single element via websockets (stretch).

### 5.12 At-the-table mode ("Run Session")
- **[P1]** Launch a focused, low-distraction session screen for a chosen campaign (larger text, dark by default).
- **[P1]** Initiative tracker: add combatants from SRD/monster, from linked NPCs, or manually; auto-roll initiative (d20 + DEX mod) or type values; drag to reorder ties.
- **[P1]** Turn engine: highlight current combatant, "Next turn" advances and increments the round counter; "Delay/Ready" to move a combatant later in order.
- **[P1]** Per-combatant HP: current/max, quick +/- damage & heal stepper, temp HP field, auto "Bloodied" tag at ≤50%, "Unconscious/Dead" at 0.
- **[P1]** 5e condition tags per combatant (blinded, charmed, frightened, grappled, paralyzed, poisoned, prone, restrained, stunned, etc.) with a duration counter that ticks down on the owner's turn.
- **[P1]** Death saving throws tracker for downed PCs (3 success / 3 fail pips, auto-stabilize/die).
- **[P1]** Dice roller: click d4/d6/d8/d10/d12/d20/d100, add modifiers, roll multiple (e.g. 8d6 fireball), advantage/disadvantage toggle; running roll log with who/what.
- **[P2]** Quick-reference drawer: searchable conditions, actions-in-combat, and cover/light rules without leaving the session.
- **[P2]** AC/passive-perception at-a-glance row for the party during play.
- **[P2]** Lair/legendary action reminders surfaced at the right initiative count.
- **[P2]** Session log auto-builds entries (combat started, NPC died, quest completed) + GM free-text recap; saved to the campaign and shown as "Recent Notes".
- **[P2]** Encounter-to-tracker round trip: ending a session writes outcomes (XP awarded, casualties) back to the encounter and quests.

### 5.13 5e SRD rules-awareness
- **[P2]** Bundled SRD monster library (searchable/filter by CR, type, size); preview full stat block.
- **[P2]** Drop a monster into an encounter or onto an NPC; instance keeps its own HP in a session.
- **[P2]** SRD spells reference: search by name/level/class/school; show casting time, range, components, duration, description.
- **[P2]** SRD conditions reference with exact rules text (powers the condition tags in §5.12).
- **[P2]** SRD magic items reference (powers §5.7 auto-fill).
- **[P2]** Encounter XP budget tables (by party level) powering the difficulty calculator.
- **[Later]** Homebrew monster/stat-block builder with CR estimator.

### 5.14 AI assist (Phase 5 — architected now, stubbed)
- **[P2]** Generate a whole campaign from a short prompt (premise, length, tone) → arcs + key NPCs + key locations + opening hook, each saved as real linked elements.
- **[P2]** Generate a partial arc / single chapter that slots into an existing campaign and references existing elements.
- **[P2]** Generate a single element with the "Generate with AI" button on each editor: NPC, location, encounter, item, quest, read-aloud boxed text.
- **[P2]** Refine actions on any element: "expand", "make grittier/lighter", "shorten", "regenerate" with the surrounding campaign as context.
- **[P2]** "Name this" + "give me 5 plot hooks" + "what could go wrong?" quick prompts.
- **[P2]** AI-flavored party generation: when generating pregen sheets (§5.10), use Claude for names/personalities/backstories while SRD logic fills the mechanics.
- **[Later]** "What's next?" suggestions on the dashboard based on open quests and unused NPCs.
- **[Later]** Per-user vs app-provided API key handling and a token/cost meter.

### 5.15 Data portability
- **[Later]** Export a campaign to JSON (full fidelity), Markdown (readable wiki), or printable PDF (prep packet).
- **[Later]** Export a single encounter as a one-page "run sheet" PDF.
- **[Later]** Import from JSON export; importer for common homebrew/statblock formats.

---

## 6. Data model sketch (Mongoose)

- **User** — `displayName`, `theme`, `uiDensity`, timestamps.
- **Credential** — `userId`, `credentialID`, `publicKey`, `counter`, `deviceName` (WebAuthn).
- **Campaign** — `name`, `premise`, `tone`, `levelRange`, `ownerId`.
- **Membership** — `campaignId`, `userId`, `role` (owner|editor|viewer).
- **Element** (discriminated by `type`: npc|location|encounter|item|note|quest|faction|pc) —
  `campaignId`, `name`, `body`, `tags[]`, `links[]` (refs to other elements), `data` (type-specific, e.g. stat block).
- **Character sheet** (a `pc`-type Element) — adds `pregen` (bool), `claimantName?` (display name the player typed when claiming — no account), `claimedAt?`, `autofilledFields[]` (which fields were AI/SRD-filled, for the "suggested" badge), `lockedGroups[]` (identity|mechanics|kit|flavor), and a 5e `sheet` object (abilities, HP, AC, skills, proficiencies, equipment, spells).
- **ClaimLink** — `campaignId`, `characterId?`, `token`, `expiresAt`, `claimantName?` (no-account model: token grants edit access to one pregen sheet; claimant identified by the name they enter, not a user).
- **Session** — `campaignId`, `date`, `log[]`, `initiativeState`.
- **(SRD data)** — read-only collections: `monsters`, `spells`, `conditions`, `magicItems`.

---

## 7. Open questions for next pass
1. Real-time co-editing (websockets) — in scope for v1, or last-write-wins is fine to start?
2. AI cost model — who pays for generation (per-user API key vs. app-provided)?
3. SRD data source — bundle a static SRD dataset, or call an open 5e API?
4. Player-facing share view — how important relative to GM tools?
5. ~~Player access model for claiming pregen sheets~~ — **Resolved (2026-06-25): no-account claim link.** A player opens a tokenized link, enters a display name, and edits their sheet without signing up. No player accounts in v1. (Optional account-upgrade can be reconsidered later.)

---

## 8. Immediate next step
Once this feature list is approved, begin **Phase 0**: passkey auth + MongoDB connection +
the theme system with a Settings menu exposing all 4 themes.
