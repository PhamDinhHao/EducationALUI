import React, { useState } from 'react'
import { Table, Button } from 'antd'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons'
import toast from 'react-hot-toast'
import { dataSourcePluginCode } from '@/modules/editor/mocks/pluginCode'

const PlugInCode: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success('コピーしました')
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const columns = [
    {
      title: '差込みコード',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => (
        <div className="flex items-center gap-2">
          <span className="font-mono">{code}</span>
          <Button
            type='text'
            icon={copiedCode === code ? <CheckOutlined className="text-green-500" /> : 
                <CopyOutlined className="text-red-600" />}
            onClick={() => handleCopy(code)}
            size='small'
          />
        </div>
      )
    },
    {
      title: '項目名',
      dataIndex: 'name',
      key: 'name'
    }
  ]

  return (
    <div className="max-w-[800px] p-4">
      <div className="mb-4 text-sm text-gray-600">
        件名、代替テキストに差込みコードをコピー&ペーストして使用できます。
      </div>

      <Table dataSource={dataSourcePluginCode} columns={columns} pagination={false} bordered size='middle' />
    </div>
  )
}

export default PlugInCode
