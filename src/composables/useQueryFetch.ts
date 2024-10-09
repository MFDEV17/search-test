import { useInfiniteScroll, watchDebounced } from "@vueuse/core";
import { useAxios } from "@vueuse/integrations/useAxios";
import { ref } from "vue";

type FetchData = {
  id: string;
  value: string;
};

export function useURLFetch(startFetchLen: number = 2) {
  const queryText = ref("");
  const queryPage = ref(1);
  const queryData = ref<FetchData[]>([]);
  const filterByASC = ref(false);

  const toggleSort = () => {
    filterByASC.value = !filterByASC.value;
  };

  const baseURL = "http://localhost:3000/urls";

  const { execute, data } = useAxios<FetchData[]>(
    baseURL,
    { method: "GET" },
    { immediate: false }
  );

  const hasData = ref(true);

  watchDebounced(
    queryText,
    () => {
      if (queryText.value.length >= startFetchLen) {
        queryData.value = [];
        queryPage.value = 1;

        execute({
          params: {
            value_like: queryText.value,
            _page: queryPage.value,
            _sort: filterByASC.value ? "asc" : "",
          },
        }).then(() => {
          if (data.value && data.value.length > 0) {
            queryData.value = data.value;
            hasData.value = data.value.length == 10;
          } else {
            hasData.value = false;
          }
        });
      }
    },
    { debounce: 300 }
  );

  const infiniteScrollEl = ref<HTMLElement | null>();

  useInfiniteScroll(infiniteScrollEl, () => {
    if (hasData.value && queryText.value.length >= startFetchLen) {
      execute({
        params: {
          value_like: queryText.value,
          _page: ++queryPage.value,
          _sort: filterByASC.value ? "asc" : "",
        },
      }).then(() => {
        if (data.value && data.value.length > 0) {
          queryData.value.push(...data.value);
          hasData.value = data.value.length == 10;
        } else {
          hasData.value = false;
        }
      });
    }
  });

  return {
    queryData,
    queryText,
    infiniteScrollEl,
    hasData,

    toggleSort,
  };
}
