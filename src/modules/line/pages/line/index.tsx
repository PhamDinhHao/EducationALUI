import React from 'react';
import { Image, Upload, Button } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { sendLine } from '@/modules/line/services/line.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { initFormLine, RegistrationLineSchema } from '@/modules/line/core/config/form/line';
import { TRegistrationLine } from '@/modules/line/core/config/form/line';
import { useForm } from 'react-hook-form';
import { FormField } from '@/shared/components/ui';
import useLine from '@/modules/line/hooks/useHandleLine';


const LinePage: React.FC = () => {
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors }
  } = useForm<TRegistrationLine>({
    resolver: zodResolver(RegistrationLineSchema),
    values: initFormLine,
    mode: 'all'
  })
  const {
    previewImage,
    fileList,
    setPreviewImage,
    setFileList,
    handlePreview,
    handleChange,
    addButton,
    handleDeleteButton
  } = useLine(getValues, setError, setValue)
  
  const onSubmitForm = async (data: TRegistrationLine) => {
    try {
      await sendLine(data);
      reset(initFormLine);
      setValue('file', new File([], ''));
      setFileList([]);
    } catch (error) {
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className='overflow-y-auto max-h-[calc(100vh-100px)]'>
      <div className='mx-auto w-full max-w-[900px] rounded-lg bg-gray-100 p-6 sm:mx-0 flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
          <div className='flex gap-2'>
            <FormField error={errors.content} label='テキスト' name='content' register={register} type='textarea' required={true} />
          </div>
        </div>

        <Upload
          listType='picture-card'
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          maxCount={1}
          accept='image/*'
          customRequest={({ file, onSuccess }) => {
            onSuccess?.(file);
          }}
        >
          {fileList.length < 1 && (
            <button className='border-0 bg-transparent' type='button'>
              <PlusOutlined />
              <div className='mt-2'>Upload</div>
            </button>
          )}
        </Upload>
        {errors.file && <p className='text-red-500'>{errors.file.message}</p>}
        {previewImage && <Image src={previewImage} preview={{ visible: !!previewImage, onVisibleChange: () => setPreviewImage('') }} />}

        <Button onClick={addButton} className='w-fit px-4 py-3' type='primary'>ボタンを追加</Button>

        <div className='space-y-6'>
          {watch('buttons').map((button, index) => (
            <div key={index} className='flex gap-2 items-center'>
              <div className='flex flex-col w-full gap-2'>
                <div className='flex gap-2'>
                  <FormField error={errors?.buttons?.[index]?.label} placeholder='ボタン' label='ラベル' name={`buttons[${index}].label`} register={register} type='text' required={true} />
                </div>
                <div className='flex gap-2'>
                  <FormField error={errors?.buttons?.[index]?.value} placeholder='https://www.google.com' label='値' name={`buttons[${index}].value`} register={register} type='text' required={true} />
                </div>
              </div>
              <div className='flex pb-1 self-end'>
                <Button type='primary' danger onClick={handleDeleteButton(button.id)}>
                  <DeleteOutlined />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-4 flex justify-end'>
          <Button type='primary' className='bg-blue-500' htmlType='submit'>メールを送信</Button>
        </div>
      </div>
    </form>
  );
};

export default LinePage;