import { Link, useNavigate, useParams } from 'react-router-dom';
import { ELEMENT_TYPE_BY_SEGMENT, segmentForType } from '../data/elementTypes';
import {
  useBacklinks,
  useCreateElement,
  useDeleteElement,
  useElement,
  useUpdateElement,
} from '../data/elements';
import ElementForm, { type ElementFormResult } from '../components/ElementForm';

export default function ElementEditor() {
  const { cid, type: seg, elementId } = useParams();
  const cfg = seg ? ELEMENT_TYPE_BY_SEGMENT[seg] : undefined;
  const isNew = elementId === 'new';
  const navigate = useNavigate();

  const { data: element, isLoading } = useElement(cid ?? '', isNew ? undefined : elementId);
  const create = useCreateElement(cid ?? '');
  const update = useUpdateElement(cid ?? '', elementId ?? '');
  const del = useDeleteElement(cid ?? '');
  const backlinks = useBacklinks(cid ?? '', isNew ? undefined : elementId);

  const backTo = `/campaigns/${cid}/${seg}`;

  if (!cfg || !cfg.available) {
    return <p className="text-sm text-fg-muted">Not available.</p>;
  }
  if (!isNew && isLoading) {
    return <p className="text-sm text-fg-muted">Loading…</p>;
  }
  if (!isNew && !element) {
    return <p className="text-sm text-red-400">{cfg.label} not found.</p>;
  }

  const onSubmit = (r: ElementFormResult) => {
    if (isNew) {
      create.mutate(
        { type: cfg.type, ...r },
        { onSuccess: () => navigate(backTo) },
      );
    } else {
      update.mutate(r, { onSuccess: () => navigate(backTo) });
    }
  };

  const onDelete = () => {
    if (!element) return;
    if (!window.confirm(`Move "${element.name}" to trash?`)) return;
    del.mutate(element.id, { onSuccess: () => navigate(backTo) });
  };

  const mutationError = (isNew ? create.error : update.error) as Error | null;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {isNew ? `New ${cfg.label}` : `Edit ${cfg.label}`}
        </h1>
        {!isNew && (
          <button
            onClick={onDelete}
            disabled={del.isPending}
            className="rounded-lg border border-app-border px-3 py-1.5 text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
          >
            Delete
          </button>
        )}
      </div>

      <div className="mt-5 rounded-xl border border-app-border bg-app-surface p-5">
        <ElementForm
          campaignId={cid ?? ''}
          dataFields={cfg.dataFields}
          relationships={cfg.relationships}
          selfId={element?.id}
          submitLabel={isNew ? `Create ${cfg.label}` : 'Save changes'}
          busy={create.isPending || update.isPending}
          error={mutationError ? mutationError.message : null}
          defaultValues={
            element
              ? {
                  name: element.name,
                  body: element.body,
                  tagsInput: element.tags.join(', '),
                  playerVisible: element.playerVisible,
                  secrets: element.secrets,
                  data: element.data,
                  relationships: element.links
                    .filter((l) => l.source === 'relationship')
                    .map((l) => ({ targetId: l.targetId, relType: l.relType })),
                }
              : undefined
          }
          onSubmit={onSubmit}
          onCancel={() => navigate(backTo)}
        />
      </div>

      {!isNew && backlinks.data && backlinks.data.length > 0 && (
        <div className="mt-6 rounded-xl border border-app-border bg-app-surface p-4">
          <h3 className="text-sm font-bold">Linked from</h3>
          <ul className="mt-2 space-y-1">
            {backlinks.data.map((b) => {
              const seg = segmentForType(b.type);
              return (
                <li key={b.id} className="flex items-center gap-2">
                  {seg ? (
                    <Link
                      to={`/campaigns/${cid}/${seg}/${b.id}`}
                      className="text-sm text-fg-muted hover:text-brand"
                    >
                      {b.name}
                    </Link>
                  ) : (
                    <span className="text-sm text-fg-muted">{b.name}</span>
                  )}
                  <span className="text-[10px] uppercase tracking-wide text-fg-muted">
                    {b.type}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
