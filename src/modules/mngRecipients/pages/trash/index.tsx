import { useCallback } from 'react'
import { Recipient } from '@/modules/mngRecipients/core/types/recipient.type'
import useFetchDataTable from '@/shared/hooks/useFetchDataTable'
import { fetchTrashList } from '@/modules/mngRecipients/server-action/trash-list'
import FilterTrash from '@/modules/mngRecipients/components/Filter/FilterTrash'
import useHandleModal from '@/shared/hooks/useHandleModal'
import useFetchGroupOptions from '@/modules/mngRecipients/hooks/useFetchGroupOptions'
import useHandleBulkOperations from '@/modules/mngRecipients/hooks/useHandleBulkOperations'
import useHandleFilterRecipientTrash from '@/modules/mngRecipients/hooks/useHandleFilterRecipientTrash'
import RecipientTrashTable from '@/modules/mngRecipients/components/Table/RecipientTrashTable'
import RegistrationRecipientModal from '@/modules/mngRecipients/components/Modal/RegistrationModal'
import ModalBase from '@/modules/mngRecipients/components/Modal/ModalBase'
import useHandleActionTrash from '@/modules/mngRecipients/hooks/useHandleActionTrash'
import SearchRecipientTrashModal from '@/modules/mngRecipients/components/Modal/SearchRecipientTrashModal'

const RecipientsTrashPage: React.FC = () => {
  const { onFetch, dataTable, pagination, onSetQueryParams, queryParams } = useFetchDataTable<Recipient>(fetchTrashList)
  const {
    filter,
    onAddGroupSearch,
    onAddCriteria,
    onRemoveCriteria,
    onChangeFilter,
    onChangeBaseFilter,
    onReset
  } = useHandleFilterRecipientTrash(onSetQueryParams)
  const { modalName, onSetModalName, onResetModalName } = useHandleModal()
  const { optionsGroup, getGroupName, groupList, onFetchTable, onFetchGroupList } = useFetchGroupOptions(
    onFetch,
    onResetModalName
  )
  const {
    onResetBulkModal,
    selectedRowKeys,
    onSetSelectedRowKeys,
    editData,
    onRegisterRecipient,
    typeBulk,
    onSetTypeBulk,
    itemsBulkOperationsTrash
  } = useHandleBulkOperations(onSetModalName, onFetch, dataTable, pagination)

  const { onRestoreTrash, onRemoveTrash } = useHandleActionTrash(selectedRowKeys, typeBulk, onResetBulkModal)

  const handleSetTypeBulk = useCallback(() => {
    onSetTypeBulk('')
  }, [])

  return (
    <div className='p-4'>
      <FilterTrash
        pagination={pagination}
        onSetModalName={onSetModalName}
        queryParams={queryParams}
        onGetGroupName={getGroupName}
        items={itemsBulkOperationsTrash}
        onSetTypeBulk={onSetTypeBulk}
        dataTable={dataTable}
      />
      <RecipientTrashTable
        dataSource={dataTable}
        pagination={pagination}
        onFetch={onFetch}
        onOpenEditModal={onRegisterRecipient}
        selectedRowKeys={selectedRowKeys}
        onSetSelectedRowKeys={onSetSelectedRowKeys}
        items={itemsBulkOperationsTrash}
        onSetTypeBulk={handleSetTypeBulk}
      />
      {modalName === 'searchTrash' && (
        <SearchRecipientTrashModal
          isOpen={modalName === 'searchTrash'}
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
          isSituation={false}
        />
      )}
      {modalName === 'restoreTrash' && (
        <ModalBase
          title='読者一覧へ移動 ( 配信中に戻す ) してよろしいですか?'
          content='ゴミ箱から読者一覧へ移動する読者は配信対象になります。読者一覧へ移動する読者に対して配信したくない場合は読者一覧に戻した後「配信停止」状態に変更してください。'
          isOpen={modalName === 'restoreTrash'}
          onClose={onResetModalName}
          onConfirm={onRestoreTrash}
          okText='読者一覧へ移動'
          cancelText='キャンセル'
        />
      )}
      {modalName === 'removeTrash' && (
        <ModalBase
          title='読者を完全に削除してよろしいですか?'
          content={`完全削除した読者データは復元できません。また、開封/クリック測定データも削除されます。\nまた、ご契約アドレス数を超過するユニークアドレスへの配信を禁止しております。完全削除後、ご契約アドレス数を超過した別アドレスの登録はご遠慮ください。`}
          isOpen={modalName === 'removeTrash'}
          onClose={onResetModalName}
          onConfirm={onRemoveTrash}
          okText='完全削除'
          cancelText='キャンセル'
        />
      )}
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
    </div>
  )
}

export default RecipientsTrashPage
