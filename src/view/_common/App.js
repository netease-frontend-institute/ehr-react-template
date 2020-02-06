import React from 'react';
import { Layout, ConfigProvider, BackTop } from 'antd';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import { hot } from 'react-hot-loader';
import HeaderCustom from '@/components/header';
import ContentCustom from '@/components/content';
import FooterCustom from '@/components/footer';

function App(props) {
    const lang = 'zh';
    const locale = lang === 'zh' ? zhCN : enUS; // antd组件国际化

    return (
        <Layout>
            <ConfigProvider locale={locale}>
                <HeaderCustom />
                <ContentCustom />
                <FooterCustom />
                <BackTop />
            </ConfigProvider>
        </Layout>
    );
}

export default hot(module)(App);
