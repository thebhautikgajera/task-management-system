"use client";

import AdminHeader from "../Others/AdminHeader";
import AdminStats from "../Others/AdminStats";
import AdminAllTasklist from "../Others/AdminAllTasklist";
import AdminUserList from "../Others/AdminUserList";

const AdminDashboard = () => {
  return (
    <>
      <div className="sticky top-0 z-50">
        <AdminHeader />
      </div>

      <div className="mt-12">
        <AdminStats />
      </div>

      <div className="mt-12">
        <AdminAllTasklist />
      </div>

      <div className="mt-12 mb-16">
        <AdminUserList />
      </div>
    </>
  );
};

export default AdminDashboard;
