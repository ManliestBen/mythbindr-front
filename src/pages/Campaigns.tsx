import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCampaigns, useCreateCampaign, type CampaignFormValues } from '../data/campaigns';
import CampaignForm from '../components/CampaignForm';

export default function Campaigns() {
  const { data: campaigns, isLoading, error } = useCampaigns();
  const create = useCreateCampaign();
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const onCreate = (values: CampaignFormValues) =>
    create.mutate(values, {
      onSuccess: (campaign) => {
        setCreating(false);
        navigate(`/campaigns/${campaign.id}`);
      },
    });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-app-bg hover:bg-brand-bright"
          >
            + New campaign
          </button>
        )}
      </div>

      {creating && (
        <section className="mt-6 rounded-xl border border-app-border bg-app-surface p-5">
          <h2 className="font-heading text-lg font-bold">New campaign</h2>
          <div className="mt-4">
            <CampaignForm
              submitLabel="Create campaign"
              busy={create.isPending}
              error={create.error instanceof Error ? create.error.message : null}
              onSubmit={onCreate}
              onCancel={() => setCreating(false)}
            />
          </div>
        </section>
      )}

      <div className="mt-6">
        {isLoading && <p className="text-sm text-fg-muted">Loading campaigns…</p>}
        {error && (
          <p className="text-sm text-red-400">
            {error instanceof Error ? error.message : 'Failed to load campaigns'}
          </p>
        )}

        {campaigns && campaigns.length === 0 && !creating && (
          <div className="rounded-xl border border-dashed border-app-border p-10 text-center">
            <p className="text-sm text-fg-muted">
              No campaigns yet. Create your first one to start building.
            </p>
          </div>
        )}

        {campaigns && campaigns.length > 0 && (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {campaigns.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/campaigns/${c.id}`}
                  className="block rounded-xl border border-app-border bg-app-surface p-4 transition hover:border-fg-muted"
                >
                  <div className="font-heading text-base font-bold">{c.name}</div>
                  {c.hook && <p className="mt-1 text-sm text-fg-muted">{c.hook}</p>}
                  <p className="mt-2 text-[11px] uppercase tracking-wide text-fg-muted">
                    {c.settingName ? `${c.settingName} · ` : ''}Levels {c.startLevel}–
                    {c.endLevel}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
