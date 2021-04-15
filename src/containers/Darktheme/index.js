import React from 'react';
import {useDarkMode} from '../../components/darkmode/useDarkMode'
import {lightTheme, darkTheme} from '../../components/darkmode/theme';
import {GlobalStyles} from '../../components/darkmode/global';
import {Form} from "react-bootstrap";
import {ThemeProvider} from 'styled-components';
import {useTranslation} from "react-i18next";
import Icon from "../../components/Icon";

const Darktheme = () => {
    const {t} = useTranslation();
    const [theme, toggleTheme, componentMounted] = useDarkMode();
    const themeMode = theme === 'light' ? lightTheme : darkTheme;
    return (
        <ThemeProvider theme={themeMode}>
            <GlobalStyles/>
            <button onClick={toggleTheme} className="dark-mode-button">
                <Icon
                    viewClass="icon"
                    icon={theme === 'light' ? 'dayMode' : 'darkMode'}
                />
            </button>
                {/*<Form.Check*/}
                {/*    custom*/}
                {/*    onChange={toggleTheme}*/}
                {/*    type="switch"*/}
                {/*    id="custom-switch"*/}
                {/*    checked={theme === 'light' ? true : false}*/}
                {/*    label={theme === 'light' ? 'LightMode' : 'DarkMode'}*/}
                {/*/>*/}
        </ThemeProvider>
    );
};

export default Darktheme;
