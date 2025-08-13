import { useCallback, useEffect, useState } from 'react'
import { Button } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import useHandleModal from '@/shared/hooks/useHandleModal'
import useFetchDataTable from '@/shared/hooks/useFetchDataTable'
import { fetchRecipientFilterList } from '@/modules/group/server-action/recipient-filter-list'
import { RecipientFilter } from '@/modules/group/core/types/recipient-filter.type'
import RecipientFilterTable from '@/modules/group/components/Table/RecipientFilterTable'
import useHandleFilterDelivery from '@/modules/group/hooks/useHandleFilterDelivery'
import FilterDeliveryModal from '@/modules/group/components/Modal/FilterDeliveryModal'
import PreviewDeliveryModal from '@/modules/group/components/Modal/PreviewDeliveryModal'

const FilterDelivery: React.FC = () => {
  const { dataTable, onFetch, pagination } = useFetchDataTable<RecipientFilter>(fetchRecipientFilterList)
  const useFilter = useHandleFilterDelivery()
  const { modalName, onSetModalName, onResetModalName } = useHandleModal()
  const [editData, setEditData] = useState<RecipientFilter | null>(null)

  const handleEditData = useCallback((data: RecipientFilter) => {
    return () => {
      setEditData(data)
      onSetModalName('previewDelivery')
    }
  }, [])

  const handleOpenModalFilter = useCallback(() => {
    setEditData(null)
    onSetModalName('filterDelivery')
  }, [])

  useEffect(() => {
    (async () => {
      await onFetch({ page: 1 })
    })()
  }, [])

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Button onClick={handleOpenModalFilter}>新規登録</Button>
        </div>
        <div>
          <Button>
            <QuestionCircleOutlined />
            <span>リストとは</span>
          </Button>
        </div>
      </div>
      <RecipientFilterTable dataTable={dataTable} onFetch={onFetch} pagination={pagination} onEditData={handleEditData} />
      {modalName === 'filterDelivery' && (
        <FilterDeliveryModal
          isOpen={modalName === 'filterDelivery'}
          onClose={onResetModalName}
          useFilter={useFilter}
          onSetModalName={onSetModalName}
        />
      )}
      {modalName === 'previewDelivery' && (
        <PreviewDeliveryModal
          isOpen={modalName === 'previewDelivery'}
          onClose={onResetModalName}
          useFilter={useFilter}
          onSetModalName={onSetModalName}
          onFetch={onFetch}
          editData={editData}
        />
      )}
    </>
  )
}

export default FilterDelivery
