import type { PanelsConfig } from 'grapesjs'

export const panels: PanelsConfig = {
  defaults: [
    {
      id: 'basic-actions',
      el: '.panel__basic-actions',
      buttons: [
        {
          id: 'visibility',
          active: true, // active by default
          command: 'sw-visibility', // Built-in command
          label: `<svg style="display: block; max-width: 22px" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M15,5H17V3H15M15,21H17V19H15M11,5H13V3H11M19,5H21V3H19M19,9H21V7H19M19,21H21V19H19M19,13H21V11H19M19,17H21V15H19M3,5H5V3H3M3,9H5V7H3M3,13H5V11H3M3,17H5V15H3M3,21H5V19H3M11,21H13V19H11M7,21H9V19H7M7,5H9V3H7V5Z" />
                  </svg>`
        }
      ]
    },
    {
      id: 'editor-actions',
      el: '.panel__editor',
      buttons: [
        {
          id: 'saveDb',
          className: 'fa fa-paper-plane btn-save',
          attributes: {
            title: 'Save'
          },
          command: 'saveDb'
        },
        {
          id: 'cmd-clear',
          className: 'fa fa-trash',
          attributes: {
            title: 'Clear'
          },
          command: 'cmd-clear'
        },
        {
          id: 'undo',
          className: 'fa fa-undo',
          attributes: {
            title: 'Undo'
          },
          command: 'undo'
        },
        {
          id: 'redo',
          className: 'fa fa-repeat',
          attributes: {
            title: 'Redo'
          },
          command: 'redo'
        },
        {
          id: 'import',
          className: 'fa fa-upload',
          attributes: {
            title: 'Import'
          },
          command: 'import'
        },
        {
          id: 'export',
          className: 'fa fa-download',
          attributes: {
            title: 'Export'
          },
          command: 'export'
        },
        {
          id: 'preview',
          className: 'fa fa-eye',
          command: 'preview'
        }
      ]
    },
    {
      id: 'panel-devices',
      el: '.panel__devices',
      buttons: [
        {
          id: 'device-desktop',
          className: 'fa fa-television',
          command: 'set-device-desktop',
          active: true,
          togglable: false
        },
        {
          id: 'device-mobile',
          className: 'fa fa-mobile',
          command: 'set-device-mobile',
          togglable: false
        }
      ]
    }
  ]
}
