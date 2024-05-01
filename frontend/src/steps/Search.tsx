import { useEffect, useState } from "react";
import { Data } from "../types";
import { searchData } from "../services/search";
import { toast } from "sonner";
import { useDebounce } from "@uidotdev/usehooks";

const DEBOUNCE_TIME = 500;

export const Search = ({ initialData }: { initialData: Data }) => {
  const [data, setData] = useState<Data>(initialData);
  const [searchTerm, setSearchTerm] = useState<string>(()=>{
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("q") ?? "";
  });


  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_TIME);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const newPathname =
    debouncedSearchTerm === "" ? window.location.pathname : `?q=${debouncedSearchTerm}`;
    window.history.pushState({}, "", newPathname);
  }, [debouncedSearchTerm]);

  useEffect(() => {
   if(!debouncedSearchTerm){
    setData(initialData);
    return;
   }
    //call to the api to filter the results
    searchData(debouncedSearchTerm).then((response) => {
      const [error, newData] = response;
      if (error) {
        toast.error(error.message);
        return;
      }
      if (newData) setData(newData);
    });
  }, [debouncedSearchTerm, initialData]);

  return (
    <div>
      <h1>Search</h1>
      <form>
        <input onChange={handleSearch} type="search" placeholder="Search..." defaultValue={searchTerm} />
      </form>
      <ul>
        {data.map((row) => (
          <li key={row.id}>
            <article>
              {Object.entries(row).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}</strong>
                  {value}
                </p>
              ))}
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
};
