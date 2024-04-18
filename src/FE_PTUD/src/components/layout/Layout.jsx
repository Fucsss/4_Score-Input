import React from 'react'
import HeaderLayout from "./HeaderLayout";
import FooterLayout from "./FooterLayout";
import { Layout } from "antd";
import SiderLayout from './SiderLayout';
import { Outlet } from 'react-router-dom';

const layoutStyle = {
  overflow: 'hidden',
  width: '100vw',
  height: '100vh',
  
};

function MainLayout() {
  return (
    <Layout style={layoutStyle}>
      <HeaderLayout />
      <Layout>
        <SiderLayout />
        <Outlet />
      </Layout>
      <FooterLayout />
    </Layout>
  );
}

export default MainLayout;
