<script setup lang="ts">
import { ref, onMounted } from "vue";

const STORAGE_KEY = "fexapi.docs.packageManager";
const PACKAGE_MANAGERS = ["npm", "pnpm", "bun", "yarn"] as const;

const props = withDefaults(
  defineProps<{
    variant?: "sidebar" | "mobile";
  }>(),
  {
    variant: "sidebar",
  },
);

type PackageManager = (typeof PACKAGE_MANAGERS)[number];

const COMMAND_PREVIEW: Record<PackageManager, string> = {
  npm: "npx fexapi@latest init",
  pnpm: "pnpm dlx fexapi@latest init",
  bun: "bunx fexapi@latest init",
  yarn: "yarn dlx fexapi@latest init",
};

function normalizePackageManager(value: string | null): PackageManager {
  if (value && PACKAGE_MANAGERS.includes(value as PackageManager)) {
    return value as PackageManager;
  }

  return "npm";
}

const selected = ref<PackageManager>("npm");
const showPopup = ref(false);

onMounted(() => {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  selected.value = normalizePackageManager(stored);
  showPopup.value = !stored;
});

function setPreference(value: PackageManager) {
  const normalized = normalizePackageManager(value);
  selected.value = normalized;
  window.localStorage.setItem(STORAGE_KEY, normalized);
  window.dispatchEvent(new Event("fexapi:package-manager-change"));
}

function onSelect(pm: PackageManager) {
  setPreference(pm);
}

function onPopupSelect(pm: PackageManager) {
  setPreference(pm);
}

function applyPopupSelection() {
  setPreference(selected.value);
  showPopup.value = false;
}
</script>

<template>
  <div
    class="pm-preference"
    :class="[
      variant === 'mobile' ? 'pm-preference--mobile' : 'pm-preference--sidebar',
    ]"
  >
    <div class="pm-preference__header">
      <p class="pm-preference__title">Examples use</p>
      <button
        type="button"
        class="pm-preference__help"
        @click="showPopup = true"
      >
        Why?
      </button>
    </div>

    <div class="pm-preference__chips" role="group" aria-label="Package manager">
      <button
        v-for="pm in PACKAGE_MANAGERS"
        :key="pm"
        type="button"
        class="pm-preference__chip"
        :class="{ 'pm-preference__chip--active': selected === pm }"
        :aria-pressed="selected === pm"
        @click="onSelect(pm)"
      >
        {{ pm }}
      </button>
    </div>

    <div
      v-if="showPopup"
      class="pm-popup-backdrop"
      @click.self="showPopup = false"
    >
      <div
        class="pm-popup"
        role="dialog"
        aria-modal="true"
        aria-label="Select package manager"
      >
        <button
          type="button"
          class="pm-popup__x"
          aria-label="Close package manager setup"
          @click="showPopup = false"
        >
          ×
        </button>

        <p class="pm-popup__eyebrow">Setup Assistant</p>
        <h3 class="pm-popup__title">Package manager preference</h3>
        <p class="pm-popup__text">
          Pick one once. Docs commands and tabs stay aligned with how you run
          and start your app.
        </p>

        <div
          class="pm-popup__options"
          role="group"
          aria-label="Pick package manager"
        >
          <button
            v-for="pm in PACKAGE_MANAGERS"
            :key="`popup-${pm}`"
            type="button"
            class="pm-popup__option"
            :class="{ 'pm-popup__option--active': selected === pm }"
            @click="onPopupSelect(pm)"
          >
            {{ pm }}
          </button>
        </div>

        <p class="pm-popup__preview">
          Example: {{ COMMAND_PREVIEW[selected] }}
        </p>

        <div class="pm-popup__footer">
          <span class="pm-popup__step">1 of 1</span>
          <div class="pm-popup__actions">
            <button
              type="button"
              class="pm-popup__secondary"
              @click="showPopup = false"
            >
              Skip
            </button>
            <button
              type="button"
              class="pm-popup__primary"
              @click="applyPopupSelection"
            >
              Use {{ selected }} ->
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
