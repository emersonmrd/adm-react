// A diretiva "use client" é usada para indicar que este componente é executado no clinete (browser)
// Essa diretiva é específica para Next.js 13+ quando se utiliza a renderização no lado do cliente.
"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Definir o tipo dos dados esperados
interface ProductAreaChartProps {
  data: {
    month: string;
    products: number;
  }[];
}

const ProductAreaChart = ({ data }: ProductAreaChartProps) => {
  return (
    <div className="w-full h-96">
      <h2 className="text-base font-semibold text-gray-700 text-center">
        Produtos Cadastrados Mensalmente
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
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
          <Area
            type="monotone"
            dataKey="products"
            stroke="#3182CE"
            fill="#63B3ED"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductAreaChart;
