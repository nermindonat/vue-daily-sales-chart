<template>
  <div class="w-[400px] justify-center mx-auto mt-10">
    <div class="flex flex-col items-center">
      <h2 class="text-lg font-semibold">Hello,</h2>
      <span>Log in to your account!</span>
    </div>
    <div class="mt-5 p-5 border border-gray-200 rounded">
      <h2 class="flex items-center justify-center text-lg font-semibold mb-4">
        Login
      </h2>
      <form @submit.prevent="submitHandler">
        <div
          v-if="showErrorMessage"
          class="text-[#d0021b] leading-[15px] p-[14px_20px_13px] mb-4 flex items-center border border-[#817274] rounded-sm bg-[#fff4f6]"
        >
          Your email address or password is incorrect.
        </div>
        <div class="grid w-full grid-cols-1 md:grid-cols-1 gap-4">
          <Input
            name="email"
            label="Email"
            v-model="email"
            :errorMessage="emailError"
            placeholder="Email Address"
            required
          />
          <Input
            type="password"
            name="password"
            label="Password"
            v-model="password"
            :errorMmessage="passwordError"
            placeholder="Password"
            required
          />
          <Button type="submit">Login</Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as yup from "yup";
import Input from "../../components/Input.vue";
import Button from "../../components/Button.vue";
import { useField, useForm } from "vee-validate";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import { ref } from "vue";
const store = useStore();
const router = useRouter();

const showErrorMessage = ref(false);

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid e-mail address")
    .required("Email field is required"),
  password: yup.string().required("Password field is required"),
});

const form = useForm({ validationSchema });
const { value: email, errorMessage: emailError } = useField("email");
const { value: password, errorMessage: passwordError } = useField("password");

const submitHandler = form.handleSubmit(async (values) => {
  try {
    showErrorMessage.value = false;
    await store.dispatch("login", values);
    await store.dispatch("fetchUserInformation", values.email);
    router.push("/daily-sales-chart");
  } catch (error) {
    showErrorMessage.value = true;
    console.error("An error occurred while logging in.", error);
  }
});
</script>
