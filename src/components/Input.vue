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
    <div
      v-if="type === 'password' && progress && isPasswordFocused"
      class="mt-5"
    >
      <div class="w-full h-2 rounded bg-gray-300">
        <div
          class="h-2 rounded transition-all duration-300"
          :class="progressBarColor"
          :style="{ width: progressBarWidth }"
        ></div>
      </div>
      <div class="flex items-center justify-between">
        <p class="text-sm mt-1" :class="progressTextColor">
          {{ passwordStrengthText }}
        </p>
        <div class="relative group">
          <Icon
            icon="material-symbols:info-outline"
            width="1.2em"
            height="1.2em"
          />
          <div
            class="absolute hidden group-hover:block text-sm bg-white text-black p-2 rounded-md mt-1 w-64 border border-gray-400 z-10"
          >
            Şifreniz en az 8 karakterden oluşmalı, bir büyük harf, bir rakam ve
            bir özel karakter içermelidir.
          </div>
        </div>
      </div>
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
  progress?: boolean;
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

const passwordStrength = computed(() => {
  if (!value.value || typeof value.value !== "string") return 0;
  let strength = 0;

  if (value.value.length >= 8) strength++;
  if (/[a-z]/.test(value.value)) strength++;
  if (/[A-Z]/.test(value.value)) strength++;
  if (/[0-9]/.test(value.value)) strength++;
  if (/[^a-zA-Z0-9]/.test(value.value)) strength++;

  return strength;
});

const progressBarColor = computed(() => {
  switch (passwordStrength.value) {
    case 1:
      return "bg-red-500";
    case 2:
      return "bg-orange-500";
    case 3:
      return "bg-yellow-500";
    case 4:
      return "bg-blue-500";
    case 5:
      return "bg-green-500";
    default:
      return "bg-gray-300";
  }
});

const progressBarWidth = computed(
  () => `${(passwordStrength.value / 5) * 100}%`
);

const passwordStrengthText = computed(() => {
  switch (passwordStrength.value) {
    case 1:
      return "Zayıf Şifre";
    case 2:
      return "Zayıf Şifre";
    case 3:
      return "Orta Şifre";
    case 4:
      return "İyi Şifre";
    case 5:
      return "Güçlü Şifre";
    default:
      return "Şifre Girin";
  }
});

const progressTextColor = computed(() => {
  switch (passwordStrength.value) {
    case 1:
      return "text-red-500";
    case 2:
      return "text-yellow-500";
    case 3:
      return "text-blue-500";
    case 4:
      return "text-green-500";
    default:
      return "text-gray-500";
  }
});
</script>
