"use client";

import { cn, handleGraphqlErrors } from '@/lib/utils';
import { notificationFormSchema, NotificationInput } from '@/validators/notification';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import toast from 'react-hot-toast';
import QuillInput from './quill-input';
import { FormProvider, useForm } from 'react-hook-form';
import { Button } from 'rizzui';
import NotificationFor from './notification-for';
import { useMutation } from '@apollo/client';
import { CREATE_NOTIFICATION } from '@/graphql/mutations';


const Form = () => {
    const methods = useForm<NotificationInput>({
        resolver: zodResolver(notificationFormSchema),
        defaultValues: {
            content: "",
        },
    });

    const [createNotification, { loading }] = useMutation(CREATE_NOTIFICATION)
    const onSubmit = async (data: NotificationInput) => {
        const { content, notificationFor } = data;
        const toastId = toast.loading("Creating Notification", {
            position: "bottom-left",
        });
        console.log({ content, notificationFor })
        try {
            await createNotification({
                variables: { content, notificationFor },
            });
        } catch (error: any) {
            handleGraphqlErrors(error);
        } finally {
            toast.dismiss(toastId);
        }
    };


    return (
        <div>
            <FormProvider {...methods}>
                <form onSubmit={methods?.handleSubmit(onSubmit)} className={cn(
                    "gap-2 sm:gap-6 grid grid-cols-4  @container [&_label.block>span]:font-medium"
                )}>
                    <div className='sm:col-span-2 lg:col-span-4 flex items-center justify-center'>
                        <NotificationFor />
                    </div>
                    <QuillInput />
                    <div className='sm:col-span-2 lg:col-span-4 flex items-center justify-center'>
                        <Button
                            type="submit"
                            color='primary'
                            className="btn btn-primary w-full max-w-sm"
                            disabled={loading}
                            isLoading={loading}>
                            Submit
                        </Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}

export default Form