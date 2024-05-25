import React from 'react'
import { Avatar, Layout, theme } from "antd";
const { Footer } = Layout;

const footerStyle = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#000000',
};

const FooterLayout = () => {
  return (
    <Footer style={footerStyle}>ClassRoom ©{new Date().getFullYear()}</Footer>
  )
}

export default FooterLayout