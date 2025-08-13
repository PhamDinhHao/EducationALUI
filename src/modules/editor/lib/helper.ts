import $ from 'jquery'
import gjsPluginExport from 'grapesjs-plugin-export'
import gjsTuiImageEditor from 'grapesjs-tui-image-editor'
import { Component, grapesjs, type Editor } from 'grapesjs'

import { ja } from '@editor/configs/grapesjs/locales/ja'
import { panels, styleManager, deviceManager, selectorManager, blocks, traitManager, } from '@editor/configs/grapesjs'
import { addEditorCommand } from '@editor/configs/grapesjs/command'
import { createAsset, deleteAsset, getAssetsList } from '@/modules/editor/Service/asset.service'
import toast from 'react-hot-toast'

export const getPfx = (editor: Editor) => editor.getConfig().stylePrefix

export const getHTML = (editor: Editor): string => {
  const htmlContent = editor.getHtml()
  const cssContent = editor.getCss()
  const components = editor.Components.getComponents()
  
  const attributes: Record<string, any>[] = []
  components.forEach((component: Component) => {
    const attrs = component.getAttributes()
    if (Object.keys(attrs).length > 0) {
      attributes.push({
        id: component.getId(),
        type: component.get('type'),
        attributes: attrs
      })
    }
  })

  const fullHtml = `
    <html>
      <head>
        <style>${cssContent}</style>
        <script>
          window.__COMPONENT_ATTRIBUTES__ = ${JSON.stringify(attributes)};
        </script>
      </head>
      ${htmlContent}
    </html>`
  return fullHtml
}

export const protectedCss = `
  body { 
    margin: auto; 
    padding: 0; 
    width: 600px;
  }
  @media screen and (max-width: 480px) {
    body {
      width: 320px;
    }
  }
`
export const canvasCss = `* ::-webkit-scrollbar { display: none; }`

export const getEditorConfig = (assets: any[] = []) => {
  const gjs = $('#gjs')
  const navbar = $('#navbar')
  const topNav = $('#top__nav')
  const mainContent = $('#main-content')
  const editor = grapesjs.init({
    container: '#gjs',
    storageManager: { autoload: false },
    fromElement: true,
    i18n: {
      locale: 'ja',
      detectLocale: false,
      localeFallback: 'ja',
      messagesAdd: {
        ja: ja
      }
    },
    blockManager: {
      appendTo: '#blocks',
      blocks: blocks
    },
    traitManager: traitManager,
    styleManager: styleManager,
    selectorManager: selectorManager,
    deviceManager: deviceManager,
    assetManager: {
      assets: [
        ...assets.map(asset => ({
          id: asset.id,
          name: asset.name,
          src: asset.src
        }))
      ],
      showUrlInput: false,
      dropzone: false,
      uploadFile: async function (e) {
        const input = e.target as HTMLInputElement
        const files = input.files
        if (!files) {
          return
        }
        await createAsset({ file: files[0] })
        const updatedAssets = await getAssetsList();
        editor.AssetManager.getAll().reset();
        if (updatedAssets && updatedAssets.data.data.length > 0) {
          editor.AssetManager.add(updatedAssets.data.data.map((asset: any) => ({
            id: asset.id,
            name: asset.name,
            src: asset.src
          })));
        }
        await editor.AssetManager.render();
        toast.success('アップロードが完了しました');
      },
      params: {
        page: 1,
      }
    },
    panels: panels,
    plugins: [
      // draggableTextPlugin,
      gjsTuiImageEditor,
      (editor) =>
        gjsPluginExport(editor, {
          filenamePfx: 'ADD-template',
          root: {
            'index.html': (ed: Editor) => `<html><head><style>${ed.getCss()}</style></head>${ed.getHtml()}</html>`
          }
        })
    ],
    canvasCss: canvasCss,
    protectedCss: protectedCss,
    dragMode: 'translate'
  })
  addEditorCommand(editor)
  editor.on('run:preview', () => {
    editor.stopCommand('sw-visibility')
    gjs.removeClass('px-2 py-1')
    navbar.addClass('hidden')
    topNav.addClass('hidden')
    mainContent.addClass('w-full')
  })

  editor.on('stop:preview', () => {
    editor.runCommand('sw-visibility')
    gjs.addClass('px-2 py-1')
    navbar.removeClass('hidden')
    topNav.removeClass('hidden')
    mainContent.removeClass('flex-1')
  })

  editor.on('component:resize', (event) => {
    const { component, el } = event as { component: Component; el: Element }

    if (component.is('text') && el) {
      const width = el.clientWidth
      const height = el.clientHeight
      const baseFontSize = 16
      const newFontSize = Math.max(12, baseFontSize * (width / 300))

      component.setStyle({
        'font-size': `${newFontSize}px`,
        width: `${width}px`,
        height: `${height}px`
      })
    }
  })

  editor.on('component:drag:start', (component) => {
    if (!component?.target?.view?.model) return;

    let model = component.target.view.model;
    const style = model.getStyle();
    const marginLeft = parseFloat(style['margin-left']) || 0;
    const marginTop = parseFloat(style['margin-top']) || 0;
    const marginRight = parseFloat(style['margin-right']) || 0;
    const marginBottom = parseFloat(style['margin-bottom']) || 0;

    if (marginLeft || marginTop || marginRight || marginBottom) {
      const translateX = marginLeft - marginRight;
      const translateY = marginTop - marginBottom;

      style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
      delete style['margin-left'];
      delete style['margin-top'];
      delete style['margin-right'];
      delete style['margin-bottom'];

      model.setStyle(style);
    }
  });

  editor.on('component:drag', (component) => {
    if (!component?.target?.view?.model) return;
    let model = component.target.view.model;
    const style = model.getStyle();
    if (style?.transform) {
      const translateMatch = style.transform.match(/\s*translateX\(([-\d.]+)px\)\s*translateY\(([-\d.]+)px\)/);
      if (translateMatch) {
        const x = parseFloat(translateMatch[1]);
        const y = parseFloat(translateMatch[2]);
        if (x >= 0) {
          style['margin-left'] = `${x}px`;
          delete style['margin-right'];
        } else {
          style['margin-right'] = `${Math.abs(x)}px`;
          delete style['margin-left'];
        }
        if (y >= 0) {
          style['margin-top'] = `${y}px`;
          delete style['margin-bottom'];
        } else {
          style['margin-bottom'] = `${Math.abs(y)}px`;
          delete style['margin-top'];
        }
        delete style.transform
        model.setStyle(style);
      }
    }
  });
  editor.on('component:drag:end', (component) => {
    if (!component?.target?.view?.model) return;

    let model = component.target.view.model;
    model.removeStyle('transform');
  });
  editor.on('asset:remove', async (asset) => {
    const id = asset.attributes.id
    await deleteAsset(id)
    editor.AssetManager.remove(asset)
  })
  return editor
}
