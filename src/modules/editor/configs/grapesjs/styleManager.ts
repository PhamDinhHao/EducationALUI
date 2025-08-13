import type { StyleManagerConfig } from 'grapesjs'

export const styleManager: StyleManagerConfig = {
  appendTo: '#styles-container',
  sectors: [
    {
      name: 'Dimension',
      open: false,
      buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
      properties: [
        {
          property: 'margin',
          properties: [
            { name: 'Top', property: 'margin-top' },
            { name: 'Left', property: 'margin-left' },
            { name: 'Right', property: 'margin-right' },
            { name: 'Bottom', property: 'margin-bottom' }
          ]
        },
        {
          property: 'padding',
          properties: [
            { name: 'Top', property: 'padding-top' },
            { name: 'Right', property: 'padding-right' },
            { name: 'Bottom', property: 'padding-bottom' },
            { name: 'Left', property: 'padding-left' }
          ]
        }
      ]
    },
    {
      name: 'Typography',
      open: false,
      buildProps: [
        'font-family',
        'font-size',
        'font-weight',
        'letter-spacing',
        'color',
        'line-height',
        'text-align',
        'text-decoration',
        'font-style',
        'vertical-align',
        'text-shadow',
        'writing-mode',
        'text-orientation'
      ],
      properties: [
        { name: 'Font', property: 'font-family' },
        { name: 'Weight', property: 'font-weight' },
        { name: 'Font color', property: 'color' },
        {
          property: 'text-align',
          type: 'radio',
          defaults: 'left',
          list: [
            {
              value: 'left',
              name: 'Left',
              className: 'fa fa-align-left',
              id: 'left'
            },
            {
              value: 'center',
              name: 'Center',
              className: 'fa fa-align-center',
              id: 'center'
            },
            {
              value: 'right',
              name: 'Right',
              className: 'fa fa-align-right',
              id: 'right'
            },
            {
              value: 'justify',
              name: 'Justify',
              className: 'fa fa-align-justify',
              id: 'justify'
            }
          ]
        },
        {
          property: 'text-decoration',
          type: 'radio',
          defaults: 'none',
          list: [
            {
              value: 'none',
              name: 'None',
              className: 'fa fa-times',
              id: 'none'
            },
            {
              value: 'underline',
              name: 'underline',
              className: 'fa fa-underline',
              id: 'underline'
            },
            {
              value: 'line-through',
              name: 'Line-through',
              className: 'fa fa-strikethrough',
              id: 'line-through'
            }
          ]
        },
        {
          property: 'font-style',
          type: 'radio',
          defaults: 'normal',
          list: [
            {
              value: 'normal',
              name: 'Normal',
              className: 'fa fa-font',
              id: 'normal'
            },
            {
              value: 'italic',
              name: 'Italic',
              className: 'fa fa-italic',
              id: 'italic'
            }
          ]
        },
        {
          property: 'vertical-align',
          type: 'select',
          defaults: 'baseline',
          list: [
            {
              value: 'baseline',
              id: 'baseline'
            },
            {
              value: 'top',
              id: 'top'
            },
            {
              value: 'middle',
              id: 'middle'
            },
            {
              value: 'bottom',
              id: 'bottom'
            }
          ]
        },
        {
          property: 'text-shadow',
          properties: [
            { name: 'X position', property: 'text-shadow-h' },
            { name: 'Y position', property: 'text-shadow-v' },
            { name: 'Blur', property: 'text-shadow-blur' },
            { name: 'Color', property: 'text-shadow-color' }
          ]
        },
        {
          property: 'writing-mode',
          type: 'select',
          name: 'Text Direction',
          defaults: 'horizontal-tb',
          list: [
            { value: 'horizontal-tb', name: 'Horizontal', id: 'horizontal-tb' },
            { value: 'vertical-rl', name: 'Vertical Right to Left', id: 'vertical-rl' },
            { value: 'vertical-lr', name: 'Vertical Left to Right', id: 'vertical-lr' }
          ]
        },
        {
          property: 'text-orientation',
          type: 'select',
          name: 'Text Orientation',
          defaults: 'mixed',
          list: [
            { value: 'mixed', name: 'Mixed', id: 'mixed' },
            { value: 'upright', name: 'Upright', id: 'upright' },
            { value: 'sideways', name: 'Sideways', id: 'sideways' }
          ]
        },
        {
          property: 'letter-spacing',
          type: 'slider',
          defaults: '0',
          min: -5,
          max: 20,
          units: ['px', 'em'],
        }
      ]
    },
    {
      name: 'Decorations',
      open: false,
      buildProps: ['background-color', 'border-collapse', 'border-radius', 'border', 'background'],
      properties: [
        {
          property: 'background-color',
          name: 'Background'
        },
        {
          property: 'border-radius',
          type: 'slider',
          defaults: '0',
          min: 0,
          max: 100,
          units: ['%', 'px'],
          name: 'Roundness',
          properties: [
            { name: 'Top', property: 'border-top-left-radius' },
            { name: 'Right', property: 'border-top-right-radius' },
            { name: 'Bottom', property: 'border-bottom-left-radius' },
            { name: 'Left', property: 'border-bottom-right-radius' }
          ]
        },
        {
          property: 'border-collapse',
          type: 'radio',
          defaults: 'separate',
          list: [
            { id: 'border-collapse-separate', value: 'separate', name: 'No' },
            { id: 'border-collapse-collapse', value: 'collapse', name: 'Yes' }
          ]
        },
        {
          property: 'border',
          properties: [
            { name: 'Width', property: 'border-width', defaults: '0' },
            { name: 'Style', property: 'border-style' },
            { name: 'Color', property: 'border-color' }
          ]
        },
        {
          property: 'background',
          properties: [
            { name: 'Image', property: 'background-image' },
            { name: 'Repeat', property: 'background-repeat' },
            { name: 'Position', property: 'background-position' },
            { name: 'Attachment', property: 'background-attachment' },
            { name: 'Size', property: 'background-size' }
          ]
        }
      ]
    }
  ]
}
