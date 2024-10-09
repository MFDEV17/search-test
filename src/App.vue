<script setup lang="ts">
import { ref } from "vue";
import { useURLFetch } from "./composables/useQueryFetch";

const { queryData, queryText, infiniteScrollEl, hasData, toggleSort } =
  useURLFetch();

const selected = ref(null);
</script>

<template>
  <div class="content">
    <v-select
      :options="queryData"
      label="value"
      v-model="selected"
      class="select style-chooser"
    >
      <template #search="{ attributes, events }">
        <input
          :required="!selected"
          class="vs__search"
          v-bind="attributes"
          v-on="events"
          v-model="queryText"
        />
      </template>

      <template #list-footer>
        <li
          ref="infiniteScrollEl"
          class="loader"
          v-show="queryData.length > 0 && hasData"
        >
          Loading more...
        </li>
      </template>
    </v-select>
    <button @click="toggleSort">Sort</button>
  </div>
</template>

<style>
.content {
  display: flex;
  flex-direction: column;
  place-items: center;
  row-gap: 1rem;
}
.select {
  max-width: 300px;
  min-width: 300px;
  margin: 0 auto;
}

.style-chooser .vs__dropdown-menu {
  min-height: 50px;
  max-height: 250px;
  overflow-y: scroll;
}

.loader {
  margin-top: 1.5rem;
  text-align: center;
  color: #bbbbbb;
}
</style>
