import dynamic from 'next/dynamic';
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form';

const QuillEditor = dynamic(() => import('@/components/ui/quill-editor'), {
    ssr: false,
});

const QuillInput = () => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    return (
        <div className='col-span-4'>
            <Controller
                name="content"
                control={control}
                render={({ field }) => (
                    <QuillEditor
                        {...field}
                        label="Notification Content"
                        error={errors?.content?.message as string}
                        onChange={(value) => field.onChange(value)}
                        value={field.value}
                    />
                )}
            />
        </div>
    )
}

export default QuillInput