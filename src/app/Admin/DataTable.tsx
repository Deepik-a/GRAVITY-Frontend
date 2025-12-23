import React from 'react';
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Column<T> {
  header: string;
  render: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  totalItems: number;
}

const DataTable = <T extends { id: string | number }>({
  columns, data, currentPage, totalPages, onPageChange, itemsPerPage, totalItems 
}: DataTableProps<T>) => {
  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <table className="w-full text-left border-collapse">
        {/* Table Header - Increased to text-sm and tracking-wider */}
        <thead className="bg-gray-100 text-gray-700 uppercase text-sm font-bold border-b">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="p-5 tracking-wide">{col.header}</th>
            ))}
          </tr>
        </thead>

        {/* Table Body - Increased to text-base (16px) */}
        <tbody className="divide-y divide-gray-200">
          {data.length > 0 ? data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              {columns.map((col, i) => (
                <td key={i} className="p-5 text-base text-gray-900 font-medium">
                  {col.render(item)}
                </td>
              ))}
            </tr>
          )) : (
            <tr>
              <td colSpan={columns.length} className="p-16 text-center text-lg text-gray-400">
                No results found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Footer - Text increased to text-sm */}
      <div className="px-6 py-5 bg-gray-50 border-t flex items-center justify-between">
        <p className="text-sm text-gray-600 font-medium">
          Showing <span className="text-gray-900">{startIndex + 1}</span> to{" "}
          <span className="text-gray-900">{Math.min(startIndex + itemsPerPage, totalItems)}</span> of{" "}
          <span className="text-gray-900">{totalItems}</span> entries
        </p>

        <div className="flex gap-2">
          {/* Nav Buttons - Larger padding */}
          <button 
            disabled={currentPage === 1} 
            onClick={() => onPageChange(currentPage - 1)} 
            className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm"
          >
            <ChevronLeft size={20}/>
          </button>

          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i} 
                onClick={() => onPageChange(i + 1)} 
                className={`px-4 py-2 border rounded-lg text-sm font-bold transition shadow-sm ${
                  currentPage === i + 1 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages} 
            onClick={() => onPageChange(currentPage + 1)} 
            className="p-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm"
          >
            <ChevronRight size={20}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;