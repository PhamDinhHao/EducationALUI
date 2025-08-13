import MyTemplateTable from '@/modules/editor/components/Table/MyTemplateTable'
import { useMyTemplates } from '@/modules/editor/hooks/useMyTemplates'
import { TemplateType } from '@/modules/editor/core/enum/distribution-setting.enum'

const MyTemplates: React.FC = () => {
  const { dataSource, pagination, setPagination } = useMyTemplates(TemplateType.TEXT)


  return <MyTemplateTable dataTable={dataSource} pagination={pagination} setPagination={setPagination} />
}

export default MyTemplates
