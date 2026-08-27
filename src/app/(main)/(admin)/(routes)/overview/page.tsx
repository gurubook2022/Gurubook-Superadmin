import { ClockIcon, UserCheckIcon, UsersIcon } from "lucide-react";
import { getUserRegisterByAdmin } from "../users/actions";
import { getAdminProfile } from "../settings/actions";
import { UserT } from "../users/types";
import DashboardHeader from "./_components/dashboard-header";
import StatCard from "./_components/stat-card";
import StudentsOverviewTable from "./_components/students-overview-table";

export const revalidate = 0; // revalidate at most every hour

const isThisMonth = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
};

const page = async () => {
  const [usersResponse, profileResponse] = await Promise.all([
    getUserRegisterByAdmin(),
    getAdminProfile(),
  ]);

  const students =
    (usersResponse?.data?.getUsersRegisteredByAdmin as UserT[]) || [];
  const adminProfile = profileResponse?.data?.getAdminProfile;

  const totalStudents = students.length;
  const newStudentsThisMonth = students.filter((student) =>
    isThisMonth(student.createdAt)
  ).length;

  const activeStudents = students.filter(
    (student) => student.isVerified && student.status
  );
  const activePercentage =
    totalStudents > 0
      ? Math.round((activeStudents.length / totalStudents) * 100)
      : 0;

  const waitingStudents = students.filter((student) => !student.isVerified);
  const newWaitingThisMonth = waitingStudents.filter((student) =>
    isThisMonth(student.createdAt)
  ).length;

  return (
    <div className="space-y-6">
      <DashboardHeader name={adminProfile?.firstName} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={UsersIcon}
          iconClassName="bg-primary-lighter text-primary"
          title="Total Students"
          value={totalStudents}
          delta={
            newStudentsThisMonth > 0
              ? `↑ ${newStudentsThisMonth} this month`
              : undefined
          }
          deltaClassName="text-green-dark"
        />
        <StatCard
          icon={UserCheckIcon}
          iconClassName="bg-green-lighter text-green-dark"
          title="Active Students"
          value={activeStudents.length}
          delta={`${activePercentage}% of total`}
          deltaClassName="text-green-dark"
        />
        <StatCard
          icon={ClockIcon}
          iconClassName="bg-orange-lighter text-orange-dark"
          title="Waiting for Activation"
          value={waitingStudents.length}
          delta={
            newWaitingThisMonth > 0
              ? `↑ ${newWaitingThisMonth} this month`
              : undefined
          }
          deltaClassName="text-orange-dark"
        />
      </div>

      <StudentsOverviewTable students={students} />
    </div>
  );
};

export default page;
