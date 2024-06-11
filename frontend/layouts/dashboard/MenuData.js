const menuItems = [
    { id: "home", label: "Home", icon: "ph-duotone ph-house", link: "/dashboard/home", dataPage: "home" },
    { id: "events", label: "Events", icon: "ph-duotone ph-calendar-blank", link: "/dashboard/activities/events", dataPage: "events" },
    { id: "tasks", label: "Tasks", icon: "ph-duotone ph-clipboard-text", link: "/dashboard/activities/tasks", dataPage: "tasks" },
    { id: "announcement-board", label: "Announcement Board", icon: "ph-duotone ph-megaphone", link: "/dashboard/activities/announcement-board", dataPage: "announcement-board" },
    {
        type: "HASHMENU", id: 1, label: "Human Resources", icon: "ph-duotone ph-users-three", dataPage: null, link: "#",
        submenu: [
            { id: "members-list", label: "Members List", icon: "ph-duotone ph-user-list", link: "/dashboard/hr/list", dataPage: "members-list" },
            { id: "add-members", label: "Add Members", icon: "ph-duotone ph-user-circle-plus", link: "/dashboard/hr/add-members", dataPage: "add-members" },
            { id: "candidates", label: "Candidates", icon: "ph-duotone ph-users", link: "/dashboard/hr/candidates", dataPage: "candidates" }
    ]
    },
    { id: "e-learning", label: "E-Learning", icon: "ph-duotone ph-monitor-play", link: "/dashboard/e-learning", dataPage: "e-learning" },
    { id: "analytics", label: "Analytics", icon: "ph-duotone ph-chart-bar", link: "/dashboard/analytics", dataPage: "analytics" },
    {
        type: "HASHMENU", id: 1, label: "Resources", icon: "ph-duotone ph-package", dataPage: null, link: "#",
        submenu: [
            { id: "inventory", label: "Inventory", icon: "ph-duotone ph-package", link: "/dashboard/resources/inv", dataPage: "inventory" },
            { id: "reg-don", label: "Register Donations", icon: "ph-duotone ph-hand-heart", link: "/dashboard/resources/reg-don", dataPage: "reg-don" },
            { id: "reg-ps", label: "Register Purchases/Sales", icon: "ph-duotone ph-tag", link: "/dashboard/resources/reg-ps", dataPage: "reg-ps" },
    ]
    },
];

export { menuItems };