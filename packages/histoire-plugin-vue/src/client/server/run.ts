import { createApp, h } from 'vue'
import { registerVueComponents } from '@histoire/controls'
import type { ServerRunPayload } from '@histoire/shared'
import Story from './Story.vue'
import Variant from './Variant.vue'

export async function run ({ file, storyData, el }: ServerRunPayload) {
  const { default: Comp } = await import(file.moduleId)

  const app = createApp({
    provide: {
      addStory (data) {
        storyData.push(data)
      },
    },
    render () {
      return h(Comp, {
        ref: 'comp',
        data: file,
      })
    },
  })

  // eslint-disable-next-line vue/multi-word-component-names
  app.component('Story', Story)
  // eslint-disable-next-line vue/multi-word-component-names
  app.component('Variant', Variant)

  registerVueComponents(app)

  app.mount(el)

  if (Comp.doc) {
    const el = document.createElement('div')
    el.innerHTML = Comp.doc
    const text = el.textContent
    storyData.forEach(s => {
      s.docsText = text
    })
  }

  app.unmount()
}
