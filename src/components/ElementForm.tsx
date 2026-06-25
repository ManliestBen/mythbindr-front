import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const inputCls =
  'mt-1 w-full rounded-lg border border-app-border bg-app-bg px-3 py-2 text-sm outline-none focus:border-brand';
const labelCls = 'block text-xs font-medium text-fg-muted';

export const elementFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  body: z.string().optional(),
  tagsInput: z.string().optional(),
  playerVisible: z.boolean().optional(),
  secrets: z.string().optional(),
});
export type ElementFormValues = z.infer<typeof elementFormSchema>;

/** Normalized result handed to the caller (tags split, defaults filled). */
export interface ElementFormResult {
  name: string;
  body: string;
  tags: string[];
  playerVisible: boolean;
  secrets: string;
}

export default function ElementForm({
  defaultValues,
  onSubmit,
  submitLabel,
  busy,
  onCancel,
  error,
}: {
  defaultValues?: ElementFormValues;
  onSubmit: (result: ElementFormResult) => void;
  submitLabel: string;
  busy?: boolean;
  onCancel?: () => void;
  error?: string | null;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ElementFormValues>({
    resolver: zodResolver(elementFormSchema),
    defaultValues,
  });

  const submit = (v: ElementFormValues) =>
    onSubmit({
      name: v.name.trim(),
      body: v.body ?? '',
      tags: (v.tagsInput ?? '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      playerVisible: v.playerVisible ?? false,
      secrets: v.secrets ?? '',
    });

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div>
        <label className={labelCls}>Name</label>
        <input className={inputCls} {...register('name')} placeholder="Name" />
        {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
      </div>
      <div>
        <label className={labelCls}>Body</label>
        <textarea rows={6} className={inputCls} {...register('body')} placeholder="Write…" />
      </div>
      <div>
        <label className={labelCls}>Tags (comma-separated)</label>
        <input className={inputCls} {...register('tagsInput')} placeholder="lore, tavern" />
      </div>
      <div>
        <label className={labelCls}>GM secrets (never shown to players)</label>
        <textarea
          rows={2}
          className={inputCls}
          {...register('secrets')}
          placeholder="Hidden details…"
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register('playerVisible')} className="accent-brand" />
        Visible in the player share view
      </label>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-app-bg hover:bg-brand-bright disabled:opacity-50"
        >
          {busy ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-app-border px-4 py-2 text-sm text-fg-muted hover:text-fg"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
