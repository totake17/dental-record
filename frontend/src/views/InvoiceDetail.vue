<template>
  <v-container>
    <v-card v-if="invoice" class="pa-8 mx-auto" max-width="800" elevation="0" id="printable-invoice">
      <div class="d-flex justify-space-between mb-8">
        <div>
          <h1 class="text-h4 font-weight-bold">DENTAL CLINIC</h1>
          <p>Local Network Address, Philippines</p>
          <p>Contact: +63 9XX XXX XXXX</p>
        </div>
        <div class="text-right">
          <h2 class="text-h5">INVOICE</h2>
          <p>#INV-{{ String(invoice.id).padStart(5, '0') }}</p>
          <p>Date: {{ new Date(invoice.invoice_date).toLocaleDateString('en-PH') }}</p>
        </div>
      </div>

      <v-divider class="mb-4"></v-divider>

      <v-row class="mb-8">
        <v-col cols="6">
          <p class="text-subtitle-1 font-weight-bold mb-0">BILL TO:</p>
          <p class="text-h6 mb-0">{{ decryptedName }}</p>
          <p v-if="invoice.philhealth_id">PhilHealth: {{ invoice.philhealth_id }}</p>
        </v-col>
        <v-col cols="6" class="text-right">
          <p class="text-subtitle-1 font-weight-bold mb-0">PAYMENT STATUS:</p>
          <v-chip :color="invoice.payment_status === 'paid' ? 'success' : 'error'">
            {{ invoice.payment_status.toUpperCase() }}
          </v-chip>
        </v-col>
      </v-row>

      <v-table class="mb-8 border">
        <thead>
          <tr>
            <th class="text-left">PROCEDURE</th>
            <th class="text-right">AMOUNT (PHP)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in invoice.items" :key="item.id">
            <td>{{ item.procedure_name }}</td>
            <td class="text-right">{{ parseFloat(item.amount).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td class="text-right font-weight-bold">TOTAL AMOUNT:</td>
            <td class="text-right font-weight-bold text-h6">PHP {{ parseFloat(invoice.total_amount).toLocaleString('en-PH', { minimumFractionDigits: 2 }) }}</td>
          </tr>
        </tfoot>
      </v-table>

      <div class="mt-12 text-center no-print">
        <v-btn color="primary" @click="printInvoice" prepend-icon="mdi-printer">Print A4 Invoice</v-btn>
      </div>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const invoice = ref(null)

const decryptedName = computed(() => {
  // In a real app, we'd handle decryption here if the backend sent encrypted data
  // For this demo, assuming backend route handles simple mapping
  return `${invoice.value.last_name}, ${invoice.value.first_name}`
})

const fetchInvoice = async () => {
  const res = await axios.get(`http://localhost:3000/api/billing/invoices/${route.params.id}`)
  invoice.value = res.data
}

const printInvoice = () => {
  window.print()
}

onMounted(fetchInvoice)
</script>

<style>
@media print {
  .no-print {
    display: none !important;
  }
  body {
    background: white !important;
  }
  #printable-invoice {
    width: 100% !important;
    max-width: none !important;
    padding: 0 !important;
  }
}
</style>
