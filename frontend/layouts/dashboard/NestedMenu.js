import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import FeatherIcon from "feather-icons-react";
import { useRouter } from 'next/navigation';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';

const NestedMenu = () => {
  const { data: user } = useRetrieveUserQuery();
  const [menuItems, setMenuItems] = useState([]);
  const [userType, setUserType] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [organizationId, setOrganizationId] = useState("");
  
  useEffect(() => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const pathSegments = url.pathname.split('/');
    const dashboardIndex = pathSegments.indexOf('dashboard');
    if (dashboardIndex !== -1 && pathSegments.length > dashboardIndex + 1) {
      setOrganizationId(pathSegments[dashboardIndex + 1]);
    }
  }, []);

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
        { id: "home", label: "Inicio", icon: "ph-duotone ph-house", link: `/dashboard/${organizationId}/home`, dataPage: "home" },
        { id: "events", label: "Eventos", icon: "ph-duotone ph-calendar-blank", link: `/dashboard/${organizationId}/events/view`, dataPage: "events" },
        { id: "view-tasks", label: "Tareas", icon: "ph-duotone ph-clipboard", link: `/dashboard/${organizationId}/tasks/view`, dataPage: "view-tasks" },
       ]);
    } else {
      setMenuItems([
        { id: "home", label: "Inicio", icon: "ph-duotone ph-house", link: `/dashboard/${organizationId}/home`, dataPage: "home" },
        {
          type: "HASHMENU", id: 1, label: "Tareas", icon: "ph-duotone ph-clipboard-text", dataPage: null, link: "#",
          submenu: [
            { id: "view-tasks", label: "Ver Tareas", icon: "ph-duotone ph-clipboard", link: `/dashboard/${organizationId}/tasks/view`, dataPage: "view-tasks" },
            { id: "create-tasks", label: "Crear Tareas", icon: "ph-duotone ph-file-plus", link: `/dashboard/${organizationId}/tasks/create`, dataPage: "create-tasks" },
          ],
        },
        {
          type: "HASHMENU", id: 1, label: "Eventos", icon: "ph-duotone ph-calendar", dataPage: null, link: "#",
          submenu: [
            { id: "view-events", label: "Ver Eventos", icon: "ph-duotone ph-calendar-blank", link: `/dashboard/${organizationId}/events/view`, dataPage: "view-events" },
            { id: "create-events", label: "Crear Eventos", icon: "ph-duotone ph-calendar-plus", link: `/dashboard/${organizationId}/events/create`, dataPage: "create-events" },
          ],
        },
        {
          type: "HASHMENU", id: 1, label: "Recursos Humanos", icon: "ph-duotone ph-users-three", dataPage: null, link: "#",
          submenu: [
            { id: "members-list", label: "Lista de Miembros", icon: "ph-duotone ph-user-list", link: `/dashboard/${organizationId}/hr/members`, dataPage: "members-list" },
            { id: "candidates", label: "Lista de Candidatos", icon: "ph-duotone ph-users", link: `/dashboard/${organizationId}/hr/candidates`, dataPage: "candidates" },
          ],
        },
        { id: "analytics", label: "Estadisticas", icon: "ph-duotone ph-chart-bar", link: `/dashboard/${organizationId}/statistics`, dataPage: "analytics" },
        {
          type: "HASHMENU", id: 1, label: "Recursos", icon: "ph-duotone ph-archive", dataPage: null, link: "#",
          submenu: [
            { id: "inventory", label: "Inventario", icon: "ph-duotone ph-package", link: `/dashboard/${organizationId}/inventory/general`, dataPage: "inventory" },
            { id: "headquarter-inv", label: "Inventario por Sede", icon: "ph-duotone ph-warehouse", link: `/dashboard/${organizationId}/inventory`, dataPage: "headquarter-inv" },
            { id: "transfer-prod", label: "Transferir Productos", icon: "ph-duotone ph-swap", link: `/dashboard/${organizationId}/inventory/transfer`, dataPage: "transfer-prod" },
          ],
        },
          {
          type: "HASHMENU", id: 1, label: "Operaciones", icon: "ph-duotone ph-coins", dataPage: null, link: "#",
          submenu: [
            { id: "reg-don", label: "Registrar Donaciones", icon: "ph-duotone ph-hand-heart", link: `/dashboard/${organizationId}/donations`, dataPage: "reg-don" },
            { id: "reg-ps", label: "Registrar Compras/Ventas", icon: "ph-duotone ph-tag", link: `/dashboard/${organizationId}/donations`, dataPage: "reg-ps" },
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
        if (menuItem.link === window.location.pathname) {
          return true;
        } else if (menuItem.submenu && hasActiveLink(menuItem.submenu)) {
          return true;
        }
      }
      return false;
    },
    []
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
      const handleClick = (e) => {
        e.preventDefault();
        if (item.link) {
          window.location.href = item.link;
        }
      };

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
                    ${item.link === window.location.pathname || hasActiveLink(item.submenu) ? "active" : ""}`}
        >
          {item.type === "HEADER" && <label>{item.label}</label>}
          {item.type !== "HEADER" && (
            <a href="#" className="pc-link" onClick={handleClick}>
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
            </a>
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
