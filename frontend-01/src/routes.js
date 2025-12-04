import React from "react";

import { Icon, layout } from "@chakra-ui/react";
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlinePeopleAlt,
  MdCategory,
  MdAccountBalance,
  MdOutlineShoppingCart,
  MdOutline10K,
} from "react-icons/md";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import ImportacaoNotas from "views/admin/importacaoNotas";
import Movimentacao from "views/admin/movimentacao";
import DataTables from "views/admin/dataTables";
import RTL from "views/admin/rtl";
import Pessoas from "views/admin/pessoas";
import Contas from "views/admin/contas";
import CadastroConta from "views/admin/contas/CadastroConta";

// Auth Imports
import SignInCentered from "views/auth/signIn";

const routes = [
  {
    name: "Home",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },

  {
    name: "Pessoas",
    layout: "/admin",
    path: "/pessoas",
    icon: <Icon as={MdOutlinePeopleAlt} width='20px' height='20px' color='inherit' />,
    component: Pessoas,
  },
  {
    name: "Categorias",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdCategory} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
  {
    name: "Nova Conta",
    layout: "/admin",
    path: "/contas/nova",
    component: CadastroConta,
  },
  {
    name: "Editar Conta",
    layout: "/admin",
    path: "/contas/editar/:id",
    component: CadastroConta,
  },
  {
    name: "Contas",
    layout: "/admin",
    path: "/contas",
    exact: true,
    icon: <Icon as={MdAccountBalance} width='20px' height='20px' color='inherit' />,
    component: Contas,
  },
  {
    name: "Receitas",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdOutline10K} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
  {
    name: "Despesas",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
  {
    name: "Movimentações",
    layout: "/admin",
    path: "/movimentacoes",
    icon: <Icon as={MdHome  } width='20px' height='20px' color='inherit' />,
    component: Movimentacao,
  },
  {
    name: "Importação de Notas",
    layout: "/admin",
    path: "/importacao-notas",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: ImportacaoNotas
  },
  {
    name: "NFT Marketplace",
    layout: "/admin",
    path: "/nft-marketplace",
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width='20px'
        height='20px'
        color='inherit'
      />
    ),
    component: NFTMarketplace,
    secondary: true,
  },
  {
    name: "Data Tables",
    layout: "/admin",
    icon: <Icon as={MdBarChart} width='20px' height='20px' color='inherit' />,
    path: "/data-tables",
    component: DataTables,
  },
  {
    name: "Profile",
    layout: "/admin",
    path: "/profile",
    icon: <Icon as={MdPerson} width='20px' height='20px' color='inherit' />,
    component: Profile,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdLock} width='20px' height='20px' color='inherit' />,
    component: SignInCentered,
  },
  {
    name: "RTL Admin",
    layout: "/rtl",
    path: "/rtl-default",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: RTL,
  },
];

export default routes;
