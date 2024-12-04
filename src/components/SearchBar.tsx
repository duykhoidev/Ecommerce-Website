"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SearchBar = () => {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    // Because the default behavior is refreshing the page
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get("searchValue") as string;

    if (searchValue) {
      router.push(`/list?search=${searchValue}`);
    }
  };
  return (
    <form
      className="flex items-center justify-between gap-4 bg-gray-100 p-2 rounded-md flex-1"
      onSubmit={handleSearch}
    >
      <input
        type="text"
        name="searchValue"
        placeholder="Search"
        className="flex-1 bg-transparent outline-none"
      />
      <button className="cursor-pointer">
        <Image src="/search.svg" alt="" width={16} height={16} />
      </button>
    </form>
  );
};

export default SearchBar;
