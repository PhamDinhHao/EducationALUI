import { useEffect, useState } from 'react'
import { Button, Row, Table } from 'antd'
import TableFooter from '@editor/components/TableFooter'
import { ButtonCopy, ButtonEditSentence } from '@editor/components/ui'
import { NewSentenceModal } from '@editor/components/modals'

import type { TableProps } from 'antd'
import useFetchDataTable from '@/shared/hooks/useFetchDataTable'
import { Sentence } from '@/modules/editor/types'
import { fetchSentenceList } from '@/modules/editor/server-action/sentence-list'
import { Pagination } from '@/shared/core/types/common.type'
import ButtonDeleteSentence from '@/modules/editor/components/ui/buttons/ButtonDeleteSentence'

const MySaved: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isOpenModalSave, setIsOpenModalSave] = useState<boolean>(false)
  const { queryParams, onFetch, dataTable, pagination, onSetQueryParams } = useFetchDataTable<Sentence>(fetchSentenceList)
  const { currentPage, perPage, total} = pagination as Pagination

  const columns: TableProps<Sentence>['columns'] = [
    {
      dataIndex: 'id',
      key: 'action',
      render: (_text, record) => (
        <div className='flex gap-2'>
          <ButtonEditSentence data={{ content: record.content, name: record.name }} id={record.id} onFetch={onFetch} queryParams={queryParams} />
          <ButtonCopy content={record.content} />
        </div>
      )
    },
    {
      title: 'ネーム',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content'
    }
  ]

  useEffect(() => {
    onSetQueryParams({ page: 1 })
    onFetch({ page: 1 })
  }, [])

  return (
    <>
      <div className='flex flex-col gap-2 p-4'>
        <div>
          <Button onClick={() => setIsOpenModalSave(true)}>追加</Button>
        </div>
        <Table
          className="[&_.ant-table-footer]:px-0" 
          columns={columns}
          dataSource={dataTable}
          footer={() => (
            <TableFooter paginationProps={{
              total,
              current: currentPage,
              pageSize: perPage,
              onChange: (page) => {
                onFetch({ page })
                onSetQueryParams({ ...queryParams, page })
              },
            }}>
              <Row>
                <ButtonDeleteSentence ids={selectedIds} setSelectedRowKeys={setSelectedIds} onFetch={onFetch} />
              </Row>
            </TableFooter>
          )}
          pagination={false}
          rowKey='id'
          rowSelection={{
            type: 'checkbox',
            onChange: (_, selectedRowKeys) => {
              setSelectedIds(selectedRowKeys.map((rowKey) => rowKey.id))
            }
          }}
        />
      </div>
      <NewSentenceModal isOpen={isOpenModalSave} onClose={() => setIsOpenModalSave(false)} onFetch={onFetch} queryParams={queryParams} />
    </>
  )
}

export default MySaved
