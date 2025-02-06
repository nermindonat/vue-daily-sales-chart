<template>
  <label :for="id" class="block mb-1 text-sm font-medium text-gray-900">
    <slot />
    <span v-if="required" class="ml-1 text-red-600">*</span>
  </label>
</template>

<script lang="ts" setup>
export interface IProps {
  id: string;
  required?: boolean;
}

defineProps<IProps>();
</script>
