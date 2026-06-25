import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  useCampaign,
  useDeleteCampaign,
  useDuplicateCampaign,
  useUpdateCampaign,
  type CampaignFormValues,
} from '../data/campaigns';
import CampaignForm from '../components/CampaignForm';

const ELEMENT_TYPES = [
  { type: 'npcs', label: 'NPCs' },
  { type: 'locations', label: 'Locations' },
  { type: 'encounters', label: 'Encounters' },
  { type: 'items', label: 'Items' },
  { type: 'notes', label: 'Notes' },
];

export default function CampaignHome() {
  const { cid } = useParams();
  const { data: campaign, isLoading, error } = useCampaign(cid);
  const update = useUpdateCampaign(cid ?? '');
  const del = useDeleteCampaign();
  const duplicate = useDuplicateCampaign();
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  if (isLoading) return <p className="text-sm text-fg-muted">Loading…</p>;
  if (error || !campaign) {
    return (
      <p className="text-sm text-red-400">
        {error instanceof Error ? error.message : 'Campaign not found'}
      </p>
    );
  }

  const onSave = (values: CampaignFormValues) =>
    update.mutate(values, { onSuccess: () => setEditing(false) });

  const onDelete = () => {
    if (!window.confirm(`Move "${campaign.name}" to trash?`)) return;
    del.mutate(campaign.id, { onSuccess: () => navigate('/campaigns') });
  };

  const onDuplicate = () =>
    duplicate.mutate(campaign.id, {
      onSuccess: (copy) => navigate(`/campaigns/${copy.id}`),
    });

  if (editing) {
    return (
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold">Edit campaign</h1>
        <div className="mt-5 rounded-xl border border-app-border bg-app-surface p-5">
          <CampaignForm
            submitLabel="Save changes"
            busy={update.isPending}
            error={update.error instanceof Error ? update.error.message : null}
            defaultValues={{
              name: campaign.name,
              hook: campaign.hook,
              settingName: campaign.settingName,
              startLevel: campaign.startLevel,
              endLevel: campaign.endLevel,
              storySoFar: campaign.storySoFar,
            }}
            onSubmit={onSave}
            onCancel={() => setEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-[11px] uppercase tracking-[0.15em] text-fg-muted">Campaign</p>
      <div className="mt-1 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{campaign.name}</h1>
          {campaign.hook && (
            <p className="mt-2 max-w-prose text-sm text-fg-muted">{campaign.hook}</p>
          )}
          <p className="mt-2 text-[11px] uppercase tracking-wide text-fg-muted">
            {campaign.settingName ? `${campaign.settingName} · ` : ''}Levels{' '}
            {campaign.startLevel}–{campaign.endLevel}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => setEditing(true)}
            className="rounded-lg border border-app-border px-3 py-1.5 text-sm text-fg-muted hover:text-fg"
          >
            Edit
          </button>
          <button
            onClick={onDuplicate}
            disabled={duplicate.isPending}
            className="rounded-lg border border-app-border px-3 py-1.5 text-sm text-fg-muted hover:text-fg disabled:opacity-50"
          >
            Duplicate
          </button>
          <button
            onClick={onDelete}
            disabled={del.isPending}
            className="rounded-lg border border-app-border px-3 py-1.5 text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Element-type hub. Counts go live in Slice 5 (dashboard aggregation). */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {ELEMENT_TYPES.map((e) => (
          <Link
            key={e.type}
            to={`/campaigns/${campaign.id}/${e.type}`}
            className="rounded-xl border border-app-border bg-app-surface p-4 text-center hover:border-fg-muted"
          >
            <div className="text-[11px] uppercase tracking-wide text-fg-muted">{e.label}</div>
          </Link>
        ))}
      </div>

      {campaign.storySoFar && (
        <div className="mt-8 rounded-xl border border-app-border bg-app-surface p-5">
          <h3 className="text-sm font-bold">Story so far</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm text-fg-muted">
            {campaign.storySoFar}
          </p>
        </div>
      )}
    </div>
  );
}
