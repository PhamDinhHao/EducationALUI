import { Row, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { ButtonApplicable, ButtonDeleteTemplate } from '@/modules/editor/components/ui'
import { formattedDate } from '@/shared/utils'
import { Template } from '@/shared/core/types/template.type'
import { useState } from 'react'
import { Pagination } from '@/shared/core/types'
import TableFooter from '@/modules/editor/components/TableFooter'
import { EyeOutlined } from '@ant-design/icons'
import TemplateModal from '@/modules/editor/components/modals/TemplateModal'

type MyTemplateTableProps = {
  dataTable: any
  pagination: Pagination,
  setPagination: (pagination: Pagination) => void
}

const MyTemplateTable = ({ dataTable, pagination, setPagination }: MyTemplateTableProps) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [isPreview, setIsPreview] = useState(false)
  const [templateData, setTemplateData] = useState<Template | null>(null)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const columns: ColumnsType<Template> = [
    // {
    //   dataIndex: 'id',
    //   key: 'action',
    //   render: (_text, record) => {
    //     return (
    //       <div className='flex justify-between gap-2'>
    //         <ButtonEdit id={record.id} />
    //       </div>
    //     )
    //   }
    // },
    {
      title: '登録日時',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (value) => <p>{formattedDate(new Date(value))}</p>
    },
    {
      title: '名前',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <p className='max-w-24 break-words xl:w-[200px]'>{text}</p>
    },
    {
      key: 'applyAction',
      render: (_text, record) => (
        <div className='flex gap-2'>
          <EyeOutlined className="text-lg" onClick={() => {
            setTemplateData(record)
            setIsPreview(true)
          }}/>
          <div onClick={() => setSelectedTemplateId(String(record.id))}>
            <ButtonApplicable templateId={String(record.id)} />
          </div>
        </div>
      )
    }
  ]
  return (
    <div className='h-[calc(100vh-250px)]'>
      <Table
        rowKey='id'
        columns={columns}
        dataSource={dataTable}
        pagination={false}
        scroll={{ y: 'calc(100vh - 250px)' }}
        rowSelection={{
          type: 'checkbox',
          onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys as string[])
          }
        }}
        rowClassName={(record) => 
          selectedTemplateId === String(record.id) ? 'bg-blue-100' : ''
        }
        footer={() => (
          <TableFooter paginationProps={{
            total: pagination.total,
            current: pagination.currentPage,
            pageSize: pagination.perPage,
            onChange: (page) => {
              setPagination({ ...pagination, currentPage: page })
            },
          }}>
            <Row>
              <ButtonDeleteTemplate ids={selectedRowKeys} setSelectedRowKeys={setSelectedRowKeys} />
            </Row>
          </TableFooter>
        )}
      />
      {isPreview && <TemplateModal isOpen={isPreview} onClose={() => setIsPreview(false)} data={templateData} />}
    </div>
  )
}

export default MyTemplateTable
