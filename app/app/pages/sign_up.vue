<template>
<div class="auth-page">
  <div class="auth-card">
    <img src="/logo.png" alt="logo" class="auth-logo" />

    <h2 class="auth-title">
      {{ isSigningUp ? 'Create Your Magical Account' : 'Welcome Back' }}
    </h2>

    <form @submit.prevent="isSigningUp ? handleSignUp() : handleSignIn()">
      <input
        v-if="isSigningUp"
        v-model="form.username"
        type="text"
        placeholder="Choose a magical name"
        required
      />

      <input
        v-model="form.email"
        type="email"
        placeholder="Magic Mail"
        required
      />

      <input
        v-model="form.password"
        type="password"
        placeholder="Secret Password"
        required
      />

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">
        {{ isSigningUp ? 'Account created!' : 'Signed in!' }}
      </p>

      <button type="submit" class="submit-btn">
        {{ loading ? 'Loading...' : (isSigningUp ? 'Sign Up' : 'Sign In') }}
      </button>
    </form>

    <p class="switch-text">
      {{ isSigningUp ? 'Already have an account?' : "Don't have an account?" }}

      <button type="button" class="switch-btn" @click="toggleMode">
        {{ isSigningUp ? 'Sign In' : 'Sign Up' }}
      </button>
    </p>
  </div>
</div>
</template>

<script setup lang="ts">
import { isAuthApiError } from "@supabase/supabase-js";
import { reactive, ref } from "vue";
import { supabase } from "#imports";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  username: "",
  email: "",
  password: "",
});

const loading = ref(false);
const error = ref("");
const success = ref(false);
const isSigningUp = ref(false);

async function handleSignUp() {
  loading.value = true;
  error.value = "";
  success.value = false;

  try {
    if (!form.username.trim()) {
      throw new Error("Username is required");
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email: form.email,
        password: form.password,
      },
    );

    if (signUpError) {
      console.error("Sign up error:", signUpError);
      throw signUpError;
    }

    if (!signUpData.user) {
      throw new Error("Sign up failed: no user returned");
    }

    const { error: insertError } = await supabase.from("users").insert({
      id: signUpData.user!.id,
      username: form.username,
      email: form.email,
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      throw insertError;
    }

    success.value = true;
    error.value = "";
    clearForm();
  } catch (err) {
    error.value = isAuthApiError(err) ? err.message : (err as Error).message;
    console.error(err);
  } finally {
    loading.value = false;
  }
}

async function handleSignIn() {
  loading.value = true;
  error.value = "";
  success.value = false;

  try {
    const { data: signInData, error: signInError } =
      await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

    if (signInError) {
      throw signInError;
    }

    success.value = true;

    // Redirect to profile page
    await router.push("/user_account");

    clearForm();
  } catch (err) {
    error.value = isAuthApiError(err)
      ? err.message
      : (err as Error).message;
  } finally {
    loading.value = false;
  }
}

function clearForm() {
  form.username = "";
  form.email = "";
  form.password = "";
}

function toggleMode() {
  isSigningUp.value = !isSigningUp.value;
  error.value = "";
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("/bg0.png");
  background-size: cover;
  background-position: center;
}

.auth-card {
  width: min(90%, 450px);
  padding: 2.5rem;
  border-radius: 24px;

  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(10px);

  border: 2px solid rgba(200, 149, 58, 0.35);

  box-shadow:
    0 0 30px rgba(143, 51, 94, 0.3),
    0 0 60px rgba(143, 51, 94, 0.15);

  animation: fadeUp 0.8s ease;
}

.auth-logo {
  width: 120px;
  display: block;
  margin: 0 auto 1rem;
  animation: float 4s ease-in-out infinite;
}

.auth-title {
  font-family: var(--candy);
  color: #8f335e;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;

  text-shadow:
    0 2px 4px rgba(107, 30, 78, 0.6),
    0 0 15px rgba(143, 51, 94, 0.4);
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  font-family: var(--sans);
  padding: 0.9rem 1rem;

  border-radius: 12px;
  border: 2px solid rgba(200, 149, 58, 0.25);

  background: rgba(255, 255, 255, 0.4);
  color: var(--text);

  transition: all 0.25s ease;
}

input::placeholder {
  color: rgba(36, 54, 80, 0.6);
}

input:focus {
  outline: none;
  border-color: var(--gold);

  box-shadow:
    0 0 12px rgba(200, 149, 58, 0.4);
}

.submit-btn {
  margin-top: 1rem;

  font-family: var(--sans);
  font-weight: 600;

  padding: 0.9rem;
  border: none;
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.5);
  color: var(--navy2);

  cursor: pointer;

  transition: all 0.2s ease;

  animation: borderGlow 2.5s ease-in-out infinite;
}

.submit-btn:hover {
  background: var(--coral);
  color: var(--gold);
  transform: scale(1.04);
}

.switch-text {
  margin-top: 1.5rem;
  text-align: center;

  font-family: var(--sans);
  color: var(--navy3);
}

.switch-btn {
  border: none;
  background: none;

  color: #8f335e;
  font-weight: 600;
  cursor: pointer;

  margin-left: 0.4rem;
}

.switch-btn:hover {
  color: var(--gold);
}

.error {
  text-align: center;
  color: var(--red);
  font-family: var(--sans);
}

.success {
  text-align: center;
  color: var(--green);
  font-family: var(--sans);
}
</style>