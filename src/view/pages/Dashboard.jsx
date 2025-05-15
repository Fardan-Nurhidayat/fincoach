import DashboardLayout from '../components/DashboardLayout';
import TableComponent from "../components/Table";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="h-full bg-white rounded-2xl p-8 shadow-md">
        <TableComponent />
      </div>
    </DashboardLayout>
  );
}
