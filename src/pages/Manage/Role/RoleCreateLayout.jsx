import PageMeta from "../../../components/common/PageMeta";
import FormCreate from "../../../components/manage/role/FormCreate";

export default function RoleCreateLayout() {
  return (
    <>
      <PageMeta
        title="Roilerplate - Boilerplate React.js and Tailwind"
        description="This is React.js project template using Tailwind css including RBAC set up"
      />
      <FormCreate />
    </>
  );
}
