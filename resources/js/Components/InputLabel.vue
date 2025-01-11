<script setup>
defineProps({
    value: String,
    label: String,
});
</script>

<template>
    <label class="block font-medium text-sm text-gray-700 dark:text-red-300 flex flex-col gap-2">
        {{ label }}
        <span v-if="value">{{ value }}</span>
        <span v-else><slot/></span>
    </label>
</template>
