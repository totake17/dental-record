<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Clinical Workspace: {{ patientName }}</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-row>
              <!-- Left Side: Procedure Selection -->
              <v-col cols="12" md="6">
                <h3>Select Procedures</h3>
                <v-list lines="two" style="max-height: 400px; overflow-y: auto;">
                  <v-list-item
                    v-for="proc in catalog"
                    :key="proc.id"
                    :title="proc.name"
                    :subtitle="'PHP ' + proc.base_price"
                    @click="addProcedure(proc)"
                  >
                    <template v-slot:append>
                      <v-btn icon="mdi-plus" variant="text" color="primary"></v-btn>
                    </template>
                  </v-list-item>
                </v-list>
              </v-col>

              <!-- Right Side: Current Visit Details -->
              <v-col cols="12" md="6">
                <h3>Current Visit</h3>
                <v-chip-group column>
                  <v-chip
                    v-for="(p, index) in selectedProcedures"
                    :key="index"
                    closable
                    @click:close="removeProcedure(index)"
                  >
                    {{ p.name }} ({{ p.base_price }})
                  </v-chip>
                </v-chip-group>

                <v-textarea
                  v-model="clinicalNotes"
                  label="Clinical Findings / Notes"
                  class="mt-4"
                  outlined
                ></v-textarea>

                <div class="d-flex justify-space-between align-center mt-4">
                  <div class="text-h6">Total: PHP {{ totalAmount }}</div>
                  <v-btn
                    color="success"
                    size="large"
                    :disabled="selectedProcedures.length === 0"
                    @click="saveVisit"
                    :loading="saving"
                  >
                    Save Visit & Deduct Inventory
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- History Section -->
      <v-col cols="12">
        <v-card class="mt-4">
          <v-card-title>Clinical History</v-card-title>
          <v-table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Procedure</th>
                <th>Dentist</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="h in history" :key="h.id">
                <td>{{ new Date(h.visit_date).toLocaleDateString('en-PH') }}</td>
                <td>{{ h.procedure_name }}</td>
                <td>{{ h.dentist_name }}</td>
                <td>{{ h.clinical_notes }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const route = useRoute()
const patientId = route.params.id
const patientName = ref('Loading...')
const catalog = ref([])
const history = ref([])
const selectedProcedures = ref([])
const clinicalNotes = ref('')
const saving = ref(false)

const totalAmount = computed(() => {
  return selectedProcedures.value.reduce((sum, p) => sum + parseFloat(p.base_price), 0)
})

const fetchInitialData = async () => {
  const [procs, hist, pat] = await Promise.all([
    axios.get('http://localhost:3000/api/treatments/procedures'),
    axios.get(`http://localhost:3000/api/treatments/history/${patientId}`),
    axios.get(`http://localhost:3000/api/patients/${patientId}`)
  ])
  catalog.value = procs.data
  history.value = hist.data
  patientName.value = `${pat.data.last_name}, ${pat.data.first_name}`
}

const addProcedure = (proc) => {
  selectedProcedures.value.push(proc)
}

const removeProcedure = (index) => {
  selectedProcedures.value.splice(index, 1)
}

const saveVisit = async () => {
  saving.value = true
  try {
    await axios.post('http://localhost:3000/api/treatments/record', {
      patient_id: patientId,
      procedures: selectedProcedures.value,
      clinical_notes: clinicalNotes.value
    })
    selectedProcedures.value = []
    clinicalNotes.value = ''
    fetchInitialData()
    alert('Treatment recorded successfully.')
  } catch (err) {
    alert('Error saving record: ' + (err.response?.data?.error || err.message))
  } finally {
    saving.value = false
  }
}

onMounted(fetchInitialData)
</script>
