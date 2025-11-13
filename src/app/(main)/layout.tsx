import Header from "./_components/header";
import Navigation from "./_components/navigation";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex bg-[#F8F8F8] duration-300 min-h-screen flex-grow">
      <div className="hidden md:block z-50">
        <Navigation className="fixed hidden  xl:block" />
      </div>
      <div className="flex w-full flex-col xl:ms-[270px] xl:w-[calc(100%-270px)] 2xl:ms-72 2xl:w-[calc(100%-288px)]">
        <Header />
        <div className="flex flex-grow flex-col p-4 md:px-5 lg:p-6 3xl:p-8 4xl:p-10 space-y-4 ">
          <div className="rounded-xl p-4 min-h-full overflow-hidden bg-gradient-to-br from-white via-white to-white/8S0">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default layout;
