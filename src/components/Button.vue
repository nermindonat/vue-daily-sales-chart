<template>
  <button
    :type="type"
    class="font-medium rounded-lg text-sm px-4 py-2.5 whitespace-nowrap ml-0 mt-2 flex justify-center items-center gap-1.5"
    :class="{
      '!bg-blue-400 !cursor-not-allowed': disabled || loading,
      'text-black bg-blue-300 hover:bg-blue-400 focus:ring-2 focus:ring-blue-300':
        variant === 'primary',
    }"
    :disabled="disabled || loading"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts" setup>
export interface IProps {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary";
}

withDefaults(defineProps<IProps>(), {
  type: "button",
  disabled: false,
  loading: false,
  variant: "primary",
});

defineEmits(["click"]);
</script>
