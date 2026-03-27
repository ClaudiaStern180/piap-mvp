import { PageHeader } from "@/components/PageHeader";
import { DataTable } from "@/components/DataTable";
import { listAreas } from "@/lib/repositories";

export default async function AdminAreasPage() {
  const items = await listAreas();
  return (
    <div>
      <PageHeader title="Admin / Areas" />
      <DataTable
        headers={["Code", "Name EN", "Name DE", "Sort Order", "Active"]}
        rows={items.map((item) => [item.code, item.nameEn, item.nameDe ?? "-", item.sortOrder, item.isActive ? "Yes" : "No"])}
      />
    </div>
  );
}
