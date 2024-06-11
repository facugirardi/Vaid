const menuItems = [
    {
        label: "Navigation", type: "HEADER", //  HEADER , HASHMENU, ITEM(default)
    },
    {
        type: "HASHMENU", id: 1, label: "Dashboard", icon: "ph-duotone ph-gauge", badge: "2", dataPage: null, link: "#",
        submenu: [
            { id: "dashboard", label: "Dashboard", link: "/dashboard", dataPage: "dashboard" },
            { id: "affiliate", label: "Affiliate", link: "/affiliate-dashboard", dataPage: "Affiliate" },
        ]
    },

    // Other
    { label: "Activites", type: "HEADER" },
    { id: "events", label: "Events", icon: "ph-duotone ph-desktop", link: "/activities/events", dataPage: "events" },
    { id: "tasks", label: "Tasks", icon: "ph-duotone ph-desktop", link: "/activities/tasks", dataPage: "tasks" },
    { id: "announcement-board", label: "Announcement Board", icon: "ph-duotone ph-desktop", link: "/activities/announcement-board", dataPage: "announcement-board" }
];

export { menuItems };