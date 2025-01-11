<script setup>
import InputLabel from "@/Components/InputLabel.vue";
import TextInput from "@/Components/TextInput.vue";

defineProps({
    on: Boolean,
});
</script>

<template>
    <div class="side__menu bg-white shadow rounded-lg min-w-300 h-full flex-1 w-fit px-4 pt-2">
        <InputLabel label="Введите ссылку на приглашение">
            <TextInput/>
        </InputLabel>
    </div>
</template>
