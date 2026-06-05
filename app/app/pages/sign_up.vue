<template>
    <div class="page">
        <h1 class="title">Sign Up</h1>
        <form @submit.prevent="handleSubmit" class="signUpForm">
            <input v-model="form.username" type="text" placeholder="Username" required>
            <input v-model="form.email" type="email" placeholder="Email Address" required>
            <input v-model="form.password" type="text" placeholder="Password" required>
            <button type="submit" class="signUpBtn" :disabled="loading">
                {{ loading ? 'Signing Up...' : 'Sign Up' }}
            </button>
            <p v-if="error" class="error">{{ error }}</p>
            <p v-if="success" class="success">Sign up successful!</p>
        </form>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const form = reactive({
    username: '',
    email: '',
    password: ''
});

const loading = ref(false);
const error = ref('');
const success = ref(false);

async function handleSubmit() {
    loading.value = true;
    error.value = '';
    success.value = false;

    try {
        // 1. Create auth user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
        });

        if (authError) throw authError;

        // 2. Insert user info into your 'users' table
        const { error: insertError } = await supabase
            .from('users')
            .insert([
                {
                    id: authData.user?.id, // Use auth user ID
                    username: form.username,
                    email: form.email,
                    created_at: new Date(),
                }
            ]);

        if (insertError) throw insertError;

        success.value = true;
        form.username = '';
        form.email = '';
        form.password = '';
        
        console.log('User signed up successfully:', authData.user);
    } catch (err) {
        error.value = err instanceof Error ? err.message : 'An error occurred';
        console.error('Sign up error:', err);
    } finally {
        loading.value = false;
    }
}
</script>

<style scoped>
.error {
    color: red;
    margin-top: 10px;
}
.success {
    color: green;
    margin-top: 10px;
}
</style>