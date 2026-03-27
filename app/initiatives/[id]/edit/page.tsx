import { notFound } from 'next/navigation';
import { InitiativeForm } from '@/components/forms/InitiativeForm';
import { PageHeader } from '@/components/PageHeader';
import { getInitiativeById, listAreas, listCategories } from '@/lib/repositories';

export default async function EditInitiativePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [initiative, areas, categories] = await Promise.all([getInitiativeById(id), listAreas(), listCategories()]);
  if (!initiative) notFound();

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <PageHeader title={`Edit Initiative ${initiative.initiativeNo}`} />
      <InitiativeForm mode="edit" areas={areas} categories={categories} initialValue={{ ...initiative, areaId: initiative.area.id, categoryId: initiative.category.id }} />
    </div>
  );
}
