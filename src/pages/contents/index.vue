<script setup lang="ts">
import { useStorage } from "@vueuse/core"
import type {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
} from "@tanstack/vue-table"
import {
    FlexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useVueTable,
} from "@tanstack/vue-table"
import { AlertCircle, ArrowUpDown, ChevronDown, LoaderCircle } from "lucide-vue-next"

import { computed, h, onMounted, ref, watch } from "vue"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { valueUpdater } from "@/lib/utils"
import type { Content } from "@/data/content"
import { useRoute, useRouter } from "vue-router"
import { api } from "@/lib/axios"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const columns: ColumnDef<Content>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => h("div", { class: "capitalize" }, row.getValue("title")),
    },
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})

const contents = ref<Content[]>([])

const table = useVueTable({
    get data() {
        return contents.value
    },
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
    onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
    onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
    onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelection),
    state: {
        get sorting() {
            return sorting.value
        },
        get columnFilters() {
            return columnFilters.value
        },
        get columnVisibility() {
            return columnVisibility.value
        },
        get rowSelection() {
            return rowSelection.value
        },
    },
})

const router = useRouter()

const onRowClick = (id: string) => {
    router.push(`/contents/preview/${id}`)
}

const loading = ref(false)
const error = ref("")
onMounted(async () => {
    try {
        error.value = ""
        loading.value = true
        const res = await api.get("/contents")

        contents.value = res.data
    } catch (e: any) {
        error.value = e?.message || "Something went wrong"
    } finally {
        loading.value = false
    }
})

const route = useRoute()

table.getColumn("title")?.setFilterValue(route.query.searchTerm || "")

watch(
    () => route.query.searchTerm,
    (n) => {
        console.log("query changed: ", n)

        table.getColumn("title")?.setFilterValue(n || "")
    },
)
</script>

<template>
    <div class="w-full">
        <div class="flex items-center gap-2 py-4">
            <div class="flex items-center gap-4">
                <Input
                    class="max-w-sm"
                    placeholder="Filter by title"
                    :model-value="table.getColumn('title')?.getFilterValue() as string"
                    @update:model-value="table.getColumn('title')?.setFilterValue($event)"
                />
                <LoaderCircle v-if="loading" class="h-8 w-8 animate-spin" />
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button variant="outline" class="ml-auto">
                        Columns <ChevronDown class="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuCheckboxItem
                        v-for="column in table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())"
                        :key="column.id"
                        class="capitalize"
                        :checked="column.getIsVisible()"
                        @update:checked="
                            (value) => {
                                column.toggleVisibility(!!value)
                            }
                        "
                    >
                        {{ column.id }}
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <div class="rounded-md border" v-if="!loading && contents.length">
            <Table>
                <TableHeader>
                    <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
                        <TableHead v-for="header in headerGroup.headers" :key="header.id">
                            <FlexRender
                                v-if="!header.isPlaceholder"
                                :render="header.column.columnDef.header"
                                :props="header.getContext()"
                            />
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <template v-if="table.getRowModel().rows?.length">
                        <TableRow
                            v-for="row in table.getRowModel().rows"
                            @click="() => onRowClick(row.original.id)"
                            :key="row.id"
                            :data-state="row.getIsSelected() && 'selected'"
                            class="cursor-pointer"
                        >
                            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                                <FlexRender
                                    :render="cell.column.columnDef.cell"
                                    :props="cell.getContext()"
                                />
                            </TableCell>
                        </TableRow>
                    </template>

                    <TableRow v-else>
                        <TableCell :colspan="columns.length" class="h-24 text-center">
                            No results.
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>

        <div
            v-if="!loading && contents.length"
            class="flex items-center justify-end space-x-2 py-4"
        >
            <div class="space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    :disabled="!table.getCanPreviousPage()"
                    @click="table.previousPage()"
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    :disabled="!table.getCanNextPage()"
                    @click="table.nextPage()"
                >
                    Next
                </Button>
            </div>
        </div>

        <Alert v-if="error" variant="destructive">
            <AlertCircle class="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                {{ error }}
            </AlertDescription>
        </Alert>
    </div>
</template>
