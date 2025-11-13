import { LANGUAGES } from "@/constants/languages";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import SimpleBar from "simplebar-react";

const LanguagesSlider = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleClick = (code: string) => {
    const selectedLanguage = LANGUAGES?.find(
      (language) => language.code === code
    );
    if (selectedLanguage) {
      const searchParams = new URLSearchParams(window?.location.search);
      searchParams.set("lang", encodeURIComponent(selectedLanguage?.code!));
      const newPathname = `${
        window.location.pathname
      }?${searchParams.toString()}`;
      router.push(newPathname);
    }
  };
  return (
    <div
      className={cn(
        " z-20 border-b border-gray-300 bg-white py-0 font-medium text-gray-500 @2xl:top-[72px] dark:bg-gray-50 2xl:top-20"
      )}
    >
      <SimpleBar>
        <ul className="inline-grid grid-flow-col gap-5 md:gap-7 lg:gap-10">
          {LANGUAGES?.map((language) => (
            <li
              key={language?.code}
              onClick={() => handleClick(language?.code)}
              className={cn(
                searchParams.get("lang") === language?.code
                  ? "py-4 font-semibold text-gray-1000"
                  : "relative cursor-pointer whitespace-nowrap py-4 hover:text-gray-1000"
              )}
            >
              {language?.title}
            </li>
          ))}
        </ul>
      </SimpleBar>
    </div>
  );
};

export default LanguagesSlider;
