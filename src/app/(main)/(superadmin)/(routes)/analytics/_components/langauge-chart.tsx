"use client"
import React from 'react'
import SimpleBar from 'simplebar-react'

import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import useMedia from 'react-use/lib/useMedia';
import { LangaugeChartDataT } from '../../admins/types';
import { CustomTooltip } from '@/components/custom-tooltip';


interface LangaugeChartProps {
  data: LangaugeChartDataT[]
}
const LangaugeChart = ({ data }: LangaugeChartProps) => {
  const isTablet = useMedia('(max-width: 800px)', false);

  return (
    <div className='w-full'>
      <SimpleBar className='w-full'>
        <div className="h-96 w-full pt-9">
          <ResponsiveContainer
            width="100%"
            height="100%"
            {...(isTablet && { minWidth: '700px' })}
          >
            <AreaChart
              data={data}
              margin={{
                left: -16,
              }}
              className="[&_.recharts-cartesian-axis-tick-value]:fill-gray-500 rtl:[&_.recharts-cartesian-axis.yAxis]:-translate-x-12 [&_.recharts-cartesian-grid-vertical]:opacity-0"
            >
              <defs>
                <linearGradient id="count" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="8 10" strokeOpacity={0.435} />
              <XAxis
                dataKey="languageTitle"
                axisLine={false}
                tickLine={false}
                className=" "
              />
              <YAxis className=" " />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#count)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SimpleBar>
    </div>
  )
}

export default LangaugeChart