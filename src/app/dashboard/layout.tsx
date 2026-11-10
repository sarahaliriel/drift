import type { ReactNode } from "react";
import { DashboardProvider } from "@/features/dashboard/DashboardProvider";
import { DashboardSidebar } from "@/features/dashboard/components/DashboardSidebar";
import "./dashboard.css";
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `try{var t=localStorage.getItem("drift-dashboard-theme")||"system";document.documentElement.dataset.dashboardTheme=t==="system"?(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):tvar c=localStorage.getItem("drift-sidebar-collapsed");document.documentElement.dataset.dashboardSidebar=c===null?(matchMedia("(max-width: 900px)").matches?"collapsed":"expanded"):(c==="true"?"collapsed":"expanded")}catch(e){}`,
        }}
      />
      <DashboardProvider>
        <div className='dash-app'>
          <DashboardSidebar />
          <div className='dash-main'>
            <div className='dash-mobile-top'>
              <span>Drift</span>
            </div>
            <main className='dash-content'>{children}</main>
          </div>
        </div>
      </DashboardProvider>
    </>
  );
}
