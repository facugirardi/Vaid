import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import FeatherIcon from "feather-icons-react";
import { useRouter } from 'next/navigation';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';

const NestedMenu = () => {
  const { data: user } = useRetrieveUserQuery();
  const [menuItems, setMenuItems] = useState([]);
  const [userType, setUserType] = useState(null);
  const { push } = useRouter();
  const [openMenu, setOpenMenu] = useState(null);

  const checkComplete = async () => {
    if (user?.id) {
      try {
        const response = await fetch(`http://localhost:8000/api/user/${user.id}/check-usertype`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch completion status');
        }

        const data = await response.json();
        setUserType(data.user_type);
      } catch (error) {
        console.error('An error occurred:', error);
      }
    }
  };

  useEffect(() => {
    checkComplete();
  }, [user]);

  useEffect(() => {
    if (userType === 1) {
      setMenuItems([
        { id: "home", label: "Home", icon: "ph-duotone ph-house", link: "/dashboard/home", dataPage: "home" },
        { id: "events", label: "Events", icon: "ph-duotone ph-calendar-blank", link: "/dashboard/activities/events", dataPage: "events" },
        { id: "tasks", label: "Tasks", icon: "ph-duotone ph-clipboard-text", link: "/dashboard/activities/tasks", dataPage: "tasks" },
        { id: "announcement-board", label: "Announcement Board", icon: "ph-duotone ph-megaphone", link: "/dashboard/activities/announcement-board", dataPage: "announcement-board" },
               { id: "e-learning", label: "E-Learning", icon: "ph-duotone ph-monitor-play", link: "/dashboard/e-learning", dataPage: "e-learning" },
             ]);
    } else {
      setMenuItems([
        { id: "home", label: "Home", icon: "ph-duotone ph-house", link: "/dashboard/home", dataPage: "home" },
        { id: "events", label: "Events", icon: "ph-duotone ph-calendar-blank", link: "/dashboard/activities/events", dataPage: "events" },
        { id: "tasks", label: "Tasks", icon: "ph-duotone ph-clipboard-text", link: "/dashboard/activities/tasks", dataPage: "tasks" },
        { id: "announcement-board", label: "Announcement Board", icon: "ph-duotone ph-megaphone", link: "/dashboard/activities/announcement-board", dataPage: "announcement-board" },
        {
          type: "HASHMENU", id: 1, label: "Human Resources", icon: "ph-duotone ph-users-three", dataPage: null, link: "#",
          submenu: [
            { id: "members-list", label: "Members List", icon: "ph-duotone ph-user-list", link: "/dashboard/hr/list", dataPage: "members-list" },
            { id: "add-members", label: "Add Members", icon: "ph-duotone ph-user-circle-plus", link: "/dashboard/hr/add-members", dataPage: "add-members" },
            { id: "candidates", label: "Candidates", icon: "ph-duotone ph-users", link: "/dashboard/hr/candidates", dataPage: "candidates" },
          ],
        },
        { id: "e-learning", label: "E-Learning", icon: "ph-duotone ph-monitor-play", link: "/dashboard/e-learning", dataPage: "e-learning" },
        { id: "analytics", label: "Analytics", icon: "ph-duotone ph-chart-bar", link: "/dashboard/analytics", dataPage: "analytics" },
        {
          type: "HASHMENU", id: 1, label: "Resources", icon: "ph-duotone ph-package", dataPage: null, link: "#",
          submenu: [
            { id: "inventory", label: "Inventory", icon: "ph-duotone ph-package", link: "/dashboard/resources/inv", dataPage: "inventory" },
            { id: "reg-don", label: "Register Donations", icon: "ph-duotone ph-hand-heart", link: "/dashboard/resources/reg-don", dataPage: "reg-don" },
            { id: "reg-ps", label: "Register Purchases/Sales", icon: "ph-duotone ph-tag", link: "/dashboard/resources/reg-ps", dataPage: "reg-ps" },
          ],
        },
      ]);
    }
  }, [userType]);

  useEffect(() => {
    // Initialize openMenu state based on local storage or current location
    const storedOpenMenu = localStorage.getItem("openMenu");
    setOpenMenu(storedOpenMenu ? JSON.parse(storedOpenMenu) : null);
  }, []);

  useEffect(() => {
    // Save openMenu state to local storage
    localStorage.setItem("openMenu", JSON.stringify(openMenu));
  }, [openMenu]);

  const handleMenuClick = (submenu, label, e) => {
    e.stopPropagation();
    if (hasOpenedSubMenu(submenu, openMenu)) {
      setOpenMenu(null);
    } else {
      setOpenMenu(openMenu === label ? null : label);
    }
  };

  const hasActiveLink = useCallback(
    (list) => {
      if (!list) return false;
      for (const menuItem of list) {
        if (menuItem.link === push.pathname) {
          return true;
        } else if (menuItem.submenu && hasActiveLink(menuItem.submenu)) {
          return true;
        }
      }
      return false;
    },
    [push.pathname]
  );

  const hasOpenedSubMenu = useCallback(
    (list, openMenu) => {
      if (!list) return false;
      for (const menuItem of list) {
        if (menuItem.label === openMenu) {
          return true;
        } else if (menuItem.submenu && hasOpenedSubMenu(menuItem.submenu, openMenu)) {
          return true;
        }
      }
      return false;
    },
    [openMenu]
  );

  const renderMenu = (items) => {
    return items.map((item, index) => {
      return (
        <li
          key={item.label + index}
          onClick={(e) => {
            item.type !== "HEADER" &&
              handleMenuClick(item.submenu, item.label, e);
          }}
          className={`pc-item ${item.type === "HEADER"
              ? "pc-caption"
              : item.type === "HASHMENU"
                ? "pc-hashmenu"
                : ""
            } ${openMenu === item.label || hasOpenedSubMenu(item.submenu, openMenu)
              ? "pc-trigger"
              : ""
            }
                    ${item.link === push.pathname || hasActiveLink(item.submenu) ? "active" : ""}`}
        >
          {item.type === "HEADER" && <label>{item.label}</label>}
          {item.type !== "HEADER" && (
            <Link href={item.link || "#"} className="pc-link">
              {item.icon && (
                <span className="pc-micon">
                  <i className={item.icon}></i>
                </span>
              )}
              <span className="pc-mtext">{item.label}</span>
              {item.submenu && (
                <span className="pc-arrow">
                  <FeatherIcon icon="chevron-right" />
                </span>
              )}
              {item.badge && <span className="pc-badge">{item.badge}</span>}
            </Link>
          )}
          {(openMenu === item.label || hasOpenedSubMenu(item.submenu, openMenu)) && (
            <ul
              className={`pc-submenu open`}
              style={{ display: "block" }}
              key={item.label}
            >
              {renderMenu(item.submenu || [])}
            </ul>
          )}
        </li>
      );
    });
  };

  return <>{renderMenu(menuItems)}</>;
};

export default NestedMenu;

