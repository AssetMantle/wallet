import {createGlobalStyle} from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({theme}) => theme.bodyBackground};
  }
   .txns-container .MuiPaper-root{
    background-color: ${({theme}) => theme.tableBackground} !important;
    border: 1px solid ${({theme}) => theme.tableBorderColor} !important;
   }
   .validators-section table{
    border: 1px solid ${({theme}) => theme.tableBorderColor} !important;
    }
   .txns-container table thead, .validators-section table thead{
    border-bottom: 1px solid ${({theme}) => theme.tableBorderColor} !important;
    }
    //   .validators-section table tbody tr{
    // border-bottom: 1px solid ${({theme}) => theme.tableBorderColor} !important;
    // }
    
    .wallet-main-section .tabs-section .nav-tabs{
      border: 1px solid ${({theme}) => theme.tableBorderColor} !important;  
    }           
    .wallet-main-section .tabs-section .nav-tabs .nav-link:nth-child(2){
        border-left: 1px solid ${({theme}) => theme.tableBorderColor} !important;
    border-right: 1px solid ${({theme}) => theme.tableBorderColor} !important;
    }
    .wallet-main-section .send-container, .wallet-main-section .receive-container{
    border: 1px solid ${({theme}) => theme.tableBorderColor} !important;  
    }
    .wallet-main-section .tabs-section .nav-tabs .nav-link.active{
        color: ${({theme}) => theme.activeTabTextColor};
    }
    .wallet-main-section .tabs-section .nav-tabs .nav-link:focus, .wallet-main-section .tabs-section .nav-tabs .nav-link:hover,
    .wallet-main-section .tabs-section .nav-tabs .nav-link.active{
    border-bottom: 2px solid ${({theme}) => theme.activeTabBorderColor};
    }
    .wallet-main-section .txns-container table thead th, .validators-section table thead th{
        border-color: ${({theme}) => theme.tableRowBorder};
    }
    .wallet-main-section .txns-container table tbody td, .validators-section table tbody td{
    border-color: ${({theme}) => theme.tableRowBorder};
    }
    .token-info-section .info-heading{
    color: ${({theme}) => theme.infoHeadingColor};
    }
    .token-info-section .info-box{
    border-color:${({theme}) => theme.tableBorderColor};
    }
    .tab-header .left .nav-pills .nav-link{
      border-color:${({theme}) => theme.tableBorderColor};
    }
    .token-info-section .info-box .line .value{
     color: ${({theme}) => theme.lineValueColor};
    }
    .header{
        border-bottom: 1px solid ${({theme}) => theme.bodyBackground};
    }
    .wallet-main-section .txns-container .pagination-custom{
     background-color: ${({theme}) => theme.tableBackground} !important;
    }
    .validators-section{
   border-top: 1px solid ${({theme}) => theme.tableBorderColor} !important;  
    }
    .form-field .label {
    color: ${({theme}) => theme.labelColor} !important;
    }
    .modal-content{
        background-color: ${({theme}) => theme.tableBackground} !important; 
    }
    .modal-custom .modal-header, .create-wallet-modal.seed .modal-header .heading{
     color: ${({theme}) => theme.lineValueColor};
    }
    .pagination-custom .buttons button svg{
      fill:${({theme}) => theme.paginationIconColor};
    }
   .pagination-custom .buttons button:disabled svg,
    .pagination-custom .buttons button[disabled] svg{
      fill:${({theme}) => theme.paginationDisabledIconColor};
    }
    .validators-section table tbody .voting{
     color: ${({theme}) => theme.votingPowerColor};
    }
    .validators-section table thead th span button .MuiButton-label div{
    color:#8D9CB5 !important;
    }
    .validators-section .info .info-name{
    color: ${({theme}) => theme.infoHeadingColor};
    }
    .actions-modal .actions-modal-body .moniker-box .info .name{
     color: ${({theme}) => theme.infoHeadingColor};
    }
    .actions-modal .actions-modal-body .moniker-box .info .commission,
    .actions-modal .actions-modal-body .website .name,
    .advanced-wallet-accordion .card .card-header p,
    .fee{
     color: ${({theme}) => theme.infoHeadingColor};
    }
    .validators-list-selection{
     color: ${({theme}) => theme.lineValueColor};
    }
    .form-control, .validators-list-selection, .claim-rewards-modal .rewards-modal-body input{
        background-color: ${({theme}) => theme.inputBackground} !important;
    }
    .list-modal-body .unbonding-schedule-list p{
      color: ${({theme}) => theme.infoHeadingColor};
    }   
    .claim-rewards-modal .rewards-modal-body .available-tokens .tokens{
     color: ${({theme}) => theme.lineValueColor};
    }
    .refresh-button svg{
        fill:${({theme}) => theme.refreshButtonColor} !important;
    }
    .form-field .info-data .value{
     color: ${({theme}) => theme.lineValueColor};
    }
    .wallet-main-section .receive-container .address{
    color: ${({theme}) => theme.lineValueColor};
    }
    .faq-modal-body .nav-pills .box .nav-link{
     border-color: ${({theme}) => theme.modalBorderColor};
    }
    .faq-modal-body .nav-pills .box p{
     color: ${({theme}) => theme.lineValueColor};
    }
    .faq-modal-body .accordion .card{
        border-color: ${({theme}) => theme.modalBorderColor};
    }
    .faq-modal-body .accordion .card-header p{
      color: ${({theme}) => theme.lineValueColor};
    }
    .faq-modal-body .accordion .card-body p{
        color: ${({theme}) => theme.lineValueColor};
    }
    .claim-rewards-modal .rewards-modal-body .available-tokens .usd{
    color: ${({theme}) => theme.lineValueColor};
    }
    .navigate-buttons .button-secondary, .modal-header .previous-section .button{
     background: ${({theme}) => theme.backButtonBgColor};
    }
    .navigate-buttons .button-secondary .icon, .modal-header .previous-section .button .icon{
    fill:${({theme}) => theme.refreshButtonColor} !important;
    }
    .header .profile-section .profile-dropdown .dropdown-menu{
     background: ${({theme}) => theme.tableBackground};
      border-color: ${({theme}) => theme.profileDropDownBorder};
    }
    .header .profile-section .profile-dropdown .dropdown-menu .dropdown-footer{
     border-color: ${({theme}) => theme.profileDropDownBorder};
    }
    .header .profile-section .profile-dropdown .dropdown-menu .dropdown-footer p:first-child{
     border-color: ${({theme}) => theme.profileDropDownBorder};
    }
    .note-section{
    background: ${({theme}) => theme.noteBackground};
    }
      .note-section p{
    color: ${({theme}) => theme.noteFontColor};
    }
    .header .profile-section .profile-dropdown .dropdown-menu .dropdown-footer .generate-keystore{
       color: ${({theme}) => theme.lineValueColor};
    }
    .modal-header button.close{
     color: ${({theme}) => theme.lineValueColor};
    }
`;

