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
  MdAttachMoney,
  MdSwapHoriz,
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
import Despesas from "views/admin/despesas";
import CadastroDespesa from "views/admin/despesas/CadastroDespesa";
import Receitas from "views/admin/receitas";
import CadastroReceita from "views/admin/receitas/CadastroReceita";
import Movimentacoes from "views/admin/movimentacoes";
import CadastroMovimentacao from "views/admin/movimentacoes/CadastroMovimentacao";
import Categorias from "views/admin/categorias";
import CadastroCategoria from "views/admin/categorias/CadastroCategoria";

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
    name: "Nova Categoria",
    layout: "/admin",
    path: "/categorias/nova",
    component: CadastroCategoria,
  },
  {
    name: "Editar Categoria",
    layout: "/admin",
    path: "/categorias/editar/:id",
    component: CadastroCategoria,
  },
  {
    name: "Categorias",
    layout: "/admin",
    path: "/categorias",
    exact: true,
    icon: <Icon as={MdCategory} width='20px' height='20px' color='inherit' />,
    component: Categorias,
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
    name: "Nova Receita",
    layout: "/admin",
    path: "/receitas/nova",
    component: CadastroReceita,
  },
  {
    name: "Editar Receita",
    layout: "/admin",
    path: "/receitas/editar/:id",
    component: CadastroReceita,
  },
  {
    name: "Receitas",
    layout: "/admin",
    path: "/receitas",
    exact: true,
    icon: <Icon as={MdOutline10K} width='20px' height='20px' color='inherit' />,
    component: Receitas,
  },
  {
    name: "Nova Despesa",
    layout: "/admin",
    path: "/despesas/nova",
    component: CadastroDespesa,
  },
  {
    name: "Editar Despesa",
    layout: "/admin",
    path: "/despesas/editar/:id",
    component: CadastroDespesa,
  },
  {
    name: "Despesas",
    layout: "/admin",
    path: "/despesas",
    exact: true,
    icon: <Icon as={MdAttachMoney} width='20px' height='20px' color='inherit' />,
    component: Despesas,
  },
  {
    name: "Nova Movimentação",
    layout: "/admin",
    path: "/movimentacoes/nova",
    component: CadastroMovimentacao,
  },
  {
    name: "Editar Movimentação",
    layout: "/admin",
    path: "/movimentacoes/editar/:id",
    component: CadastroMovimentacao,
  },
  {
    name: "Movimentações",
    layout: "/admin",
    path: "/movimentacoes",
    exact: true,
    icon: <Icon as={MdSwapHoriz} width='20px' height='20px' color='inherit' />,
    component: Movimentacoes,
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
