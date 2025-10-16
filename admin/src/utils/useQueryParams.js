import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { parse, stringify } from "qs";

const useQueryParams = (initialParams = {}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const query = useMemo(() => {
    const searchQuery = location.search.substring(1);

    if (!location.search) {
      return initialParams;
    }

    return parse(searchQuery);
  }, [location.search, initialParams]);

  const setQuery = useCallback(
    (nextParams, method = "push") => {
      let nextQuery = { ...query };

      if (method === "remove") {
        Object.keys(nextParams).forEach((key) => {
          delete nextQuery[key];
        });
      } else {
        nextQuery = { ...query, ...nextParams };
      }

      const searchString = stringify(nextQuery, { encode: false });
      navigate(
        { search: searchString ? `?${searchString}` : "" },
        { replace: method === "replace" },
      );
    },
    [navigate, query],
  );

  return [{ query, rawQuery: location.search }, setQuery];
};

export default useQueryParams;
