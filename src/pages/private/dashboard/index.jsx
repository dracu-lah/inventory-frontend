import { RecentTransactions } from "./components/RecentTransactions";
import { Overview } from "./components/Overview";
import UsersActivity from "./components/UsersActivity";
import { withPageAccess } from "@/hooks/usePagePermisssions";
import { GetDashboardAPI } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import PageLoader from "@/components/loaders/PageLoader";
import menuKeys from "@/utils/constants/menuKeys";
import CustomNoAccessComponent from "./components/CustomNoAccessComponent";
const DashBoardPage = () => {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["GetDashboardAPI"],
    queryFn: () => GetDashboardAPI(),
  });
  if (isLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <PageLoader />
      </div>
    );
  return (
    <div className="w-full space-y-4 p-4">
      <h1 className="text-3xl font-semibold">Dashboard </h1>
      <UsersActivity
        usersActivityData={dashboardData.data.dashBoardUserActivity || []}
      />
      <div className="flex flex-col gap-x-4 gap-y-4 lg:flex-row">
        <Overview
          enrollmentData={dashboardData.data.memberEnrollmentByMonth || []}
        />
        <RecentTransactions
          transactionData={dashboardData.data.dashBoardRecentTransactions || []}
        />
      </div>
    </div>
  );
};

export default withPageAccess(
  DashBoardPage,
  menuKeys.DASHBOARD,
  CustomNoAccessComponent,
);
