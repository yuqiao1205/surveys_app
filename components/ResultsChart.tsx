'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ResultsChartProps {
  data: Record<string, number>;
}

export default function ResultsChart({ data }: ResultsChartProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name: name.length > 30 ? name.substring(0, 30) + '...' : name,
    fullName: name,
    responses: value,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45}
          textAnchor="end"
          height={100}
          interval={0}
        />
        <YAxis />
        <Tooltip 
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white border border-gray-300 rounded-lg p-3 shadow-lg">
                  <p className="text-gray-900 font-semibold">{payload[0].payload.fullName}</p>
                  <p className="text-blue-600">Responses: {payload[0].value}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        <Bar dataKey="responses" fill="#3B82F6" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}