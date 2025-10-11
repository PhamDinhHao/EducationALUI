import { Button } from 'antd'
import { FileWordOutlined } from '@ant-design/icons'
import { saveAs } from 'file-saver'
import { AlignmentType, Document, HeadingLevel, Packer, Paragraph, TextRun } from 'docx'

export type StudyPlanSection = {
  label: string
  items: string[]
}

export type StudyPlan = {
  title: string
  sections: StudyPlanSection[]
}

type ExportStudyPlanProps = {
  plan: StudyPlan
}

const ExportStudyPlan: React.FC<ExportStudyPlanProps> = ({ plan }) => {
  const handleExport = async () => {
    // Build paragraphs safely using array spreads
    let nodes: Paragraph[] = []

    // Title (uppercase, 16pt, centered)
    nodes = [
      ...nodes,
      new Paragraph({
        children: [
          new TextRun({ text: (plan.title || 'KẾ HOẠCH HỌC TẬP').toUpperCase(), bold: true, size: 32 })
        ],
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
      })
    ]

    // Sections with numbering (1., 2., ...), justified
    for (const [idx, section] of (plan.sections || []).entries()) {
      nodes = [
        ...nodes,
        new Paragraph({
          children: [
            new TextRun({ text: `${idx + 1}. ${section.label || 'Mục'}`, bold: true, size: 26 })
          ],
          alignment: AlignmentType.JUSTIFIED,
          spacing: { before: 240, after: 120 },
        })
      ]

      for (const it of section.items || []) {
        nodes = [
          ...nodes,
          new Paragraph({
            children: [new TextRun({ text: it, size: 26 })],
            alignment: AlignmentType.JUSTIFIED,
            bullet: { level: 0 },
            spacing: { after: 60 },
          })
        ]
      }

      nodes = [...nodes, new Paragraph({ text: '' })]
    }

    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: 'Times New Roman',
              size: 26, // 13pt per Vietnamese administrative standard
            },
            paragraph: {
              spacing: { line: 360 }, // ~1.5 line spacing
            },
          },
        },
      },
      sections: [
        {
          properties: {
            page: {
              // L:3.0cm, R/T/B:2.0cm
              margin: { top: 1134, right: 1134, bottom: 1134, left: 1701 },
            },
          },
          children: nodes,
        },
      ],
    })

    const blob = await Packer.toBlob(doc)
    const fileName = `${(plan.title || 'ke-hoach-hoc-tap').replace(/\s+/g, '-')}.docx`
    saveAs(blob, fileName)
  }

  return (
    <Button type="primary" icon={<FileWordOutlined />} onClick={handleExport} className="!bg-orange-500 !border-orange-500">
      Xuất Word
    </Button>
  )
}

export default ExportStudyPlan
