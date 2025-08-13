import { useCallback, useEffect, useState } from 'react'
import { Button, Table, TableColumnsType } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { useOpen } from '@/shared/hooks/useOpen'
import RegistrationGroupModal from '@/modules/group/components/Modal/RegistrationGroupModal'
import useFetchDataTable from '@/shared/hooks/useFetchDataTable'
import { fetchGroupList } from '@/modules/group/server-action/group-list'
import { Group, Pagination } from '@/shared/core/types'
import PaginationDesign from '@/shared/components/Pagination/PaginationDesign'
import { deleteGroup } from '@/modules/group/services/group-list.service'
import ButtonDeleteDesign from '@/shared/components/Button/ButtonDeleteDesign'
import { getPageDelete } from '@/shared/utils'

const ListDistribution: React.FC = () => {
  const { queryParams, onFetch, dataTable, pagination } = useFetchDataTable<any>(fetchGroupList)
  const { currentPage, perPage, total } = pagination as Pagination
  const { isOpen, setIsOpen } = useOpen()
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const [selectedItem, setSelectedItem] = useState<any | undefined>()

  const openAddModal = useCallback(() => {
    setSelectedItem(undefined)
    setIsOpen(true)
  }, [setIsOpen])

  const openEditModal = useCallback(
    (record: any) => {
      setSelectedItem(record)
      setIsOpen(true)
    },
    [setIsOpen]
  )

  const handleCloseModal = useCallback(() => {
    setIsOpen(false)
    setSelectedItem(undefined)
  }, [setIsOpen])

  const columns: TableColumnsType<any> = [
    {
      key: 'action',
      render: (record: Group) => {
        return (
          <Button className='w-8' onClick={() => openEditModal(record)}>
            <EditOutlined />
          </Button>
        )
      },
      width: 40
    },
    { title: 'リスト名', dataIndex: 'name' }
  ]

  useEffect(() => {
    onFetch({ page: 1 })
  }, [])

  const handleConfirm = useCallback(async () => {
    const newPage = getPageDelete(dataTable, selectedRowKeys, currentPage)
    await deleteGroup(selectedRowKeys.join(','))
    setSelectedRowKeys([])
    onFetch(newPage)
  }, [selectedRowKeys, currentPage, dataTable])

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button onClick={openAddModal}>新規登録</Button>
        </div>
      </div>
      <div className='py-2'>
        <Table<Group>
          columns={columns}
          dataSource={dataTable}
          pagination={false}
          rowKey='id'
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys as number[])
          }}
        />
      </div>
      <div className='flex items-center justify-between'>
        <ButtonDeleteDesign
          selectedKeys={selectedRowKeys}
          title='リストを削除してよろしいでしょうか？'
          content='削除したリストは復元できません。また、読者は削除したリストから除外されます。'
          onConfirm={handleConfirm}
        />
        <PaginationDesign onChangePage={onFetch} perPage={perPage} currentPage={currentPage} total={total} />
      </div>

      <RegistrationGroupModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        data={selectedItem}
        queryParams={queryParams}
        onFetch={onFetch}
      />
    </>
  )
}

export default ListDistribution
