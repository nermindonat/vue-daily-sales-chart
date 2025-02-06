<template>
  <Header />
  <div>
    <Spinner v-if="pageLoading" center size="large" />
  </div>
  <div class="h-full p-2 flex flex-col border border-gray-200 m-10 rounded-lg">
    <div class="flex flex-row justify-between pt-1 mb-4">
      <h2 class="font-semibold ml-2">Daily Sales</h2>
      <div class="flex items-center mr-4">
        <select id="dayRange" v-model="selectedDay" class="font-semibold">
          <option value="60">Last 60 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="14">Last 14 Days</option>
          <option value="7">Last 7 Days</option>
        </select>
      </div>
    </div>
    <div ref="chartContainer" class="h-[600px]"></div>
  </div>

  <DailySalesTable
    v-if="showDetailTable"
    :dailySalesData="dailySalesData"
    :dailySalesSkuListData="dailySalesSkuListData"
    :skuRefundRateData="skuRefundRateData"
    :pageNumber="pageNumber"
    @prevPage="prevPage"
    @nextPage="nextPage"
  />
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import Highcharts from "highcharts";
import { useStore } from "vuex";
import DailySalesTable from "./DailySalesTable.vue";
import Header from "/src/layouts/Header.vue";
import Spinner from "/src/components/Spinner.vue";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const store = useStore();

const chartContainer = ref<HTMLDivElement | null>(null);
const selectedDay = ref(30);
const token = store.getters.getToken;
const showDetailTable = ref(false);
const firstDate = ref("");
const secondDate = ref("");
const clickCount = ref(0);
const pageNumber = ref(1);
const isDaysCompare = ref(0);
const dailySalesData = ref<[]>([]);
const dailySalesSkuListData = ref<[]>([]);
const skuRefundRateData = ref<[]>([]);
const pageLoading = ref(false);

const fetchDailySales = async (
  marketplaceName: string,
  storeId: string,
  selectedDay: number
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/data/daily-sales-overview`,
      {
        customDateData: null,
        day: parseInt(selectedDay),
        excludeYoYData: true,
        marketplace: marketplaceName,
        requestStatus: 0,
        sellerId: storeId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dailySalesData.value = response.data.Data.item;
    // console.log("dailySalesData:", dailySalesData.value);

    return response.data.Data.item;
  } catch (error) {
    console.error("Veri çekme hatası:", error);
  }
};

const fetchDailySalesSkuList = async (
  marketplaceName: string,
  storeId: string
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/data/daily-sales-sku-list/`,
      {
        marketplace: marketplaceName,
        sellerId: storeId,
        salesDate: firstDate.value,
        salesDate2: secondDate.value,
        pageSize: 10,
        pageNumber: pageNumber.value,
        isDaysCompare: isDaysCompare.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dailySalesSkuListData.value = response.data.Data.item;
    console.log("dailySalesSkuListData : ", dailySalesSkuListData.value);

    const skuList = dailySalesSkuListData.value.skuList;
    await fetchSkuRefundRate(marketplaceName, storeId, skuList);
  } catch (error: any) {
    throw new Error(error);
  }
};

const fetchSkuRefundRate = async (
  marketplaceName: string,
  storeId: string,
  skuList: Array<string>
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/data/get-sku-refund-rate/`,
      {
        marketplace: marketplaceName,
        sellerId: storeId,
        skuList: skuList,
        requestedDay: parseInt(selectedDay.value),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    skuRefundRateData.value = response.data.Data;
    // console.log("skuRefundRateData :", skuRefundRateData.value);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

function getDayByDate(date: string) {
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
  const dayNumber = d.getDay();
  return weekday[dayNumber];
}

const updateChart = async () => {
  const userInfo = store.getters.getUserInfo;
  const marketplaceName = userInfo?.Data?.user?.store[0]?.marketplaceName;
  const storeId = userInfo?.Data?.user?.store[0]?.storeId;

  if (marketplaceName && storeId) {
    pageLoading.value = true;
    const newdailySalesData = await fetchDailySales(
      marketplaceName,
      storeId,
      selectedDay.value
    );
    if (chartContainer.value) {
      Highcharts.chart(chartContainer.value, {
        title: {
          text: "",
        },
        chart: {
          type: "column",
        },
        yAxis: {
          title: {
            text: "Amount ($)",
          },
          scrollbar: {
            enabled: false,
          },
          min: 0,
          max: 650,
          tickInterval: 50,
        },
        xAxis: {
          categories: newdailySalesData.map(
            (item: any) => `${getDayByDate(item.date)}, ${item.date}`
          ),
          scrollbar: {
            enabled: false,
          },
        },
        plotOptions: {
          column: {
            pointWidth: 20,
            stacking: "normal",
            allowPointSelect: true,
            states: {
              select: {
                color: "#D3D3D3",
              },
            },
            dataLabels: {
              enabled: true,
              format: "${y}",
              inside: true,
              verticalAlign: "middle",
              align: "center",
              rotation: 270,
              color: "white",
              style: {
                fontSize: "12px",
                fontWeight: "bold",
              },
            },
            point: {
              events: {
                click: function () {
                  const selectedDate = newdailySalesData[this.index].date;
                  if (clickCount.value === 0) {
                    firstDate.value = selectedDate;
                    clickCount.value = 1;
                  } else if (clickCount.value === 1) {
                    secondDate.value = selectedDate;
                    clickCount.value = 2;
                  } else {
                    firstDate.value = selectedDate;
                    secondDate.value = "";
                    clickCount.value = 1;
                  }
                  isDaysCompare.value = clickCount.value === 2 ? 1 : 0;
                  showDetailTable.value = true;
                  fetchDailySalesSkuList(marketplaceName, storeId);
                },
              },
            },
          },
        },
        series: [
          {
            name: "Profit",
            data: newdailySalesData.map((item: any) => item.profit),
          },
          {
            name: "FBA Sales",
            data: newdailySalesData.map((item: any) => item.fbaAmount),
          },
          {
            name: "FBM Sales",
            data: newdailySalesData.map((item: any) => item.fbmAmount),
          },
        ],
      });
    }
    pageLoading.value = false;
  }
};

const prevPage = async () => {
  pageLoading.value = true;
  const userInfo = store.getters.getUserInfo;
  const marketplaceName = userInfo?.Data?.user?.store[0]?.marketplaceName;
  const storeId = userInfo?.Data?.user?.store[0]?.storeId;
  if (pageNumber.value > 1) {
    pageNumber.value--;
    await fetchDailySalesSkuList(marketplaceName, storeId);
    pageLoading.value = false;
  }
};

const nextPage = async () => {
  pageLoading.value = true;
  const userInfo = store.getters.getUserInfo;
  const marketplaceName = userInfo?.Data?.user?.store[0]?.marketplaceName;
  const storeId = userInfo?.Data?.user?.store[0]?.storeId;
  if (userInfo && marketplaceName) {
    pageNumber.value += 1;
    await fetchDailySalesSkuList(marketplaceName, storeId);
    pageLoading.value = false;
  }
};

onMounted(async () => {
  try {
    await store.dispatch("initializeAuth");
    await updateChart();
  } catch (error) {
    console.error("Initialization failed:", error);
  }
});

watch(selectedDay, async () => {
  await updateChart();
});
</script>
