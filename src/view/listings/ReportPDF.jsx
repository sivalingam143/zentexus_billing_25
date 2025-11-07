import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import fontBold from "../../assets/fonts/NotoSansTamil-Bold.ttf";
import fontRegular from "../../assets/fonts/NotoSansTamil-Regular.ttf";

// Register Tamil Font
Font.register({
  family: "NotoSansTamil",
  fonts: [
    { src: fontRegular, fontWeight: "normal" },
    { src: fontBold, fontWeight: "bold" },
  ],
});

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "#fff",
    fontFamily: "NotoSansTamil",
  },
  content: {
    paddingVertical: 10,
    fontFamily: "NotoSansTamil",
  },
  mainHeader: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
    color: "#222",
  },
  subHeader: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 10,
    color: "#555",
  },
  staffNameHeader: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 4,
    textTransform: "uppercase",
    color: "#004085",
    borderBottomWidth: 1,
    borderColor: "#004085",
    paddingBottom: 2,
  },
  staffTypeHeader: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0c5460",
    marginBottom: 6,
    marginTop: 10,
    borderLeft: "4px solid #17a2b8",
    paddingLeft: 6,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderColor: "#ccc",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    flex: 1, // ensures all columns take equal width
    borderWidth: 0.5,
    borderColor: "#ccc",
    fontSize: 9,
    paddingVertical: 6,
    paddingHorizontal: 8,
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  staffTotalRow: {
    marginTop: 6,
    padding: 8,
    backgroundColor: "#f2f2f2",
    borderTop: "1px solid #444",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  headerRow: {
    backgroundColor: "#f1f1f1",
    fontWeight: "bold",
    borderBottom: "1px solid #999",
  },
  
  totalRow: {
    backgroundColor: "#fcfcfc",
    fontWeight: "bold",
    borderTop: "0.75px solid #444",
  },
  
  staffTotalRow: {
    backgroundColor: "#e2f0d9",
    border: "1px solid #28a745",
    padding: 6,
    marginTop: 6,
    fontWeight: "bold",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  
});


const PDFReport = ({ data }) => {
  const transformData = (data) => {
    let transformed = {};
    let uniqueDatesSet = new Set();
    let grandTotal = { total_value: 0 };

    data.forEach((entry) => {
      const date = new Date(entry.entry_date).toLocaleDateString("en-GB");
      uniqueDatesSet.add(date);

      if (!transformed[entry.staff_name]) {
        transformed[entry.staff_name] = {};
      }

      if (!transformed[entry.staff_name][entry.staff_type]) {
        transformed[entry.staff_name][entry.staff_type] = {};
      }

      entry.products.forEach((product) => {
        if (!transformed[entry.staff_name][entry.staff_type][product.product_name]) {
          transformed[entry.staff_name][entry.staff_type][product.product_name] = {
            per_cooly_rate: product.per_cooly_rate,
            total: 0,
            total_count: 0,
            counts: {},
          };
        }

        transformed[entry.staff_name][entry.staff_type][product.product_name].counts[date] =
          (transformed[entry.staff_name][entry.staff_type][product.product_name].counts[date] || 0) + product.count;

        transformed[entry.staff_name][entry.staff_type][product.product_name].total += product.total;
        transformed[entry.staff_name][entry.staff_type][product.product_name].total_count += product.count;
        grandTotal.total_value += product.total;
      });
    });

    return {
      transformedData: transformed,
      uniqueDates: Array.from(uniqueDatesSet).sort(),
      grandTotal,
    };
  };



  const { transformedData, uniqueDates, grandTotal } = transformData(data || []);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.content}>
          <Text style={styles.mainHeader}>SRI GURULAKSHMI FIREWORKS INDUSTRIES</Text>
          <Text style={styles.subHeader}>Coolie Salary Report</Text>

          {Object.entries(transformedData).map(([staffName, staffTypes]) => {
            let staffTotal = 0;

            return (
              <>
                <Text style={styles.staffNameHeader}>Staff Name: {staffName}</Text>

                {Object.entries(staffTypes).map(([staffType, products]) => {
                  const productList = Object.entries(products);
                  let productNames = productList.map(([p]) => p);
                  let rowDates = uniqueDates;

                  return (
                    <>
                      <Text style={styles.staffTypeHeader}>Staff Type: {staffType}</Text>

                      {/* Header Row */}
                      <View style={styles.row}>
                        <Text style={styles.cell}>Date</Text>
                        {productNames.map((product) => (
                          <Text key={product} style={styles.cell}>{product}</Text>
                        ))}
                      </View>

                      {/* Date Rows */}
                      {rowDates.map((date) => (
                        <View key={date} style={styles.row}>
                          <Text style={styles.cell}>{date}</Text>
                          {productNames.map((product) => {
                            const count = products[product].counts[date] || 0;
                            return <Text style={styles.cell}>{count}</Text>;
                          })}
                        </View>
                      ))}

                      {/* Totals */}
                      <View style={styles.row}>
                        <Text style={styles.cell}>Total</Text>
                        {productNames.map((product) => (
                          <Text key={product} style={styles.cell}>
                            {products[product].total_count}
                          </Text>
                        ))}
                      </View>

                      <View style={styles.row}>
                        <Text style={styles.cell}>Rate</Text>
                        {productNames.map((product) => (
                          <Text key={product} style={styles.cell}>
                            {products[product].per_cooly_rate}
                          </Text>
                        ))}
                      </View>

                      <View style={styles.row}>
                        <Text style={styles.cell}>Coolie Total</Text>
                        {productNames.map((product) => {
                          const total = products[product].total.toFixed(2);
                          staffTotal += +total;
                          return <Text key={product} style={styles.cell}>{total}</Text>;
                        })}
                      </View>
                    </>
                  );
                })}

                {/* Staff Total */}
                <View style={styles.row}>
                  <Text style={[styles.cell, { fontWeight: "bold" }]}>Staff Total:</Text>
                  <Text style={[styles.cell, { fontWeight: "bold" }]}>₹ {staffTotal.toFixed(2)}</Text>
                </View>
              </>
            );
          })}

        </View>
        <View style={{ marginTop: 20, padding: 10, borderTop: '1px solid #000', textAlign: 'center' }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#155724' }}>
            OVERALL GRAND TOTAL: ₹ {grandTotal.total_value.toFixed(2)}
          </Text>
        </View>


      </Page>
    </Document>
  );
};

export default PDFReport;

