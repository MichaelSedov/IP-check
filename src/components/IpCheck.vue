<template>
  <div class="ip-check">
    <h2 class="ip-check__title">IP Lookup</h2>
    <div class="ip-check__content">
      <div class="ip-check__description">Enter one or more IP addresses and get their country</div>
      <button class="btn" @click="addIpRow">+ Add</button>
      <div class="ip-list">
        <div v-for="(ip, index) in ipList" :key="index" class="ip-list__item">
          <label class="ip-list__label" :for="'ip-' + index"> {{ index + 1 }}</label>
          <input
            :id="'ip-' + index"
            v-model="ip.address"
            @blur="fetchLocation(ip)"
            :disabled="ip.loading"
            class="ip-check__input input"
            type="text"
            placeholder="Enter IP address"
          />
          <div v-if="ip.loading" class="ip-list__loading"></div>
          <div v-if="ip.error" class="ip-list__error">{{ ip.error }}</div>
          <div v-if="ip.location && !ip.error" class="ip-list__location">
            <img v-if="ip.countryCode" :src="`https://flagcdn.com/20x15/${ip.countryCode.toLowerCase()}.png`" alt="Country flag" />
            {{ ip.location }} {{ ip.localTime }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, onBeforeUnmount, reactive } from "vue";
  import { fetchIpData } from "@/api/ipService";
  import { IpRow } from "@/types/Ip";
  import './IpCheck.scss';
import { validateIp } from "@/utils";

  export default defineComponent({
    name: "IpCheck",
    setup() {
      const ipList = reactive<IpRow[]>([]);

      const addIpRow = () => {
        ipList.push({
          address: "",
          loading: false,
          location: null,
          localTime: null,
          countryCode: null,
          error: null,
          intervalId: null,
        });
      };

      const fetchLocation = async (ip: IpRow) => {
        if (ip.address.length === 0) {
          return;
        }

        ip.location = null;
        ip.localTime = null;
        ip.countryCode = null;
        ip.error = null;

        if (ip.intervalId !== null) {
          clearInterval(ip.intervalId);
        }

        if (!validateIp(ip.address) && ip.address.length > 0) {
          ip.error = "Invalid IP address";
          return;
        }

        ip.loading = true;

        try {
          const data = await fetchIpData(ip.address);
          ip.location = data.location;
          ip.countryCode = data.countryCode;

          ip.intervalId = window.setInterval(() => {
            const currentTime = new Date().toLocaleTimeString("en-US", {
              timeZone: data.timezone,
              hour12: false, // 24 hour format
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
            ip.localTime = currentTime;
          }, 1000);
        } catch (err) {
          ip.error = "Failed to fetch location";
        } finally {
          ip.loading = false;
        }
      };

      onBeforeUnmount(() => {
        ipList.forEach(ip => {
          if (ip.intervalId !== null) {
            clearInterval(ip.intervalId);
          }
        });
      });

      return { ipList, addIpRow, fetchLocation };
    },
  });
</script>
