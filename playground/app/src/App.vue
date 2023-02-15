<script setup lang="ts">
import now from '~build/time';
import { CInput } from '@onekuma/ui';

import { ref, watch } from 'vue';

import { useFunctions } from 'vite-plugin-cloudflare-functions/client';

const client = useFunctions();

const endpoint = ref('world');

const message = ref('');

const response = ref();

watch(
  endpoint,
  async (endpoint) => {
    client.raw.get('/api/' + endpoint).then((resp) => {
      response.value = resp;
      message.value = resp.data;
    });
  },
  { immediate: true }
);
</script>

<template>
  <div text-xl flex justify-center my8>
    <div space-y-4>
      <h1 text-2xl font-bold pb4 border="b-1 base">Vite Plugin Cloudflare Functions</h1>
      <div flex justify-start items-center>
        <span mr2 text-base-500>Endpoint:</span><span mr1 font-bold>/api/</span
        ><c-input type="text" id="endpoint" v-model="endpoint" name="" class="font-bold"
          ><template #label></template
        ></c-input>
      </div>
      <div>
        <span text-base-500>Message: </span><span font-bold>{{ message }}</span>
      </div>
      <div v-if="response">
        <span text-base-500>Response: </span>
        <pre>{{ JSON.stringify(response, null, 2) }}</pre>
      </div>
      <div text-base-500 border="t-1 base" pt4>Build at: {{ now.toLocaleString() }}</div>
    </div>
  </div>
</template>
