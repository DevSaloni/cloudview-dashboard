// Initial Dashboard Data for CloudView Dashboard
// Categories and widgets matching the CNAPP Dashboard requirements and reference PDF

const dashboardData = {
  categories: [
    {
      id: "cat-cspm",
      name: "CSPM Executive Dashboard",
      shortName: "CSPM",
      widgets: [
        {
          id: "widget-cspm-1",
          name: "Cloud Accounts",
          text: "Connected: 2 | Not Connected: 2",
          type: "donut-accounts",
          categoryIds: ["cat-cspm"],
          data: {
            connected: 2,
            notConnected: 2,
            total: 2,
          },
        },
        {
          id: "widget-cspm-2",
          name: "Cloud Account Risk Assessment",
          text: "Failed: 1689 | Warning: 681 | Not Available: 36 | Passed: 7253",
          type: "donut-risk",
          categoryIds: ["cat-cspm"],
          data: {
            failed: 1689,
            warning: 681,
            notAvailable: 36,
            passed: 7253,
            total: 9659,
          },
        },
      ],
    },
    {
      id: "cat-cwpp",
      name: "CWPP Dashboard",
      shortName: "CWPP",
      widgets: [
        {
          id: "widget-cwpp-1",
          name: "Top 5 Namespace Specific Alerts",
          text: "No Graph data available!",
          type: "empty",
          categoryIds: ["cat-cwpp"],
          data: {},
        },
        {
          id: "widget-cwpp-2",
          name: "Workload Alerts",
          text: "No Graph data available!",
          type: "empty",
          categoryIds: ["cat-cwpp"],
          data: {},
        },
      ],
    },
    {
      id: "cat-registry",
      name: "Registry Scan",
      shortName: "Image",
      widgets: [
        {
          id: "widget-reg-1",
          name: "Image Risk Assessment",
          text: "1470 Total Vulnerabilities | Critical: 9, High: 150",
          type: "stacked-bar",
          categoryIds: ["cat-registry"],
          data: {
            total: 1470,
            totalLabel: "Total Vulnerabilities",
            segments: [
              { label: "Critical", value: 9, color: "#e11d48" },
              { label: "High", value: 150, color: "#f97316" },
              { label: "Medium", value: 310, color: "#eab308" },
              { label: "Low", value: 1001, color: "#94a3b8" },
            ],
          },
        },
        {
          id: "widget-reg-2",
          name: "Image Security Issues",
          text: "2 Total Images | Critical: 1, High: 1",
          type: "stacked-bar",
          categoryIds: ["cat-registry"],
          data: {
            total: 2,
            totalLabel: "Total Images",
            segments: [
              { label: "Critical", value: 1, color: "#e11d48" },
              { label: "High", value: 1, color: "#f97316" },
            ],
          },
        },
      ],
    },
    {
      id: "cat-ticket",
      name: "Ticket Management",
      shortName: "Ticket",
      widgets: [
        {
          id: "widget-tick-1",
          name: "Open Tickets",
          text: "Critical: 3 | High: 12 | Medium: 25 | Low: 8",
          type: "badge",
          categoryIds: ["cat-ticket"],
          data: {
            critical: 3,
            high: 12,
            medium: 25,
            low: 8,
          },
        },
        {
          id: "widget-tick-2",
          name: "Ticket Resolution Rate",
          text: "Resolved: 87% | Pending: 13%",
          type: "circular",
          categoryIds: ["cat-ticket"],
          data: {
            resolved: 87,
            pending: 13,
          },
        },
      ],
    },
  ],
};

export default dashboardData;
