import { useCallback, useState } from 'react'
import { Button, Dropdown, MenuProps, Table, TableColumnsType } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import ButtonDeleteDesign from '@/shared/components/Button/ButtonDeleteDesign'
import PaginationDesign from '@/shared/components/Pagination/PaginationDesign'
import { Mail } from '@/modules/mail-setting/core/types/mail-setting.type'
import useHandleModal from '@/shared/hooks/useHandleModal'
import ModalMailSetting from '@/modules/mail-setting/components/Modal/ModalMailSetting'
import useHandleFormSettingMail from '@/modules/mail-setting/hooks/useHandleFormSettingMail'
import { deleteMailSetting } from '@/modules/mail-setting/services/mail-setting.service'
import { getPageDelete } from '@/shared/utils'
import ModalSignatureSetting from '@/modules/mail-setting/components/Modal/ModalSignatureSetting'

type MailSettingListTableProps = {
  onFetch: (params: { [key: string]: any }) => void
  dataTable: Mail[]
  pagination: { [key: string]: any }
}

const MailSettingListTable = ({
  onFetch,
  dataTable,
  pagination: { page, perPage, total }
}: MailSettingListTableProps) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const { modalName, onSetModalName, onResetModalName } = useHandleModal()
  const { onCreate, editData, onEditData, onSignature } = useHandleFormSettingMail(onSetModalName)

  const columns: TableColumnsType<any> = [
    {
      key: 'action',
      render: (record: Mail) => {
        const dropdownItems: MenuProps['items'] = [
          {
            label: <p onClick={onEditData(record)}>送信元アドレス設定</p>,
            key: '0'
          },
          {
            label: <p onClick={onSignature(record)}>署名</p>,
            key: '1'
          }
        ]

        return (
          <Dropdown menu={{ items: dropdownItems }} trigger={['click']}>
            <Button className='w-8' onClick={(e) => e.preventDefault()}>
              <EditOutlined />
            </Button>
          </Dropdown>
        )
      },
      width: 40
    },
    { title: '表示名', dataIndex: 'fromName' },
    { title: '送信元アドレス', dataIndex: 'fromAddress' },
    { title: 'ユーザー名', dataIndex: 'username' },
    { title: 'ホスト', dataIndex: 'host' }
  ]

  const handleFetchTable = useCallback(() => {
    const newPage = getPageDelete(dataTable, selectedRowKeys, page)
    onFetch(newPage)
    setSelectedRowKeys([])
    onResetModalName()
  }, [dataTable, selectedRowKeys, page])

  const handleConfirmDelete = useCallback(async () => {
    await deleteMailSetting(selectedRowKeys.join(','))
    handleFetchTable()
  }, [selectedRowKeys])

  return (
    <div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button onClick={onCreate}>新規登録</Button>
        </div>
      </div>
      <div className='py-2'>
        <Table<any>
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
          onConfirm={handleConfirmDelete}
        />
        <PaginationDesign onChangePage={onFetch} perPage={perPage} currentPage={page} total={total} />
      </div>
      {modalName === 'mailSetting' && (
        <ModalMailSetting
          modalName={modalName}
          onClose={onResetModalName}
          data={editData}
          onFetchTable={handleFetchTable}
        />
      )}
      {modalName === 'signatureSetting' && (
        <ModalSignatureSetting
          isOpen={true}
          onCancel={onResetModalName}
          data={editData}
          onFetchTable={handleFetchTable}
        />
      )}
    </div>
  )
}

export default MailSettingListTable
