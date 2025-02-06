<template>
  <div class="h-full m-10 border border-gray-200 rounded-lg p-3">
    <div class="flex-grow flex mb-4">
      <SearchInput placeholder="Search" modelValue="" />
    </div>
    <table
      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
    >
      <thead
        class="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3">SKU</th>
          <th scope="col" class="px-6 py-3">Product Name</th>
          <th scope="col" class="px-6 py-3 !w-40">
            <span
              v-if="props.dailySalesSkuListData.selectedDate"
              class="block text-right"
            >
              {{ getDayByDate(props.dailySalesSkuListData.selectedDate) }}
            </span>
            <span
              v-if="props.dailySalesSkuListData.selectedDate"
              class="block text-right"
            >
              {{ formatDate(props.dailySalesSkuListData.selectedDate) }}
            </span>
            <span class="block text-right">Sales / Units</span>
            <span class="block text-right">Avg. Selling Price</span>
          </th>
          <th
            v-if="props.dailySalesSkuListData.selectedDate2"
            scope="col"
            class="px-6 py-3 !w-40"
          >
            <span class="block text-right">
              {{ getDayByDate(props.dailySalesSkuListData.selectedDate2) }}
            </span>
            <span class="block text-right">
              {{ formatDate(props.dailySalesSkuListData.selectedDate2) }}
            </span>
            <span class="block text-right">Sales / Units</span>
            <span class="block text-right">Avg. Selling Price</span>
          </th>
          <th scope="col" class="!w-36 px-6 py-3">Sku Refund Rate</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in props.dailySalesSkuListData.skuList"
          :key="index"
          class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
        >
          <td class="px-6 py-4">{{ item.sku }}</td>
          <td class="px-6 py-4">{{ item.productName }}</td>
          <td
            class="px-6 py-4 items-center text-[#2CAFFE] font-bold text-right"
          >
            <div class="ml-4 text-right">
              <span>${{ item.amount }} / {{ item.qty }} </span><br />
              <span>
                {{
                  item.qty && !isNaN(item.amount / item.qty)
                    ? `$${(item.amount / item.qty).toFixed(2)}`
                    : "$0.00"
                }}
              </span>
            </div>
          </td>
          <td
            v-if="props.dailySalesSkuListData.selectedDate2"
            class="px-6 py-4 items-center text-[#00E272] font-bold text-right"
          >
            <div class="ml-4">
              <span>${{ item.amount2 }} / {{ item.qty2 }} </span><br />
              <span>
                {{
                  item.qty2 && !isNaN(item.amount2 / item.qty2)
                    ? `$${(item.amount2 / item.qty2).toFixed(2)}`
                    : "$0.00"
                }}
              </span>
            </div>
          </td>
          <td class="px-6 py-4 text-right">
            {{ item.refundPercantage }} {{ item.refundPercantage ? "%" : "" }}
          </td>
        </tr>
      </tbody>
    </table>
    <nav
      class="flex items-center flex-column flex-wrap md:flex-row justify-end pt-4"
      aria-label="Table navigation"
    >
      <ul
        class="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8 justify-end"
      >
        <li>
          <a
            @click="$emit('prevPage')"
            href="#"
            class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-blue-600 bg-white border border-e-0 border-gray-300 rounded-s-xl hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span class="sr-only">Previous</span>
            <svg
              class="w-2.5 h-2.5 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center justify-center px-3 h-8 leading-tight text-white font-semibold bg-blue-600 border border-gray-300 hover:bg-blue-400 hover:text-black dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            {{ pageNumber }}
          </a>
        </li>
        <li>
          <a
            @click="$emit('nextPage')"
            href="#"
            class="flex items-center justify-center px-3 h-8 leading-tight text-blue-600 bg-white border border-gray-300 rounded-e-xl hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            <span class="sr-only">Next</span>
            <svg
              class="w-2.5 h-2.5 rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import moment from "moment";
import { defineProps, defineEmits } from "vue";
import SearchInput from "/src/components/SearchInput.vue";

interface IProps {
  dailySalesData: [];
  dailySalesSkuListData: [];
  skuRefundRateData: [];
  pageNumber: number;
}
const props = defineProps<IProps>();

interface IEmits {
  (event: "prevPage"): void;
  (event: "nextPage"): void;
}

const emit = defineEmits<IEmits>();

function getDayByDate(date: string): string {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const d = new Date(date);
  if (isNaN(d.getTime())) {
    return "Invalid Date";
  }
  const dayNumber = d.getDay();
  return weekday[dayNumber];
}

function formatDate(date: string): string {
  return moment(date).format("DD-MM-YYYY");
}
</script>
