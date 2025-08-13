import RegistrationRecipientModal from '@/modules/mngRecipients/components/Modal/RegistrationModal'
import RecipientTable from '@/modules/mngRecipients/components/Table/RecipientTable'
import useFetchDataTable from '@/shared/hooks/useFetchDataTable'
import { fetchRecipientList } from '@/modules/mngRecipients/server-action/recipient-list'
import FilterRecipientList from '@/modules/mngRecipients/components/Filter/FilterRecipientList'
import useHandleModal from '@/shared/hooks/useHandleModal'
import SearchRecipientModal from '@/modules/mngRecipients/components/Modal/SearchRecipientModal'
import useHandleFilterRecipient from '@/modules/mngRecipients/hooks/useHandleFilterRecipient'
import useFetchGroupOptions from '@/modules/mngRecipients/hooks/useFetchGroupOptions'
import BulkRegistrationModal from '@/modules/mngRecipients/components/Modal/BulkRegistrationModal'
import { Recipient } from '@/modules/mngRecipients/core/types/recipient.type'
import useHandleBulkOperations from '@/modules/mngRecipients/hooks/useHandleBulkOperations'
import AddGroupRecipientModal from '@/modules/mngRecipients/components/Modal/AddGroupRecipientModal'
import RemoveGroupRecipientModal from '@/modules/mngRecipients/components/Modal/RemoveGroupRecipientModal'
import { useCallback } from 'react'
import ModalBase from '@/modules/mngRecipients/components/Modal/ModalBase'
import useHandleActionList from '@/modules/mngRecipients/hooks/useHandleActionList'

const RecipientsListPage: React.FC = () => {
  const { onFetch, dataTable, pagination, onSetQueryParams, queryParams } =
    useFetchDataTable<Recipient>(fetchRecipientList)
  const {
    filter,
    onAddGroupSearch,
    onAddCriteria,
    onRemoveCriteria,
    onChangeFilter,
    onChangeBaseFilter,
    onReset
  } = useHandleFilterRecipient()
  const { modalName, onSetModalName, onResetModalName } = useHandleModal()
  const { optionsGroup, getGroupName, groupList, onFetchTable, onFetchGroupList } = useFetchGroupOptions(
    onFetch,
    onResetModalName
  )
  const {
    itemsBulkOperations,
    onResetBulkModal,
    selectedRowKeys,
    onSetSelectedRowKeys,
    editData,
    onSetEditData,
    onRegisterRecipient,
    typeBulk,
    onSetTypeBulk
  } = useHandleBulkOperations(onSetModalName, onFetch, dataTable, pagination)
  const { onMoveToTrash } = useHandleActionList(onResetBulkModal, selectedRowKeys, typeBulk)

  const handleSetTypeBulk = useCallback(() => {
    onSetTypeBulk('')
  }, [])

  return (
    <div className='p-4'>
      <FilterRecipientList
        pagination={pagination}
        onSetModalName={onSetModalName}
        queryParams={queryParams}
        onGetGroupName={getGroupName}
        onSetEditData={onSetEditData}
        items={itemsBulkOperations}
        onSetTypeBulk={onSetTypeBulk}
        dataTable={dataTable}
      />
      <RecipientTable
        dataSource={dataTable}
        pagination={pagination}
        onFetch={onFetch}
        onOpenEditModal={onRegisterRecipient}
        selectedRowKeys={selectedRowKeys}
        onSetSelectedRowKeys={onSetSelectedRowKeys}
        items={itemsBulkOperations}
        onSetTypeBulk={handleSetTypeBulk}
      />
      {modalName === 'registration' && (
        <RegistrationRecipientModal
          isOpen={modalName === 'registration'}
          onClose={onResetModalName}
          data={editData}
          groupList={groupList || []}
          onFetchTable={onFetchTable}
          onFetchGroupList={onFetchGroupList}
        />
      )}
      {modalName === 'bulkRegistration' && (
        <BulkRegistrationModal
          isOpen={modalName === 'bulkRegistration'}
          onRefetch={onFetchTable}
          groupList={groupList || []}
          onFetchGroupList={onFetchGroupList}
          onClose={onResetModalName}
        />
      )}
      {modalName === 'search' && (
        <SearchRecipientModal
          isOpen={modalName === 'search'}
          onClose={onResetModalName}
          onFetch={onFetch}
          onSetQueryParams={onSetQueryParams}
          filter={filter}
          onAddGroupSearch={onAddGroupSearch}
          onAddCriteria={onAddCriteria}
          onRemoveCriteria={onRemoveCriteria}
          onChangeFilter={onChangeFilter}
          onChangeBaseFilter={onChangeBaseFilter}
          onReset={onReset}
          optionsGroup={optionsGroup}
        />
      )}
      {modalName === 'addGroup' && (
        <AddGroupRecipientModal
          isOpen={modalName === 'addGroup'}
          onClose={onResetModalName}
          ids={typeBulk === 'all' ? [] : selectedRowKeys}
          onResetBulkModal={onResetBulkModal}
          groupList={groupList || []}
          onFetchGroupList={onFetchGroupList}
        />
      )}
      {modalName === 'removeGroup' && (
        <RemoveGroupRecipientModal
          isOpen={modalName === 'removeGroup'}
          onClose={onResetModalName}
          ids={typeBulk === 'all' ? [] : selectedRowKeys}
          onResetBulkModal={onResetBulkModal}
          groupList={groupList || []}
          onFetchGroupList={onFetchGroupList}
        />
      )}
      {modalName === 'delete' && (
        <ModalBase
        title='読者をゴミ箱へ移動してよろしいでしょうか?'
        content={`ゴミ箱へ移動すると「削除」状態になり配信対象になりません。\nゴミ箱へ移動しても残りアドレス数は増加しません。残りアドレス数を増やすには読者の完全削除が必要です。`}
        isOpen={modalName === 'delete'}
        onClose={onResetModalName}
        onConfirm={onMoveToTrash}
        okText='ゴミ箱へ移動'
        cancelText='キャンセル'
        />
      )}
    </div>
  )
}

export default RecipientsListPage
