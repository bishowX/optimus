<script setup lang="ts">
import { LineChart } from "@/components/ui/chart-line"
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/vue-3"

const props = defineProps<NodeViewProps>()

const data = props.node.attrs.data

console.log(props.node)
</script>

<template>
    <NodeViewWrapper>
        <LineChart
            :data="data"
            index="year"
            show-tooltip
            :categories="['Export Growth Rate', 'Import Growth Rate']"
            :y-formatter="
                (tick, i) => {
                    return typeof tick === 'number'
                        ? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
                        : ''
                }
            "
        />
    </NodeViewWrapper>
</template>
