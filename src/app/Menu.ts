import { BiUser, BiBriefcaseAlt, BiCar, BiPackage, BiBarChartAlt2, BiCog  } from "react-icons/bi";
import { NavItem } from "@/core/types/sidebar";
import { LiaWeightSolid } from "react-icons/lia";


export const navItems: NavItem[] = [
  // { id: "Dashboard", label: "Dashboard", Icon: BiHomeSmile },
  // {
  //   id: "eCommerce",
  //   label: "eCommerce",
  //   Icon: BiCartAlt,
  //   dropdown: [
  //     { id: "products", label: "Products" },
  //     { id: "orders", label: "Orders" },
  //   ],
  // },
  // { id: "Calendar", label: "Calendar", Icon: BiCalendar },
  {
    id: "dashboard",
    label: "Dashboard",
    route: "/dashboard",
    mainRoute: "metrics/weights-users", //ruta para la petición
    tableKey: "dashboard", //key para el store de las tablas
    onlyRole:"Administrador", //1 para admin, 2 para usuario
    Icon: BiBarChartAlt2 ,
  },
  {
    id: "pesajes",
    label: "Pesajes",
    route: "/pesaje",
    mainRoute: "weighings",
    tableKey: "weighings",
    Icon: LiaWeightSolid,
  },
  {
    id: "usuarios",
    label: "Usuarios",
    route: "/usuarios",
    mainRoute: "users",
    tableKey: "users",
    onlyRole:"Administrador", //1 para admin, 2 para usuario
    Icon: BiUser,
  },
  {
    id: "clientes",
    label: "Clientes",
    route: "/clientes",
    mainRoute: "clients",
    Icon: BiBriefcaseAlt ,
    tableKey: "clients",
  },
  {
    id: "vehiculos",
    label: "Vehiculos",
    route: "/vehiculos",
    mainRoute: "vehicles",
    Icon: BiCar,
    tableKey: "vehicles",
  },
  {
    id: "productos",
    label: "Productos",
    route: "/productos",
    mainRoute: "products",
    Icon: BiPackage,
    tableKey: "products",
  },
  {
    id: "configuraciones",
    label: "Configuracion",
    route: "/configuracion",
    Icon: BiCog,
    tableKey: "configurations",
    onlyRole:"Administrador", //1 para admin, 2 para usuario
  },
];