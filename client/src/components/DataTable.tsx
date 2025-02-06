export interface Column<T> {
	key: keyof T;
	header: string;
}

interface DataTableProps<T> {
	columns: Column<T>[];
	data: T[];
	onRowClick?: (row: T) => void;
	renderCell?: (key: keyof T, row: T) => React.ReactNode;
}

const DataTable = <T extends Record<string, any>>({
	columns,
	data,
	onRowClick,
	renderCell,
}: DataTableProps<T>): JSX.Element => {
	return (
		<table className="w-full">
			<thead className="bg-secondary-dark-7 sticky top-0">
				<tr>
					{columns.map((column) => (
						<th
							key={column.key as string}
							className="p-3 text-left font-semibold"
						>
							{column.header}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{data.map((row, rowIndex) => (
					<tr
						key={row.id || rowIndex}
						className={`border-b border-secondary-dark-7 hover:bg-secondary-dark-8 transition-all ${
							onRowClick ? "cursor-pointer" : ""
						}`}
						onClick={() => onRowClick?.(row)}
					>
						{columns.map((column) => (
							<td
								key={`${row.id || rowIndex}-${
									column.key as string
								}`}
								className="p-3"
								style={{ verticalAlign: "middle" }}
							>
								{renderCell
									? renderCell(column.key, row)
									: row[column.key]}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default DataTable;
