import { InitiativeForm } from '@/components/forms/InitiativeForm';
import { PageHeader } from '@/components/PageHeader';
import { listAreas, listCategories } from '@/lib/repositories';

export default async function NewInitiativePage() {
  const [areas, categories] = await Promise.all([listAreas(), listCategories()]);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <PageHeader title="New Initiative" />
      <InitiativeForm mode="create" areas={areas} categories={categories} />
    </div>
  );
}
