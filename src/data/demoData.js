export const demoProjects = [
{
id: "J-1001",
title: "High St Apartments",
client: "CityBuild Pty Ltd",
status: "Active",

```
trades: [
  {
    id: "T-PLUMB",
    name: "Plumbing",
    contractor: "YDIG Relining",
    status: "Approved",

    milestonesPaid: [
      { id: "M1", title: "Deposit", amount: 84000, paidOn: "2025-08-03" },
      { id: "M2", title: "Rough-in", amount: 84000, paidOn: "2025-08-18" },
    ],

    milestonesTodo: [
      { id: "M3", title: "Fit-off", amount: 84000, due: "2025-09-05", status: "Scheduled" },
      { id: "M4", title: "Testing", amount: 84000, due: "2025-09-20", status: "Scheduled" },
      { id: "M5", title: "Completion", amount: 84000, due: "2025-10-01", status: "Scheduled" },
    ],

    variations: [
      { id: "V1", title: "Extra risers", amount: 18000, status: "Pending" }
    ]
  },

  {
    id: "T-ELEC",
    name: "Electrical",
    contractor: "SparkPro Electrical",
    status: "Approved",

    milestonesPaid: [
      { id: "E1", title: "Mobilisation", amount: 42000, paidOn: "2025-08-06" }
    ],

    milestonesTodo: [
      { id: "E2", title: "Rough-in", amount: 68000, due: "2025-09-03", status: "Scheduled" },
      { id: "E3", title: "Fit-off", amount: 68000, due: "2025-09-22", status: "Scheduled" }
    ],

    variations: []
  },

  {
    id: "T-HVAC",
    name: "HVAC",
    contractor: "CoolAir Mechanical",
    status: "Pending",

    milestonesPaid: [],

    milestonesTodo: [
      { id: "H1", title: "Design", amount: 18000, due: "2025-09-10", status: "Pending" },
      { id: "H2", title: "Install", amount: 98000, due: "2025-10-05", status: "Scheduled" }
    ],

    variations: []
  }
]
```

}
];
