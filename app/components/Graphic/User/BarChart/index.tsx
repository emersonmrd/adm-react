// A diretiva "use client" é usada para indicar que este componente é executado no clinete (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Definir o tipo dos dados esperados
interface UsersBarChartProps {
  data: {
    month: string;
    users: number;
  }[];
}

const UsersBarChart = ({ data }: UsersBarChartProps) => {
  return (
    <div className="w-full h-96">
      <h2 className="text-base font-semibold text-gray-700 text-center">
        Usuários Inscritos Mensalmente
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 0,
            left: -25,
            bottom: 25,
          }}
        >
          <CartesianGrid strokeDasharray="0" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="users" fill="#3182CE" barSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsersBarChart;
