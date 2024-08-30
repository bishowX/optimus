import { mergeAttributes, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'

import Component from './component.vue'

export const LineChart = Node.create({
  name: 'LineChart',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      data: {
        default: [],
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'line-chart',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['line-chart', mergeAttributes({...HTMLAttributes, data: JSON.stringify(HTMLAttributes.data, undefined, 2)})]
  },

  addNodeView() {
    return VueNodeViewRenderer(Component)
  },
})