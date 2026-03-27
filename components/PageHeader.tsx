import { ReactNode } from "react";

export function PageHeader({ title, actions }: { title: string; actions?: ReactNode }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
      <h1 style={{ margin: 0, fontSize: 28 }}>{title}</h1>
      <div style={{ display: "flex", gap: 8 }}>{actions}</div>
    </div>
  );
}
