import { LuClipboardCheck, LuLayoutDashboard, LuLogOut, LuSquarePlus, LuUser } from "react-icons/lu";


export const SIDE_BAR_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/admin/dashboard",
    },
    {
        id: "02",
        label: "Manage Task",
        icon: LuClipboardCheck,
        path: "/admin/tasks",
    },
    {
        id: "04",
        label: "Team Member",
        icon: LuUser,
        path: "/admin/users",
    },
    {
        id: "05",
        label: "Logout",
        icon: LuLogOut,
        path: "/login",
    },
];



export const USER_SIDE_BAR_DATA = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/user/dashboard",
    },
    {
        id: "02",
        label: "My Task",
        icon: LuClipboardCheck,
        path: "/user/my-tasks",
    },
    {
        id: "05",
        label: "Logout",
        icon: LuLogOut,
        path: "/login",
    },
];


export const STATUS_DATA = [
    {label: "Pending", value: "Pending"},
    {label: "In_Progress", value: "In_Progress"},
    {label: "Completed", value: "Completed"},
];

export const PRIORITY_DATA = [
    {label: "Low", value: "Low"},
    {label: "Medium", value: "Medium"},
    {label: "High", value: "High"},
];