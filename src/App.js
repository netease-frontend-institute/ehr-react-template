import React from 'react';
import { Layout, ConfigProvider, BackTop } from 'antd';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import { hot } from 'react-hot-loader/root';
import { Routes } from '@/router/tools';
import HeaderCustom from '@/components/header';
import FooterCustom from '@/components/footer';

const { Content } = Layout;

function App(props) {
    let lang = 'zh'; // antd语言类型
    const locale = lang === 'zh' ? zhCN : enUS; // antd组件国际化

    return (
        <Layout>
            <ConfigProvider locale={locale}>
                <HeaderCustom />
                <Content>
                    <Routes origin />
                </Content>
                <FooterCustom />
                <BackTop />
            </ConfigProvider>
        </Layout>
    );
}

export default hot(App);
