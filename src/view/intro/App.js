import React from 'react';
import { Layout, ConfigProvider, BackTop } from 'antd';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import Routes from '@/router/tools';
import { hot } from 'react-hot-loader';
import HeaderCustom from '@/components/header';
import FooterCustom from '@/components/footer';

const { Content } = Layout;

function App(props) {
    const lang = 'zh';
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

export default hot(module)(App);
