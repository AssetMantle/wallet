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
    .token-info-section .info-box .line .info-heading{
    color: ${({theme}) => theme.infoHeadingColor};
    }
    .token-info-section .info-box:nth-child(2){
    border-right:2px solid ${({theme}) => theme.tableBorderColor};
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
    .modal-custom .modal-header{
     color: ${({theme}) => theme.lineValueColor};
    }
`;

