import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
    padding: 5,
  },
  tableHeader: {
    fontWeight: "bold",
  },
  totalRow: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    fontWeight: "bold",
  },
  footer: {
    textAlign: "right",
    fontSize: 12,
    marginTop: 10,
    fontWeight: "bold",
  },
});

const CompanyReportPDF = ({ data }) => {
  // Calculate total salary
  const totalSalary = data.reduce((acc, item) => acc + item.salary, 0);

  const totalCols = 6; // S No, Staff Name, Total Days, Present Days, Absent Days, Salary
  const colWidth = `${100 / totalCols}%`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Company Report</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: colWidth }]}>
              <Text style={[styles.tableCell, styles.tableHeader]}>S No</Text>
            </View>
            <View style={[styles.tableCol, { width: colWidth }]}>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Staff Name
              </Text>
            </View>
            <View style={[styles.tableCol, { width: colWidth }]}>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Total Days
              </Text>
            </View>
            <View style={[styles.tableCol, { width: colWidth }]}>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Present Days
              </Text>
            </View>
            <View style={[styles.tableCol, { width: colWidth }]}>
              <Text style={[styles.tableCell, styles.tableHeader]}>
                Absent Days
              </Text>
            </View>
            <View style={[styles.tableCol, { width: colWidth }]}>
              <Text style={[styles.tableCell, styles.tableHeader]}>Salary</Text>
            </View>
          </View>

          {/* Table Body */}
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <View style={styles.tableRow} key={index}>
                <View style={[styles.tableCol, { width: colWidth }]}>
                  <Text style={styles.tableCell}>{index + 1}</Text>
                </View>
                <View style={[styles.tableCol, { width: colWidth }]}>
                  <Text style={styles.tableCell}>{item.staff_name}</Text>
                </View>
                <View style={[styles.tableCol, { width: colWidth }]}>
                  <Text style={styles.tableCell}>{item.total_days}</Text>
                </View>
                <View style={[styles.tableCol, { width: colWidth }]}>
                  <Text style={styles.tableCell}>{item.present_days}</Text>
                </View>
                <View style={[styles.tableCol, { width: colWidth }]}>
                  <Text style={styles.tableCell}>{item.absent_days}</Text>
                </View>
                <View style={[styles.tableCol, { width: colWidth }]}>
                  <Text style={styles.tableCell}>{item.salary}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <View style={[styles.tableCol, { width: "100%" }]}>
                <Text style={styles.tableCell}>No Data Found</Text>
              </View>
            </View>
          )}

          {/* Total Row */}
          {data.length > 0 && (
            <View style={[styles.tableRow, styles.totalRow]}>
              <View
                style={[
                  styles.tableCol,
                  { width: `${(totalCols - 1) * (100 / totalCols)}%` }, // Span all columns except last
                ]}
              >
                <Text style={[styles.tableCell, styles.tableHeader]}>
                  Total Salary:
                </Text>
              </View>
              <View style={[styles.tableCol, { width: colWidth }]}>
                <Text style={[styles.tableCell, styles.tableHeader]}>
                  {totalSalary}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <Text>Total Coolie: {totalSalary}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default CompanyReportPDF;
