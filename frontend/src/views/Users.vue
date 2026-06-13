<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between">
        <h1>User Management</h1>
        <v-btn color="primary" @click="openDialog">Add User</v-btn>
      </v-col>
    </v-row>

    <v-card class="mt-4">
      <v-table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.full_name }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.role_name }}</td>
            <td>
              <v-chip :color="user.is_active ? 'success' : 'error'" size="small">
                {{ user.is_active ? 'Active' : 'Inactive' }}
              </v-chip>
            </td>
            <td>
              <v-btn icon size="small" @click="editUser(user)"><v-icon>mdi-pencil</v-icon></v-btn>
              <v-btn icon size="small" color="error" class="ml-2" @click="deleteUser(user.id)"><v-icon>mdi-delete</v-icon></v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>{{ editId ? 'Edit User' : 'New User' }}</v-card-title>
        <v-card-text>
          <v-text-field v-model="form.full_name" label="Full Name"></v-text-field>
          <v-text-field v-model="form.username" label="Username"></v-text-field>
          <v-text-field v-model="form.password" label="Password (leave blank if no change)" type="password"></v-text-field>
          <v-select
            v-model="form.role_id"
            :items="roles"
            item-title="name"
            item-value="id"
            label="Role"
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveUser">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])
const roles = ref([])
const dialog = ref(false)
const editId = ref(null)
const form = ref({ full_name: '', username: '', password: '', role_id: null })

const fetchData = async () => {
  const [u, r] = await Promise.all([
    axios.get('http://localhost:3000/api/users'),
    axios.get('http://localhost:3000/api/roles')
  ])
  users.value = u.data
  roles.value = r.data
}

const openDialog = () => {
  editId.value = null
  form.value = { full_name: '', username: '', password: '', role_id: null }
  dialog.value = true
}

const editUser = (user) => {
  editId.value = user.id
  form.value = { full_name: user.full_name, username: user.username, role_id: user.role_id }
  dialog.value = true
}

const saveUser = async () => {
  if (editId.value) {
    await axios.put(`http://localhost:3000/api/users/${editId.value}`, form.value)
  } else {
    await axios.post('http://localhost:3000/api/users', form.value)
  }
  dialog.value = false
  fetchData()
}

const deleteUser = async (id) => {
  if (confirm('Deactivate this user?')) {
    await axios.delete(`http://localhost:3000/api/users/${id}`)
    fetchData()
  }
}

onMounted(fetchData)
</script>
