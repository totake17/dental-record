<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between">
        <h1>Patient Management</h1>
        <v-btn color="primary" @click="dialog = true">Add Patient</v-btn>
      </v-col>
    </v-row>

    <v-card class="mt-4">
      <v-table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in patients" :key="p.id">
            <td>{{ p.last_name }}, {{ p.first_name }}</td>
            <td>{{ p.contact_number }}</td>
            <td>
              <v-btn icon size="small" color="primary" :to="'/clinical/' + p.id">
                <v-icon>mdi-stethoscope</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>New Patient</v-card-title>
        <v-card-text>
          <v-text-field v-model="form.first_name" label="First Name"></v-text-field>
          <v-text-field v-model="form.last_name" label="Last Name"></v-text-field>
          <v-text-field v-model="form.contact_number" label="Contact"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="savePatient">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const patients = ref([])
const dialog = ref(false)
const form = ref({ first_name: '', last_name: '', contact_number: '' })

const fetchPatients = async () => {
  const res = await axios.get('http://localhost:3000/api/patients')
  patients.value = res.data
}

const savePatient = async () => {
  await axios.post('http://localhost:3000/api/patients', form.value)
  dialog.value = false
  fetchPatients()
}

onMounted(fetchPatients)
</script>
