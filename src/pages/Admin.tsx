import NavHeader from "@/components/NavHeader";
import AdminDashboardComponent from "@/components/AdminDashboard";

const Admin = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavHeader />
      <div className="container mx-auto px-6 py-8">
        <AdminDashboardComponent />
      </div>
    </div>
  );
};

export default Admin;
