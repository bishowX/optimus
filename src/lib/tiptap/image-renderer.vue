<template>
    <node-view-wrapper as="span" @click="setActive" class="tiptap-custom-image-container">
        <vue-draggable-resizable
            :w="width"
            :h="height"
            @resize-end="onResize"
            :draggable="false"
            :lock-aspect-ratio="true"
            v-model:active="isActive"
            class="custom-resizable"
        >
            <div
                :style="`background-image:url('${src}');background-size:cover;background-repeat:no-repeat;position:absolute;top:0;left:0;right:0;bottom:0;`"
            ></div>
        </vue-draggable-resizable>
    </node-view-wrapper>
</template>

<script setup lang="ts">
import { ref, computed } from "vue"
import { NodeViewWrapper, nodeViewProps } from "@tiptap/vue-3"
import VueDraggableResizable from "vue3-draggable-resizable"
import "vue3-draggable-resizable/dist/Vue3DraggableResizable.css"

const props = defineProps(nodeViewProps)

const isActive = ref(false)

const src = computed({
    get: () => props.node.attrs.src,
    set: (newSrc: string) => props.updateAttributes({ src: newSrc }),
})

const width = computed({
    get: () => parseInt(props.node.attrs.width),
    set: (newWidth: number) => props.updateAttributes({ width: newWidth }),
})

const height = computed({
    get: () => parseInt(props.node.attrs.height),
    set: (newHeight: number) => props.updateAttributes({ height: newHeight }),
})

const onResize = ({ w, h }: { w: number; h: number }) => {
    width.value = w
    height.value = h
}

const setActive = () => {
    isActive.value = true
}
</script>
<style>
.tiptap-custom-image-container > div {
    position: relative;
    left: 0 !important;
    top: 0 !important;
}

.custom-resizable .vdr-handle {
    width: 10px !important;
    height: 10px !important;
    border-radius: 50% !important;
    background-color: #ffffff !important;
    border: 2px solid #3b82f6 !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
    transition: all 0.2s ease !important;
}

.custom-resizable .vdr-handle:hover {
    transform: scale(1.2) !important;
    background-color: #3b82f6 !important;
}

.custom-resizable .vdr-handle-br {
    bottom: -5px !important;
    right: -5px !important;
}

.custom-resizable .vdr-handle-tl {
    top: -5px !important;
    left: -5px !important;
}

.custom-resizable .vdr-handle-tr {
    top: -5px !important;
    right: -5px !important;
}

.custom-resizable .vdr-handle-bl {
    bottom: -5px !important;
    left: -5px !important;
}
</style>
