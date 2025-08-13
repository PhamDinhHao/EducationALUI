import type { Plugin, Editor, Component, Trait, ComponentDefinition } from 'grapesjs'
const draggableTextPlugin: Plugin = (editor: Editor) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // Define a custom trait type
  editor.TraitManager.addType('draggable-text', {
    events: {
      change: 'onChange'
    },
    createInput({ trait }: { trait: Trait }): HTMLInputElement {
      const el = document.createElement('input')
      el.type = 'checkbox'
      el.checked = !!trait.get('value')
      return el
    },
    onUpdate({ elInput, component }: { elInput: HTMLInputElement; component: Component }) {
      elInput.checked = !!component.get('draggable')
    },
    onEvent({ elInput, component }: { elInput: HTMLInputElement; component: Component }) {
      component.set('draggable', elInput.checked)
    }
  })

  editor.DomComponents.addType('text', {
    model: {
      defaults: {
        draggable: true,
        filenamePfx: 'ADD-template',
        traits: [
          {
            type: 'draggable-text',
            name: 'draggable',
            label: 'Draggable'
          }
        ]
      } as ComponentDefinition,
      init() {
        this.on('change:draggable', this.onDraggableChange)
        this.on('change:content', this.updateContent)
        this.onDraggableChange()
      },
      onDraggableChange() {
        const draggable = this.get('draggable')
        if (this.view?.el) {
          this.view.el.style.cursor = draggable ? 'move' : 'default'
        }
      }
    },
    view: {
      events() {
        return {
          mousedown: 'onMouseDown',
          dblclick: 'onDoubleClick'
        }
      },
      onMouseDown(this: Component['view'], e: MouseEvent) {
        if (!this) return
        if (!this.model.get('draggable')) return
        const el = this.el
        const parentEl = el.parentElement
        if (!parentEl) return
        const initialX = e.clientX - el.offsetLeft
        const initialY = e.clientY - el.offsetTop

        const onMouseMove = (e: MouseEvent) => {
          // el.style.position = 'absolute'
          const newX = e.clientX - initialX
          const newY = e.clientY - initialY

          const leftPercent = (newX / parentEl.offsetWidth) * 100
          const topPercent = (newY / parentEl.offsetHeight) * 100

          el.style.left = `${leftPercent}%`
          el.style.top = `${topPercent}%`
          const originalStyles = this.model.getStyle()
          this.model.setStyle({
            ...originalStyles,
            left: `${leftPercent}%`,
            top: `${topPercent}%`
          })
        }

        const onMouseUp = () => {
          document.removeEventListener('mousemove', onMouseMove)
          document.removeEventListener('mouseup', onMouseUp)
        }

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
      },
      onDoubleClick(this: Component['view'], e: MouseEvent) {
        if (!this) return
        const el = this.el
        el.contentEditable = 'true'
        el.focus()
        // Add blur event listener for when the user finishes editing
        el.addEventListener('blur', () => {
          const newContent = el.textContent?.trim() || 'Editable Text'
          this.model.components(newContent)
        })
        e.stopPropagation()
      }
    }
  })

  editor.TraitManager.addType('draggable-image', {
    events: {
      change: 'onChange'
    },
    createInput({ trait }: { trait: Trait }): HTMLInputElement {
      const el = document.createElement('input')
      el.type = 'checkbox'
      el.checked = !!trait.get('value')
      return el
    },
    onUpdate({ elInput, component }: { elInput: HTMLInputElement; component: Component }) {
      elInput.checked = !!component.get('draggable')
    },
    onEvent({ elInput, component }: { elInput: HTMLInputElement; component: Component }) {
      component.set('draggable', elInput.checked)
    }
  })

  editor.DomComponents.addType('image', {
    model: {
      defaults: {
        draggable: true,
        traits: [
          {
            type: 'draggable-image',
            name: 'draggable',
            label: 'Draggable'
          }
        ]
      } as ComponentDefinition,
      init() {
        this.on('change:draggable', this.onDraggableChange)
        this.on('change:content', this.updateContent)
        this.on('change:width', this.onSizeChange)
        this.on('change:height', this.onSizeChange)
        this.onDraggableChange()
      },
      onDraggableChange() {
        const draggable = this.get('draggable')
        if (this.view?.el) {
          this.view.el.style.cursor = draggable ? 'move' : 'default'
        }
      },
      onSizeChange() {
        const originalWidth: number = parseFloat(this.model.get('width') as string) || 0
        const originalHeight: number = parseFloat(this.model.get('height') as string) || 0
        this.set({
          width: originalWidth,
          height: originalHeight
        })
      }
    },
    view: {
      events() {
        return {
          mousedown: 'onMouseDown',
          dblclick: 'onDoubleClick'
        }
      },
      onMouseDown(this: Component['view'], e: MouseEvent) {
        if (!this) return
        if (!this.model.get('draggable')) return

        const el = this.el
        const parentEl = el.parentElement
        if (!parentEl) return

        const initialX = e.clientX - el.offsetLeft
        const initialY = e.clientY - el.offsetTop

        const onMouseMove = (e: MouseEvent) => {
          const originalStyles = this.model.getStyle()

          const newX = e.clientX - initialX
          const newY = e.clientY - initialY

          const leftPercent = (newX / parentEl.offsetWidth) * 100
          const topPercent = (newY / parentEl.offsetHeight) * 100

          // el.style.position = 'absolute'
          el.style.left = `${leftPercent}%`
          el.style.top = `${topPercent}%`

          this.model.setStyle({
            ...originalStyles,
            left: `${leftPercent}%`,
            top: `${topPercent}%`,
            width: originalStyles.width || 'auto',
            height: originalStyles.height || 'auto',
            // position: 'absolute',
            'z-index': '100'
          })
        }

        const onMouseUp = () => {
          document.removeEventListener('mousemove', onMouseMove)
          document.removeEventListener('mouseup', onMouseUp)
        }

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
      },
      onDoubleClick(this: Component['view']) {
        if (!this) return
        editor.runCommand('open-assets', {
          target: this.model,
          types: ['image'],
          accept: 'image/*',
          onSelect: (asset: any) => {
            this.model.set('src', asset.get('src'))

            this.el.style.position = 'absolute'
            const currentLeft: string = (this.model.get('left') as string) || '0'
            const currentTop: string = (this.model.get('top') as string) || '0'
            const originalWidth: number = parseFloat(this.model.get('width') as string) || 0
            const originalHeight: number = parseFloat(this.model.get('height') as string) || 0

            this.model.set({
              width: originalWidth,
              height: originalHeight,
              left: currentLeft,
              top: currentTop
            })
          }
        })
      }
    }
  })
}

export default draggableTextPlugin
