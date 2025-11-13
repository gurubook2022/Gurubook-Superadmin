import { Loader as RizzLoader } from "@/components/ui/loader";
const Loader = () => {
  return (
    <div className="min-h-[calc(100vh-140px)] lg:min-h-[calc(100vh-154px)] xl:min-h-[calc(100vh-98px)] flex items-center justify-center">
      <RizzLoader className="w-10 h-10" />
    </div>
  );
};

export default Loader;
