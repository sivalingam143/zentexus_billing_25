import React from "react";
import { Table } from "react-bootstrap";

const TableUI = ({
  onClick,
  headers,
  body,
  className,
  showActionColumn = true,
  noRecordMessage = "No Record Found",
  showHeaders = true,
}) => {
  return (
    <Table responsive="md" className={className}>
      {showHeaders && (
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
            {showActionColumn && <th>Actions</th>}
          </tr>
        </thead>
      )}
      <tbody>
        {body && body.length > 0 ? (
          body.map((rowData, rowIndex) => (
            <tr
              key={rowData.key || rowIndex}
              onClick={onClick ? () => onClick(rowData) : undefined}
              style={onClick ? { cursor: "pointer" } : {}}
            >
              {rowData.values.map((rowValue, colIndex) => (
                <td
                  key={colIndex}
                  rowSpan={rowValue.rowspan || 1}
                  colSpan={rowValue.colspan || 1}
                >
                  {rowValue.content || rowValue}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr className="text-center">
            <td colSpan={headers.length + (showActionColumn ? 1 : 0)}>
              {noRecordMessage}
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default TableUI;
