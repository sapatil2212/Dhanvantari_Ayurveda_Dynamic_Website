"use client";
import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts';

type Point = { name: string; patients: number; inpatient: number };

export default function PatientStatistics({ data }: { data: Point[] }) {
  return (
    <Card className="lg:col-span-2 shadow-sm">
      <CardContent className="p-4">
        <div className="mb-2 text-sm font-medium text-gray-700">Patient Statistics</div>
        <ChartContainer
          config={{ patients: { label: 'Patients', color: '#0ea5e9' }, inpatient: { label: 'Inpatient', color: '#22c55e' } }}
          className="h-64"
        >
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line type="monotone" dataKey="patients" stroke="var(--color-patients)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="inpatient" stroke="var(--color-inpatient)" strokeWidth={2} dot={false} />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}


