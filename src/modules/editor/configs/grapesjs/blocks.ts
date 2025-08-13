import type { BlockProperties } from 'grapesjs'
import { convertStyleToString } from '@editor/lib/utils'

const cellStyle: Record<string, string> = {
  padding: '0',
  margin: '0',
  'vertical-align': 'top'
}

const tableStyle: Record<string, string> = {
  height: '150px',
  margin: '0 auto',
  width: '100%'
}

export const blocks: BlockProperties[] = [
  {
    category: 'ベイシク',
    id: 'sect100',
    label: '1 Section',
    media: `<svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M2 20h20V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h20a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1Z"/>
    </svg>`,
    content: `
      <table style="${convertStyleToString(tableStyle)}">
        <tr>
          <td style="${convertStyleToString(cellStyle)}">
            <div style="padding: 10px;">Example text</div>
          </td>
        </tr>
      </table>
    `
  },
  {
    category: 'ベイシク',
    id: 'sect50',
    label: '1/2 Section',
    media: `<svg viewBox="0 0 23 24">
      <path fill="currentColor" d="M2 20h8V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1ZM13 20h8V4h-8v16Zm-1 0V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1Z"/>
    </svg>`,
    content: `
      <table style="${convertStyleToString(tableStyle)}">
        <tr>
          <td style="${convertStyleToString(cellStyle)} width: 50%" class="layout-vertical">
            <div style="padding: 10px;">Example text</div>
          </td>
          <td style="${convertStyleToString(cellStyle)} width: 50%" class="layout-vertical">
            <div style="padding: 10px;">Example text</div>
          </td>
        </tr>
      </table>
      <style>
        @media only screen and (max-width: 743.5px) {
          .layout-vertical {
            display: block;
            width: 100% !important;
            max-width: 100% !important;
            padding-right: 0 !important;
            padding-left: 0 !important;
          }
        }
      </style>
    `
  },
  {
    category: 'ベイシク',
    id: 'sect37',
    label: '3/7 Section',
    media: `<svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M2 20h20V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h20a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1Z"/>
    </svg>`,
    content: `
      <table style="${convertStyleToString(tableStyle)}">
        <tr>
          <td style="${convertStyleToString(cellStyle)} width: 30%;">
            <div style="padding: 10px;">Example text</div>
          </td>
          <td style="${convertStyleToString(cellStyle)} width: 70%;">
            <div style="padding: 10px;">Example text</div>
          </td>
        </tr>
      </table>
    `
  },
  {
    category: 'ベイシク',
    id: 'sect73',
    label: '7/3 Section',
    media: `<svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M2 20h20V4H2v16Zm-1 0V4a1 1 0 0 1 1-1h20a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1Z"/>
    </svg>`,
    content: `
      <table style="${convertStyleToString(tableStyle)}">
        <tr>
          <td style="${convertStyleToString(cellStyle)} width: 70%;">
            <div style="padding: 10px;">Example text</div>
          </td>
          <td style="${convertStyleToString(cellStyle)} width: 30%;">
            <div style="padding: 10px;">Example text</div>
          </td>
        </tr>
      </table>
    `
  },
  {
    category: 'ベイシク',
    id: 'text',
    label: 'Text',
    media: `<svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,6.87 17.26,6.43C16.73,6 16.11,6 15.5,6H13V16.5C13,17 13,17.5 13.33,17.75C13.67,18 14.33,18 15,18V19H9V18C9.67,18 10.33,18 10.67,17.75C11,17.5 11,17 11,16.5V6H8.5C7.89,6 7.27,6 6.74,6.43C6.21,6.87 5.75,7.74 5.3,8.61L4.34,8.35L5.5,4H18.5Z" />
    </svg>`,
    activate: true,
    content: {
      type: 'text',
      content: 'Insert your text here',
      style: { padding: '10px' },
      resizable: true,
      droppable: true
    }
  },
  {
    category: 'ベイシク',
    id: 'divider',
    label: 'Divider',
    media: `<svg viewBox="0 0 24 24">
        <path fill="currentColor" d="M21 18H2V20H21V18M19 10V14H4V10H19M20 8H3C2.45 8 2 8.45 2 9V15C2 15.55 2.45 16 3 16H20C20.55 16 21 15.55 21 15V9C21 8.45 20.55 8 20 8M21 4H2V6H21V4Z" />
    </svg>`,
    content: `
      <table style="width: 100%; margin-top: 10px; margin-bottom: 10px;">
        <tr>
          <td class="divider"></td>
        </tr>
      </table>
      <style>
        .divider {
          background-color: rgba(0, 0, 0, 0.1);
          height: 1px;
        }
      </style>
    `
  },
  {
    category: 'ベイシク',
    id: 'image',
    label: 'Image',
    media: `<svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M21,3H3C2,3 1,4 1,5V19A2,2 0 0,0 3,21H21C22,21 23,20 23,19V5C23,4 22,3 21,3M5,17L8.5,12.5L11,15.5L14.5,11L19,17H5Z" />
    </svg>`,
    activate: true,
    content: {
      type: 'image',
      style: { color: 'black', width: '100%' }
    }
  },
  {
    category: 'ベイシク',
    id: 'image-text-overlay',
    label: 'Image with Text',
    media: `<svg viewBox="0 0 24 24">
        <path fill="currentColor" d="M21,3H3C2,3 1,4 1,5V19A2,2 0 0,0 3,21H21C22,21 23,20 23,19V5C23,4 22,3 21,3M5,17L8.5,12.5L11,15.5L14.5,11L19,17H5Z" />
      </svg>`,
    content: `
      <div style="text-align: center; width: 100%; height: 200px; overflow: visible; background-image: url('https://via.placeholder.com/400x200'); background-size: cover; background-position: center;object-fit: cover">
        <div style="z-index: 1000; position: relative; display: inline-block; color: black; font-size: 24px; font-weight: bold; text-align: center;text-align: left">
          Editable Text
        </div>
      </div>
    `,
    activate: true
  },
  {
    category: 'ベイシク',
    id: 'image-overlay',
    label: 'Image Overlay',
    media: `<svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M21,3H3C2,3 1,4 1,5V19A2,2 0 0,0 3,21H21C22,21 23,20 23,19V5C23,4 22,3 21,3M5,17L8.5,12.5L11,15.5L14.5,11L19,17H5Z" />
    </svg>`,
    content: `
      <div style="text-align: center; width: 100%; height: 200px; overflow: visible; background-image: url('https://via.placeholder.com/400x200'); background-size: cover; background-position: center;object-fit: cover">
        <img src="https://via.placeholder.com/150x100" alt="Overlay Image" style="z-index: 1000; position: relative; display: inline-block;width: 150px; height: auto; cursor: move;object-fit: cover; color: black; font-size: 24px; font-weight: bold; text-align: center;text-align: left">
      </div>
    `,
    activate: true
  },
  // {
  //   category: 'ベイシク',
  //   id: 'button',
  //   label: 'Button',
  //   media: `<svg viewBox="0 0 24 24">
  //     <path fill="currentColor" d="M10 12V6h4v6h5l-7 7-7-7h5z"/>
  //   </svg>`,
  //   activate: true,
  //   content: {
  //     type: 'link',
  //     content: 'Click Me',
  //     style: {
  //       padding: '10px 20px',
  //       'font-size': '16px',
  //       color: 'white',
  //       'background-color': 'black',
  //       'border-radius': '5px',
  //       'text-align': 'center',
  //       display: 'inline-block'
  //     },
  //     attributes: {
  //       href: '#'
  //     }
  //   }
  // }
  {
    category: 'ベイシク',
    id: 'social-icons',
    label: 'Social Icons',
    media: `<svg viewBox="0 0 24 24">
      <path fill="currentColor" d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
    </svg>`,
    content: {
      type: 'div',
      style: { 'text-align': 'center', padding: '10px' },
      components: [
        {
          type: 'link',
          attributes: {
            href: '#',
            title: 'X',
            'data-gjs-selectable': 'true',
            'data-gjs-hoverable': 'true',
            draggable: 'true'
          },
          style: {
            'text-decoration': 'none',
            display: 'inline-block',
            margin: '0 5px'
          },
          components: [
            {
              type: 'image',
              attributes: {
                src: 'https://add-cms.s3.ap-southeast-1.amazonaws.com/add/assets/20241225170250_icon-x-basic.png',
                alt: 'X',
                'data-gjs-selectable': 'false',
                'data-gjs-hoverable': 'false',
                draggable: 'false',
                'data-gjs-clickable': 'false',
                'data-gjs-highlightable': 'false'
              },
              style: {
                width: '32px',
                height: '32px',
                'pointer-events': 'none'
              }
            }
          ]
        },
        {
          type: 'link',
          attributes: {
            href: '#',
            title: 'Facebook',
            'data-gjs-selectable': 'true',
            'data-gjs-hoverable': 'true',
            draggable: 'true'
          },
          style: {
            'text-decoration': 'none',
            display: 'inline-block',
            margin: '0 5px'
          },
          components: [
            {
              type: 'image',
              attributes: {
                src: 'https://add-cms.s3.ap-southeast-1.amazonaws.com/add/assets/20241225170300_icon-facebook-basic.png',
                alt: 'Facebook',
                'data-gjs-selectable': 'false',
                'data-gjs-hoverable': 'false',
                draggable: 'false',
                'data-gjs-clickable': 'false',
                'data-gjs-highlightable': 'false'
              },
              style: {
                width: '32px',
                height: '32px',
                'pointer-events': 'none'
              }
            }
          ]
        },
        {
          type: 'link',
          attributes: {
            href: '#',
            title: 'YouTube',
            'data-gjs-selectable': 'true',
            'data-gjs-hoverable': 'true',
            draggable: 'true'
          },
          style: {
            'text-decoration': 'none',
            display: 'inline-block',
            margin: '0 5px'
          },
          components: [
            {
              type: 'image',
              attributes: {
                src: 'https://add-cms.s3.ap-southeast-1.amazonaws.com/add/assets/20241225170304_icon-youtube-basic.png',
                alt: 'YouTube',
                'data-gjs-selectable': 'false',
                'data-gjs-hoverable': 'false',
                draggable: 'false',
                'data-gjs-clickable': 'false',
                'data-gjs-highlightable': 'false'
              },
              style: {
                width: '32px',
                height: '32px',
                'pointer-events': 'none'
              }
            }
          ]
        },
        {
          type: 'link',
          attributes: {
            href: '#',
            title: 'LINE',
            'data-gjs-selectable': 'true',
            'data-gjs-hoverable': 'true',
            draggable: 'true'
          },
          style: {
            'text-decoration': 'none',
            display: 'inline-block',
            margin: '0 5px'
          },
          components: [
            {
              type: 'image',
              attributes: {
                src: 'https://add-cms.s3.ap-southeast-1.amazonaws.com/add/assets/20241225170254_icon-line-basic.png',
                alt: 'LINE',
                'data-gjs-selectable': 'false',
                'data-gjs-hoverable': 'false',
                draggable: 'false',
                'data-gjs-clickable': 'false',
                'data-gjs-highlightable': 'false'
              },
              style: {
                width: '32px',
                height: '32px',
                'pointer-events': 'none'
              }
            }
          ]
        },
        {
          type: 'link',
          attributes: {
            href: '#',
            title: 'Instagram',
            'data-gjs-selectable': 'true',
            'data-gjs-hoverable': 'true',
            draggable: 'true'
          },
          style: {
            'text-decoration': 'none',
            display: 'inline-block',
            margin: '0 5px'
          },
          components: [
            {
              type: 'image',
              attributes: {
                src: 'https://add-cms.s3.ap-southeast-1.amazonaws.com/add/assets/20241225170257_icon-instagram-basic.png',
                alt: 'Instagram',
                'data-gjs-selectable': 'false',
                'data-gjs-hoverable': 'false',
                draggable: 'false',
                'data-gjs-clickable': 'false',
                'data-gjs-highlightable': 'false'
              },
              style: {
                width: '32px',
                height: '32px',
                'pointer-events': 'none'
              }
            }
          ]
        }
      ]
    }
  },
]
