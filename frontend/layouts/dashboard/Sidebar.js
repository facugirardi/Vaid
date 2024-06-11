import Link from "next/link";
import React, { useEffect, useState } from "react";
import FeatherIcon from "feather-icons-react";
import { useRouter } from "next/router";
import { menuItems } from "./MenuData";

const Sidebar = () => {
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState<any>({});

  const handleMenuClick = (id) => {
    setOpenMenu((prevOpenMenu) => ({
      ...prevOpenMenu,
      [id]: !prevOpenMenu[id]
    }));
  };

  useEffect(() => {
    // Initialize openMenu state based on local storage or current location
    const storedOpenMenuString = localStorage.getItem("openMenu");
    const storedOpenMenu = storedOpenMenuString ? JSON.parse(storedOpenMenuString) : {};
    const initialOpenMenu = {};

    const checkSubmenu = (submenu) => {
      if (!submenu) return false;
      return submenu.some((subItem) => router.pathname.startsWith(subItem.link));
    };

    menuItems.forEach((menuItem) => {
      if (menuItem.submenu) {
        initialOpenMenu[menuItem.id] = checkSubmenu(menuItem.submenu);
        menuItem.submenu.forEach((subItem) => {
          if (subItem.submenu) {
            initialOpenMenu[subItem.id] = checkSubmenu(subItem.submenu);
          }
        });
      } else {
        initialOpenMenu[menuItem.id] = router.pathname === menuItem.link;
      }
    });

    setOpenMenu(initialOpenMenu);
  }, [router.pathname]);

  useEffect(() => {
    // Save openMenu state to local storage
    localStorage.setItem("openMenu", JSON.stringify(openMenu));
  }, [openMenu]);

  const isMenuActive = (menuItem) => {
    return router.pathname === menuItem.link;
  };

  return (
    <React.Fragment>
      {(menuItems || []).map((item, key) => (
        <React.Fragment key={key}>
          {/* {!item['isHeader'] ? */}
          {!item["isHeader"] ? (
            <>
              {!item.submenu ? (
                <>
                  <li
                    className={`pc-item ${isMenuActive(item) ? "active" : ""}`}
                  >
                    <Link
                      href={item.link && item.link}
                      data-page="index"
                      className="pc-link"
                    >
                      <span className="pc-micon">
                        <i className={`${item.icon}`}></i>
                      </span>
                      <span className="pc-mtext">{item.label}</span>
                      {item.badge ? (
                        <span className="pc-badge">{item.badge}</span>
                      ) : (
                        ""
                      )}
                    </Link>
                  </li>
                </>
              ) : (
                <React.Fragment>
                  <li
                    className={`pc-item pc-hasmenu ${openMenu[item.id] ||
                      item.submenu?.some((subItem) =>
                        isMenuActive(subItem)
                      )
                      ? "pc-trigger active"
                      : ""
                      }`}
                  >
                    <span
                      className="pc-link"
                      onClick={() => {
                        handleMenuClick(item.id);
                      }}
                    >
                      <span className="pc-micon">
                        <i className={`${item.icon}`}></i>
                      </span>
                      <span className="pc-mtext">{item.label}</span>
                      <span className="pc-arrow">
                        <FeatherIcon icon="chevron-right" />
                      </span>
                    </span>
                    <ul
                      // className="pc-submenu"
                      className={`pc-submenu ${openMenu[item.id] ? "open" : ""}`}
                      style={{
                        display: openMenu[item.id] ? "block" : "none"
                      }}
                    >
                      {(item.submenu || []).map((subItem, key) => (
                        !subItem.submenu ? (
                          <li
                            className={`pc-item ${isMenuActive(subItem) ? "active" : ""
                              }`}
                            key={key}
                          >
                            <Link
                              className="pc-link"
                              href={subItem.link || "#"}
                              data-page={subItem.dataPage}
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ) : (
                          <li
                            className={`pc-item ${isMenuActive(subItem) ? "active" : ""
                              }`}
                            key={key}
                          >
                            <Link
                              className="pc-link"
                              href={subItem.link || "#"}
                              data-page={subItem.dataPage}
                            >
                              aa{subItem.label}
                            </Link>
                            <ul className="pc-submenu" 
                            style={{
                              display: openMenu[item.id] ? "block" : "none"
                            }}>
                              {(subItem.submenu || []).map((childItem, key) => (
                                <li className="pc-item" key={key}>
                                  <Link className="pc-link" target="_blank" href="/pages/login-v1">
                                    {childItem.label}
                                  </Link></li>
                              ))}
                            </ul>
                          </li>
                        )
                      ))}
                    </ul>
                  </li>
                </React.Fragment>
              )}
            </>
          ) : (
            <React.Fragment>
              <li className="pc-item pc-caption">
                <label>{item.label}</label>
              </li>
            </React.Fragment>
          )}
        </React.Fragment>
      ))}
    </React.Fragment>
  );
};

export default Sidebar;
