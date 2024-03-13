frappe.query_reports["PMS Working"] = {
  filters: [
    // Define your filters here
  ],
  formatter: function (value, row, column, data, default_formatter) {
    if (column.id === "appraisee") {
      switch (value) {
        case "Pending":
          value = `<span style='color:#ef233c; font-weight: bold;'>${value}</span>`;
          break;
        case "Submitted":
          value = `<span style='color:#008000; font-weight: bold;'>${value}</span>`;
          break;
        // Add more cases for other statuses if needed
        default:
          // No formatting for other statuses
          break;
      }
    }
    if (column.id === "appraiser") {
      switch (value) {
        case "Pending":
          value = `<span style='color:#ef233c; font-weight: bold;'>${value}</span>`;
          break;
        case "Submitted":
          value = `<span style='color:#008000; font-weight: bold;'>${value}</span>`;
          break;
        // Add more cases for other statuses if needed
        default:
          // No formatting for other statuses
          break;
      }
    }
    if (column.id === "skip") {
      switch (value) {
        case "Pending":
          value = `<span style='color:#ef233c; font-weight: bold;'>${value}</span>`;
          break;
        case "Submitted":
          value = `<span style='color:#008000; font-weight: bold;'>${value}</span>`;
          break;
        case "Appraiser-Final":
          value = `<span style='color:#1DA1F2; font-weight: bold;'>${value}</span>`;
          break;
        // Add more cases for other statuses if needed
        default:
          // No formatting for other statuses
          break;
      }
    }

    return value;
  },
};
