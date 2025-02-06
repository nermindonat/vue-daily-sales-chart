<template>
  <div :class="wrapperClass">
    <Label :id="name" v-if="label" :required="required">{{ label }}</Label>
    <div class="relative">
      <input
        :id="name"
        :name="name"
        :type="isVisible ? 'text' : type"
        class="block w-full p-2 h-[40px] text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50"
        :placeholder="placeholder"
        v-model="value"
        :disabled="disabled"
        @focus="handleFocus"
      />
      <span
        v-if="errorMessage"
        :class="[
          'text-red-400 text-[11px] pt-[2px] font-roboto absolute top-full',
        ]"
      >
        {{ errorMessage }}
      </span>
      <slot></slot>
      <span
        v-if="type === 'password'"
        class="absolute text-gray-400 -translate-y-1/2 cursor-pointer select-none right-3 top-1/2"
        @click.stop="isVisible = !isVisible"
      >
        <Icon
          :icon="
            isVisible
              ? 'material-symbols:visibility'
              : 'material-symbols:visibility-off'
          "
          class="w-5 h-5"
        />
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useField } from "vee-validate";
import { computed, ref, type HTMLAttributes } from "vue";
import Label from "./Label.vue";
import { Icon } from "@iconify/vue";

export interface IProps {
  label?: string;
  name: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "tel";
  disabled?: boolean;
  errorMessage?: string;
  required?: boolean;
  wrapperClass?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<IProps>(), {
  type: "text",
  size: "sm",
  disabled: false,
  progress: false,
});

const { errorMessage: vError, value } = useField(() => props.name, undefined, {
  validateOnValueUpdate: true,
  syncVModel: true,
});
const errorMessage = computed(() => props.errorMessage ?? vError.value);

const isVisible = ref(false);
const isPasswordFocused = ref(false);

const handleFocus = () => {
  if (props.type === "password") {
    isPasswordFocused.value = true;
  }
};
</script>
