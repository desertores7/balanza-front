"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { navItems } from "../../app/Menu";
import { BiChevronRight } from "react-icons/bi";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import styles from "@styles/components/Sidebar.module.scss";
import { useAuthStore } from "@/core/store";

interface CustomCSS extends React.CSSProperties {
  '--top'?: string;
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuthStore();
  
  // Filtrar items según el rol del usuario
  const filteredNavItems = navItems.filter(item => !item.onlyRole || user?.role === item.onlyRole);
  
  // Calcular el índice inicial basado en la ruta actual (en el array filtrado)
  const getInitialIndex = () => {
    const currentIndex = filteredNavItems.findIndex(item => item.route === pathname);
    return currentIndex !== -1 ? currentIndex : 0;
  };

  // Obtener estado inicial del sidebar desde localStorage
  const getInitialOpenState = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-open');
      return saved !== null ? JSON.parse(saved) : true;
    }
    return true;
  };

  const [activeIndex, setActiveIndex] = useState<number>(getInitialIndex);
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [open, setOpen] = useState(getInitialOpenState);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Persistir el estado del sidebar en localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-open', JSON.stringify(open));
  }, [open]);

  // Sincronizar activeIndex cuando cambia la ruta o el usuario
  useEffect(() => {
    const currentIndex = filteredNavItems.findIndex(item => item.route === pathname);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [pathname, user?.role]);

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleClick = (id: string, hasDropdown: boolean, route?: string, index?: number) => {
    setActiveSub(null);
    if (hasDropdown) {
      toggleExpand(id);
    } else {
      setExpanded(null);

      if (index !== undefined) {
        setActiveIndex(index);
      }
      if (route) {
        router.push(route);
      }
    }
  };

  const handleSubClick = (childId: string, route?: string) => {
    setActiveSub(childId);
    if (route) {
      router.push(route);
    }
  };

  const menuStyle: CustomCSS = {
    '--top': `${activeIndex * 56}px`
  };

  return (
    <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
      <div className={styles.sidebarInnerContainer}>
        <button className={styles.buttonToggle} onClick={() => setOpen(!open)}>
          <IoIosArrowDropleftCircle fontSize={20} />
        </button>
        <div className={styles.inner}>
          <div className={styles.header} style={{ padding: open ? "0px 20px 20px 20px" : "0px 20px 0px 0px" }}>
            <svg 
              width={open ? 120 : 50} 
              height={open ? 86 : 60} 
              viewBox="0 0 413 218" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ transition: 'all 0.3s ease' }}
            >
              <path d="M261.79 217.7C253.832 217.724 245.995 215.743 239.005 211.94C232.014 208.137 226.093 202.635 221.79 195.94L206.28 171.94L190.76 195.94C186.449 202.617 180.533 208.107 173.554 211.908C166.574 215.71 158.753 217.702 150.805 217.702C142.857 217.702 135.036 215.71 128.057 211.908C121.077 208.107 115.161 202.617 110.85 195.94L3.00005 28.89C1.17093 26.0633 0.138007 22.7957 0.0100985 19.4312C-0.11781 16.0668 0.664028 12.7301 2.27325 9.77268C3.88248 6.81527 6.25952 4.3466 9.15398 2.62672C12.0484 0.90684 15.3532 -0.000582159 18.72 4.09173e-05H126.87C130.566 -0.00707881 134.205 0.915049 137.451 2.68166C140.698 4.44826 143.449 7.00266 145.45 10.11L206.33 104.36L267.2 10.11C269.202 7.00266 271.952 4.44826 275.199 2.68166C278.445 0.915049 282.084 -0.00707881 285.78 4.09173e-05H393.93C397.292 0.0019545 400.591 0.908693 403.482 2.62511C406.373 4.34153 408.748 6.80435 410.359 9.75515C411.97 12.7059 412.757 16.0359 412.638 19.3957C412.518 22.7555 411.497 26.0211 409.68 28.85L301.76 195.91C297.457 202.605 291.536 208.107 284.546 211.91C277.555 215.713 269.718 217.694 261.76 217.67L261.79 217.7ZM228.15 138.14L252.63 176.05C253.619 177.579 254.976 178.837 256.576 179.707C258.176 180.578 259.969 181.034 261.79 181.034C263.612 181.034 265.404 180.578 267.004 179.707C268.604 178.837 269.961 177.579 270.95 176.05L361 36.67H293.7L228.15 138.14ZM51.68 36.67L141.68 176.05C142.669 177.579 144.026 178.837 145.626 179.707C147.226 180.578 149.019 181.034 150.84 181.034C152.662 181.034 154.454 180.578 156.054 179.707C157.654 178.837 159.011 177.579 160 176.05L184.48 138.14L119 36.67H51.68Z" fill="url(#paint0_linear_2407_4221)"/>
              <defs>
                <linearGradient id="paint0_linear_2407_4221" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0BEEBF" />
                  <stop offset="50%" stopColor="#4C63E3" />
                  <stop offset="100%" stopColor="#0BEEBF" />
                  <animateTransform
                    attributeName="gradientTransform"
                    type="translate"
                    values="-0.2,0; 0.2,0; -0.2,0"
                    dur="6s"
                    repeatCount="indefinite"
                  />
                </linearGradient>
              </defs>
            </svg>

            {open && <h2 className={styles.sidebarTitle}>WeightFlow</h2>}
          </div>
          <nav
            className={styles.menu}
            style={menuStyle}
          >
            {filteredNavItems.map((item, index) => (
              <div key={index}>
                <button
                  className={`${activeIndex === index ? styles.active : ""}`}
                  type="button"
                  onClick={() => handleClick(item.id, !!item.dropdown, item.route, index)}
                >
                  <div className={styles.boxButton} style={{ justifyContent: open ? "flex-start" : "center" }}>
                    <item.Icon size={20} />
                    {open && <p>{item.label}</p>}
                  </div>
                  {open && item.dropdown && (
                    <BiChevronRight
                      fontSize={30}
                      style={{
                        transform: expanded === item.id ? "rotate(90deg)" : "rotate(0)",
                        transition: "transform 0.2s",
                      }}
                    />
                  )}
                </button>

                {item.dropdown && expanded === item.id && open && (
                  <div className={styles.submenu}>
                    {item.dropdown.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        className={`${styles.subItem} ${
                          activeSub === child.id ? styles.subActive : ""
                        }`}
                        onClick={() => handleSubClick(child.id)}
                      >
                        <span className={styles.dot}></span>
                        <span>{child.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}