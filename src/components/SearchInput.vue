<template>
  <div class="relative w-[300px]">
    <div class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
      <span class="text-xl cursor-pointer material-symbols-rounded">
        <Icon icon="tabler:search" />
      </span>
    </div>
    <input
      type="text"
      class="w-full pl-10 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-full focus:border-[#f27a1a] focus:ring-1 focus:ring-[#f27a1a] focus:outline-none block p-2.5"
      :placeholder="placeholder ? placeholder : 'Search ...'"
      required
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
  </div>
</template>

<script lang="ts" setup>
import { Icon } from "@iconify/vue";
export interface IProps {
  modelValue: string;
  placeholder?: string;
}

defineProps<IProps>();

defineEmits(["update:modelValue"]);
</script>
