"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";

function Filter() {
  // important notice
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const activeFilter = searchParams.get("capacity") ?? "all";
  
  function handleFilter(filter) {
    const Params = new URLSearchParams(searchParams);
    Params.set("capacity", filter);
    router.replace(`${pathName}?${Params.toString()}`, { scroll: false });
  }
  return (
    <div className="border border-primary-800 flex">
      <Button
        activeFilter={activeFilter}
        handleFilter={handleFilter}
        type="all"
      >
        All Cabins
      </Button>{" "}
      <Button
        activeFilter={activeFilter}
        handleFilter={handleFilter}
        type="small"
      >
        1&mdash;3 guests
      </Button>{" "}
      <Button
        activeFilter={activeFilter}
        handleFilter={handleFilter}
        type="medium"
      >
        4&mdash;7 guests
      </Button>{" "}
      <Button
        activeFilter={activeFilter}
        handleFilter={handleFilter}
        type="large"
      >
        8&mdash;12 guests
      </Button>
    </div>
  );
}
function Button({ type, children, handleFilter, activeFilter }) {
  return (
    <button
      onClick={() => handleFilter(type)}
      className={`px-5 py-2 hover:bg-primary-700 ${
        activeFilter === type ? "bg-primary-700 " : ""
      }`}
    >
      {children}
    </button>
  );
}
export default Filter;
