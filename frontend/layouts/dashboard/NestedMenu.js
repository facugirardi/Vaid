import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import FeatherIcon from "feather-icons-react";
import { useRouter } from 'next/navigation';



const NestedMenu = ({ menuItems }) => {
  const { push } = useRouter();
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    // Initialize openMenu state based on local storage or current location
    const storedOpenMenu = localStorage.getItem("openMenu");
    setOpenMenu(storedOpenMenu ? JSON.parse(storedOpenMenu) : null);
  }, []);

  const handleMenuClick = (submenu, label, e) => {
    e.stopPropagation();
    if (hasOpenedSubMenu(submenu, openMenu)) {
      setOpenMenu(null);
    } else {
      setOpenMenu(openMenu === label ? null : label);
    }
  };

  useEffect(() => {
    // Save openMenu state to local storage
    localStorage.setItem("openMenu", JSON.stringify(openMenu));
  }, [openMenu]);

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
        } else if (
          menuItem.submenu &&
          hasOpenedSubMenu(menuItem.submenu, openMenu)
        ) {
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
