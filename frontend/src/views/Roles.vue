<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Role & Permissions Management</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="role in roles" :key="role.id" cols="12" md="6">
        <v-card>
          <v-card-title>{{ role.name }}</v-card-title>
          <v-card-subtitle>{{ role.description }}</v-card-subtitle>
          <v-card-text>
            <v-select
              v-model="role.permissions"
              :items="allPermissions"
              item-title="description"
              item-value="code"
              label="Permissions"
              multiple
              chips
            ></v-select>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" block @click="updateRole(role)">Update Permissions</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const roles = ref([])
const allPermissions = ref([])

const fetchData = async () => {
  const [r, p] = await Promise.all([
    axios.get('http://localhost:3000/api/roles'),
    axios.get('http://localhost:3000/api/roles/permissions')
  ])
  roles.value = r.data
  allPermissions.value = p.data
}

const updateRole = async (role) => {
  try {
    await axios.put(`http://localhost:3000/api/roles/${role.id}`, {
      permissions: role.permissions
    })
    alert('Role updated successfully')
  } catch (err) {
    alert('Error updating role')
  }
}

onMounted(fetchData)
</script>
