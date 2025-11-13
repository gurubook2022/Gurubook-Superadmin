import React from 'react'
import LangaugeChart from './_components/langauge-chart'
import { getLanguagesChartData } from './actions'

import { Title } from "@/components/ui/text";

export const revalidate = 0;

const page = async () => {
    const response = await getLanguagesChartData()
    return (
        <div className="space-y-4">
            <div className="flex sm:items-center flex-col sm:flex-row justify-between gap-2">
                <Title>User Count Per Language</Title>
            </div>
            <LangaugeChart data={response?.data?.getLanguagesChartData || []} />
        </div>
    )
}

export default page