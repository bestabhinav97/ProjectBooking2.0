import { useParams } from "react-router-dom";

function AdminPlaceholder() {
  const { sectionName } = useParams();

  const title = sectionName
    ? sectionName.replace("-", " ")
    : "Admin section";

  return (
    <section className="admin-dashboard-home">
      <p className="admin-page-kicker">Admin section</p>
      <h1>{title}</h1>
      <p>This admin section is not built yet.</p>
    </section>
  );
}

export default AdminPlaceholder;