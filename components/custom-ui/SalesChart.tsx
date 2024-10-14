"use client";

import {
	ResponsiveContainer,
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
} from "recharts";
const SalesChart = ({ data }: { data: any[] }) => {
	return (
		<ResponsiveContainer width="100%" height={300}>
			<LineChart
				data={data}
				className="w-full h-full"
				margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
			>
				<XAxis dataKey="name" />
				<YAxis />
				<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
				<Tooltip />
				<Line type="monotone" dataKey="sales" stroke="#8884d8" />
			</LineChart>
		</ResponsiveContainer>
	);
};

export default SalesChart;
