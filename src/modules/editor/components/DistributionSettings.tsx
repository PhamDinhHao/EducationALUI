import { Button, DatePicker, Select } from 'antd'
import dayjs from 'dayjs'
import useFetchAddressOption from '@/modules/editor/hooks/useFetchAddressOption'
import { useBoundStore } from '@/shared/stores'
import { DELIVERY_TYPES, Measurement } from '@/modules/editor/core/enum/distribution-setting.enum'
import { useCallback, useEffect, useRef } from 'react'
import { DefaultOptionType } from 'antd/es/select'
import Quill from 'quill'

const DistributionSettings: React.FC = () => {
  const { addressOptions,emailOptions, signatureOptions } = useFetchAddressOption()
  const {
    addressToId,
    addressToType,
    fromAddress,
    deliveryType,
    hours,
    minutes,
    date,
    isClickMeasure,
    setIsClickMeasure,
    setAddressToId,
    setFromAddress,
    setDeliveryType,
    setDate,
    setHours,
    setMinutes,
    setAddressToType,
    setNameAddressTo,
    setNameFromAddress,
    setSignature
  } = useBoundStore()

  useEffect(() => {
    if(!fromAddress) {
      setFromAddress(emailOptions[0]?.value)
      setNameFromAddress(emailOptions[0]?.label || '')
    }
    if (emailOptions.length === 0) return;

    const targetAddress = fromAddress || emailOptions[0].value;
    const initialSignature = signatureOptions.find(sig => Number(sig.value) === Number(targetAddress));
    if (quillRef.current) {
      quillRef.current.root.innerHTML = initialSignature?.label || '';
      setSignature(initialSignature?.label || '');
    }
  }, [emailOptions, signatureOptions, fromAddress]);

  const quillRef = useRef<Quill | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current) {
      const container = editorRef.current.parentElement;
      const toolbars = container?.querySelectorAll('.ql-toolbar');
      toolbars?.forEach(toolbar => toolbar.remove());
      
      const editor = new Quill(editorRef.current, {
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['link'],
          ]
        },
        theme: 'snow'
      });
      
      editor.setText('');
      
      quillRef.current = editor;
      editor.on('text-change', () => {
        setSignature(editor.root.innerHTML);
      });
    }
    
    return () => {
      if (quillRef.current && editorRef.current) {
        quillRef.current.deleteText(0, quillRef.current.getLength());
        const container = editorRef.current.parentElement;
        const toolbar = container?.querySelector('.ql-toolbar');
        toolbar?.remove();
        quillRef.current = null;
      }
    }
  }, [])

  const handleEmailChange = useCallback((value: string, option: DefaultOptionType) => {
    setFromAddress(value);
    setNameFromAddress(String(option.label));
    
    const signature = signatureOptions.find(sig => sig.value === value);
    if (quillRef.current && signature) {
      quillRef.current.root.innerHTML = signature.label || '';
      setSignature(signature.label || '');
    }
  }, [signatureOptions])

  return (
    <div className='flex w-full flex-col gap-2 p-4'>
      {/* Address */}
      <label className='font-semibold' htmlFor='address'>
        宛先 <span className='text-red-700'>*</span>
      </label>
      <Select
        className='w-full'
        id='address'
        options={addressOptions}
        defaultValue={'全登録者'}
        value={addressOptions.find((opt) => opt.value === `${addressToType}_${addressToId}`)?.label || '全登録者'}
        onChange={(value, option: DefaultOptionType) => {
          const [type, id] = value.split('_');
          setAddressToId(id);
          setAddressToType(type);
          setNameAddressTo(String(option.label));
        }}
      />
      {/* From Address */}
      <label className='font-semibold' htmlFor='fromAddress'>
        送信元アドレス <span className='text-red-700'>*</span>
      </label>
      <Select
        className='w-full'
        id='fromAddress'
        options={emailOptions}
        defaultValue={emailOptions[0]?.label}
        value={emailOptions.find((opt) => opt.value === String(fromAddress))?.label || emailOptions[0]?.label}
        onChange={handleEmailChange}
      />
      <div className='font-sans'>
        <div className='mb-2 flex items-center'>
          <label className='font-semibold'>
            配信日時 <span className='text-red-700'>*</span>
          </label>
        </div>

        <div className='mb-4 flex gap-2'>
          <Button
            onClick={() => setDeliveryType(DELIVERY_TYPES.SCHEDULED)}
            className={`rounded border px-4 py-1.5 transition-colors duration-200 ${
              deliveryType === DELIVERY_TYPES.SCHEDULED
                ? 'border-red-500 text-red-500'
                : 'border-gray-300 text-gray-700 hover:border-gray-400'
            } `}
          >
            予約配信
          </Button>
          <Button
            onClick={() => setDeliveryType(DELIVERY_TYPES.IMMEDIATE)}
            className={`rounded border px-4 py-1.5 transition-colors duration-200 ${
              deliveryType === DELIVERY_TYPES.IMMEDIATE
                ? 'border-red-500 text-red-500'
                : 'border-gray-300 text-gray-700 hover:border-gray-400'
            } `}
          >
            即時配信
          </Button>
        </div>

        {deliveryType === DELIVERY_TYPES.SCHEDULED && (
          <div className='flex items-center gap-3'>
            <DatePicker
              value={date}
              onChange={(value) => setDate(value || dayjs())}
              format='YYYY/MM/DD'
              className='w-32'
              minDate={dayjs()}
            />

            <div className='flex items-center gap-1'>
              <Select
                value={String(hours).padStart(2, '0')}
                onChange={(value) => setHours(value)}
                className='w-16 rounded border-gray-300 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                options={Array.from({ length: 24 }, (_, i) => ({
                  value: String(i).padStart(2, '0'),
                  label: String(i).padStart(2, '0')
                }))}
              />
              <span className='text-gray-600'>時</span>
              <Select
                value={String(minutes).padStart(2, '0')}
                onChange={(value) => setMinutes(value)}
                className='w-16 rounded border-gray-300 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20'
                options={Array.from({ length: 60 }, (_, i) => ({
                  value: String(i).padStart(2, '0'),
                  label: String(i).padStart(2, '0')
                }))}
              />
              <span className='text-gray-600'>分</span>
            </div>
          </div>
        )}

        <div className='mb-2 mt-4 flex items-center'>
          <label className='font-semibold'>クリック測定</label>
        </div>

        <div className='mb-4 flex gap-2'>
          <Button
            onClick={() => setIsClickMeasure(Measurement.ON)}
            className={`rounded border px-4 py-1.5 transition-colors duration-200 ${
              isClickMeasure === Measurement.ON
                ? 'border-red-500 text-red-500'
                : 'border-gray-300 text-gray-700 hover:border-gray-400'
            } `}
          >
            測定する
          </Button>
          <Button
            onClick={() => setIsClickMeasure(Measurement.OFF)}
            className={`rounded border px-4 py-1.5 transition-colors duration-200 ${
              isClickMeasure === Measurement.OFF
                ? 'border-red-500 text-red-500'
                : 'border-gray-300 text-gray-700 hover:border-gray-400'
            } `}
          >
            測定しない
          </Button>
        </div>
        <div className='mb-2 mt-4 flex items-center'>
          <label className='font-semibold'>署名</label>
        </div>
        <div className="h-[300px] flex flex-col">
          <div ref={editorRef} className="flex-grow overflow-auto" />
        </div>
      </div>
    </div>
  )
}

export default DistributionSettings
