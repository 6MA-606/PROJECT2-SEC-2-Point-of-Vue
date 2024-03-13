<script setup>
import Logo from '@/components/Logo.vue'
import { ref, watch } from 'vue'
import { useToastStore } from '@/stores/toast'
import { isEmailExist, isUsernameExist, register } from '../../libs/auth';
import { useRouter } from 'vue-router'

const toastStore = useToastStore()
const router = useRouter()

const errorMsg = ref('')
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

const handleSubmitRegister = async () => {
  if (await isUsernameExist(username.value)) {
    errorMsg.value = 'Username already exists'
    return
  }

  if (await isEmailExist(email.value)) {
    errorMsg.value = 'Email already exists'
    return
  }

  if (password.value !== confirmPassword.value) return
  
  errorMsg.value = ''
  isLoading.value = true
  const res = await register(username.value, email.value, password.value)
  if (res) {
    isLoading.value = false
    router.replace('/login')
    toastStore.msg = 'Register success'
  }
}

watch([password, confirmPassword], () => {
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Password and Confirm Password must match'
  } else {
    errorMsg.value = ''
  }
})

</script>

<template>
  <main class="w-full h-screen grid place-items-center">
    <form @submit.prevent="handleSubmitRegister" class=" w-96 flex flex-col">
      <div>
        <div class="text-primary mb-4">
          <Logo size="4rem" color="currentColor" />
        </div>
        <p class="text-2xl mb-2">Sign up for Plannet</p>
        <p>Welcome to a workspace that's secure, powerful, and totally private.</p>
      </div>
      <div class="flex flex-col gap-5 mt-6 mb-4">
        <div v-show="errorMsg" class="text-error">{{ errorMsg }}</div>
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          autocomplete="username"
          title="Username"
          autofocus
          required
          class="input bg-neutral rounded-xl w-96"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Email" 
          autocomplete="email"
          title="Email"
          required
          class="input bg-neutral rounded-xl w-96">
        <input
          v-model="password"
          type="password"
          placeholder="Password" 
          autocomplete="new-password"
          title="Password"
          required
          class="input bg-neutral rounded-xl w-full"
        />
        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm password" 
          autocomplete="new-password"
          title="Confirm password"
          required
          class="input bg-neutral rounded-xl w-full"
        />
        <button type="submit" class="btn rounded-full btn-accent text-base-100">Sign up</button>
      </div>
      <div>
        <p>Do you have an account? <RouterLink to="/login" class="text-primary">Login</RouterLink></p>
      </div>
    </form>
  </main>
</template>