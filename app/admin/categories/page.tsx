import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { listCategories } from "@/lib/repositories";

export default async function AdminCategoriesPage() {
  const items = await listCategories();
  return (
    <div>
      <PageHeader title="Admin / Categories" />
      <DataTable
        headers={["Code", "Name EN", "Name DE", "Sort Order", "Active"]}
        rows={items.map((item) => [item.code, item.nameEn, item.nameDe ?? "-", item.sortOrder, item.isActive ? "Yes" : "No"])}
      />
    </div>
  );
}
