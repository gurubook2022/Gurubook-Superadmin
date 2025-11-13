import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import Select from "@/components/ui/select";
import { userTypeOptions } from '@/data/user-types';

const NotificationFor = () => {
    const {
        control,
        formState: { errors },
    } = useFormContext();
    return (
        <Controller
            name="notificationFor"
            control={control}
            render={({ field: { onChange, value } }) => (
                <Select
                    options={userTypeOptions}
                    value={value}
                    onChange={onChange}
                    className={"w-full max-w-sm"}
                    label="Notification For?"
                    error={errors?.notificationFor?.message as string}
                    getOptionValue={(option) => option.name}
                />
            )}
        />
    )
}

export default NotificationFor