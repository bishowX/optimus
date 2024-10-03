import type { Component } from "vue"
import TiptapImage from "@tiptap/extension-image"
import { VueNodeViewRenderer } from "@tiptap/vue-3"
import { Plugin } from "prosemirror-state"

import ImageRenderer from "./image-renderer.vue"

export const Image = TiptapImage.extend({
    addProseMirrorPlugins() {
        return [
            new Plugin({
                props: {
                    handleDrop(view, event, slice, moved) {
                        const filesCount =
                            event.dataTransfer &&
                            event.dataTransfer.files &&
                            event.dataTransfer.files.length
                        if (moved || !filesCount) return

                        const images = Array.from(event.dataTransfer.files).filter((file) =>
                            /image/i.test(file.type),
                        )

                        if (images.length === 0) {
                            return
                        }

                        event.preventDefault()

                        const { schema } = view.state
                        const coordinates = view.posAtCoords({
                            left: event.clientX,
                            top: event.clientY,
                        })

                        if (!coordinates) return

                        images.forEach((image) => {
                            const reader = new FileReader()

                            reader.onload = (readerEvent) => {
                                const node = schema.nodes.image.create({
                                    src: readerEvent.target?.result,
                                })

                                const transaction = view.state.tr.insert(coordinates.pos, node)
                                view.dispatch(transaction)
                            }
                            reader.readAsDataURL(image)
                        })
                    },
                    handleDOMEvents: {
                        paste(view, event) {
                            const hasFiles =
                                event.clipboardData &&
                                event.clipboardData.files &&
                                event.clipboardData.files.length

                            if (!hasFiles) {
                                return
                            }

                            const images = Array.from(event.clipboardData.files).filter((file) =>
                                /image/i.test(file.type),
                            )

                            if (images.length === 0) {
                                return
                            }

                            event.preventDefault()

                            const { schema } = view.state

                            images.forEach((image) => {
                                const reader = new FileReader()

                                reader.onload = (readerEvent) => {
                                    const node = schema.nodes.image.create({
                                        src: readerEvent.target?.result,
                                    })
                                    const transaction = view.state.tr.replaceSelectionWith(node)
                                    view.dispatch(transaction)
                                }
                                reader.readAsDataURL(image)
                            })
                        },
                    },
                },
            }),
        ]
    },
    addAttributes() {
        return {
            ...this.parent?.(),
            src: {
                default: "",
                renderHTML: ({ src }) => ({ src }),
            },
            width: {
                default: 300,
                renderHTML: ({ width }) => ({ width }),
            },

            height: {
                default: 200,
                renderHTML: ({ height }) => ({ height }),
            },

            isDraggable: {
                default: true,
                renderHTML: (attributes) => {
                    return {}
                },
            },
        }
    },
    addNodeView() {
        return VueNodeViewRenderer(ImageRenderer as Component)
    },
})
