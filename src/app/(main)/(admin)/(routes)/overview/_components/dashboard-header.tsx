import { Text, Title } from "@/components/ui/text";

interface DashboardHeaderProps {
  name?: string;
}

const DashboardHeader = ({ name }: DashboardHeaderProps) => {
  return (
    <div>
      <Title>Welcome back{name ? `, ${name}` : ""}! 👋</Title>
      <Text>Here&apos;s an overview of your school.</Text>
    </div>
  );
};

export default DashboardHeader;
