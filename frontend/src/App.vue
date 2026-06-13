<template>
  <v-app>
    <v-navigation-drawer v-if="isLoggedIn" v-model="drawer" app>
      <v-list>
        <v-list-item to="/patients" prepend-icon="mdi-account-group" title="Patients"></v-list-item>
        <v-list-item to="/users" prepend-icon="mdi-account-cog" title="User Management"></v-list-item>
        <v-list-item to="/roles" prepend-icon="mdi-shield-lock" title="Roles & Permissions"></v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="error" @click="logout">Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar v-if="isLoggedIn" app color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>DRMS Philippines</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

const drawer = ref(true)
const isLoggedIn = ref(false)
const router = useRouter()

watchEffect(() => {
  isLoggedIn.value = !!localStorage.getItem('token')
})

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  isLoggedIn.value = false
  router.push('/login')
}
</script>
