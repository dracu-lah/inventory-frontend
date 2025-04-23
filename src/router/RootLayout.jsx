import { Outlet } from "react-router";
import Header from "@/components/shared/Header";
import { Suspense } from "react";
import PageLoader from "@/components/loaders/PageLoader";
// import ScrollToTop from "./ScrollToTop";
import useAuthStore from "@/store/useAuthStore";
import Sidebar from "@/components/shared/Sidebar";

const RootLayout = () => {
  const { accessToken } = useAuthStore();
  return (
    <main className="flex min-h-screen flex-col justify-between bg-background font-sans">
      <Header />
      <div className="flex flex-1">
        {accessToken && <Sidebar />}
        <Suspense fallback={<PageLoader />}>
          <div className="h-[calc(100vh-6rem)] flex-1 overflow-auto">
            <Outlet />
          </div>
        </Suspense>
      </div>
      {/* <ScrollToTop /> */}
    </main>
  );
};
export default RootLayout;
