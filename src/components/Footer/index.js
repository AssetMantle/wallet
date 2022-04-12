import React from 'react';
import icon from '../../assets/images/footer_logo.svg';
import whitepaper from '../../assets/images/whitepaper.pdf';
import Mailchimp from "./MailChimp";
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import Icon from "../Icon";
import styled from "styled-components";

const socialList = [
    {
        url: 'https://twitter.com/AssetMantle',
        iconName: 'twitter-logo',
        tooltip: 'twitter'
    },
    {
        url: 'https://t.me/assetmantlechat',
        iconName: 'telegram-plane',
        tooltip: 'telegram'
    },
    // {
    //     url: 'https://t.me/AssetMantleOne',
    //     iconName: 'announcements',
    //     tooltip: 'announcements'
    // }, 
    {
        url: 'https://discord.gg/BSdBQ4495d',
        iconName: 'discord',
        tooltip: 'discord'
    }, 
    // {
    //     url: 'https://www.reddit.com/r/AssetMantleOne/',
    //     iconName: 'reddit-round',
    //     tooltip: 'reddit'
    // }, 
    // {
    //     url: 'https://www.youtube.com/channel/UC5wqI1ZRdkCjWWVOCQdhxLQ/featured',
    //     iconName: 'youtube',
    //     tooltip: 'youtube'
    // }, 
    // {
    //     url: 'https://medium.com/AssetMantle-blog',
    //     iconName: 'medium-m',
    //     tooltip: 'medium'
    // }, 
    {
        url: 'https://www.linkedin.com/company/AssetMantleone/',
        iconName: 'linkedin-footer',
        tooltip: 'linkedIn'
    },
];

const Footer = () => {

    return (
        <>
            <section className="contact-section">
                <div className="container">

                </div>
            </section>
            <footer className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-md-12">
                            <div className="row m-0">
                                <div className="col-lg-4 col-md-6 col-sm-12 margin-t-20 ">
                                    <h6>About</h6>
                                    <div className="text-muted mt-30">
                                        <ul className="list-unstyled footer-list">
                                            <li><a href="https://AssetMantle.one/vision" rel="noopener noreferrer"
                                                target="_blank">Company</a></li>
                                            <li><a href="https://AssetMantle.one/roadmap" rel="noopener noreferrer"
                                                target="_blank">Roadmap</a></li>
                                            <li><a href={whitepaper} target="_blank"
                                                rel="noopener noreferrer">Protocol paper</a></li>
                                            <li><a href="https://AssetMantle.one/ecosystem" rel="noopener noreferrer"
                                                target="_blank">Ecosystem</a></li>
                                            <li><a href="https://AssetMantle.one/technology" rel="noopener noreferrer"
                                                target="_blank">Technology</a></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12 margin-t-20">
                                    <h6>Products</h6>
                                    <div className="text-muted mt-30">
                                        <ul className="list-unstyled footer-list">
                                            <li><a href="https://comdex.sg/" rel="noopener noreferrer"
                                                target="_blank">Comdex</a></li>
                                            <li><a href="https://audit.one/" rel="noopener noreferrer"
                                                target="_blank">Audit.one</a></li>
                                            <li><a href="https://twitter.com/pStakeFinance" rel="noopener noreferrer"
                                                target="_blank">pStake</a></li>
                                            <li><a href="https://twitter.com/AssetMantle" rel="noopener noreferrer"
                                                target="_blank">Asset Mantle</a></li>
                                            <li><p className="inactive" title="Coming Soon">pLend</p></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-lg-4 col-md-6 col-sm-12 margin-t-20">
                                    <h6>Get in touch</h6>
                                    <div className="text-muted mt-30 email">
                                        <a className="footer-text email"
                                            href="mailto:hello@assetmantle.one">hello@assetmantle.one</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-12 m-0 row">
                            <div className="contact-us">
                                <div>
                                    <div className="contact-box">
                                        <h6 className="title"> Subscribe to newsletter</h6>
                                        <div className="form-container mt-30">
                                            <p className="footer-text">Want to receive the latest updates?</p>
                                            <Mailchimp/>
                                        </div>
                                    </div>
                                    <div className="social-links-section">
                                        <h6>Follow us on</h6>
                                        <ul className="list-unstyled footer-list">
                                            {
                                                socialList.map((item, index) => (
                                                    <OverlayTrigger
                                                        key={index}
                                                        placement="bottom"
                                                        overlay={
                                                            <Tooltip id={`tooltip-${item.iconName}}`}>
                                                                {item.tooltip}
                                                            </Tooltip>
                                                        }
                                                    >
                                                        <a href={item.url} rel="noopener noreferrer"
                                                            target="_blank"><Icon viewClass="social_icon_imgg"
                                                                icon={item.iconName}/></a>
                                                    </OverlayTrigger>
                                                ))
                                            }

                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom-section">
                    <div className="footer-logo-section container ">
                        <FooterImageLogo className="dark-logo" src={icon} alt="icon-logo" title="logo"/>
                        <p className="copy-rights mb-sm-0">{new Date().getFullYear()} © AssetMantle</p>
                    </div>
                </div>
            </footer>
        </>
    );
};

const FooterImageLogo = styled.img`
filter: grayscale(100%);
`;

export default Footer;
