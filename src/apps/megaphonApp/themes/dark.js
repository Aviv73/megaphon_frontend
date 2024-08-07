import { elementService } from "../../common/modules/common/services/element.service"

const em = elementService._.em;

export default {
  name: 'dark',
  class: 'dark-theme',
  colors: ['#cbcbcb', '#000000', 'white', '#505050', '#2090D4', 'rgba(147,214,254,.3)'],
  fonts: [],
  css: elementService.dataToCss('.megaphon-app.dark-theme', {
    '.table-item-preview': {
      color: 'white',
      '&:nth-child(odd)': {
        'background-color': '#6c6c6c'
      },
      '&:nth-child(even)': {
        'background-color': 'rgb(37, 37, 37)'
      },
      '&.table-header': {
        'background-color': 'white',
        color: 'black'
      }
    },
    'input, select, textarea': {
      'background-color': 'rgba(255, 255, 255, 0.2)',
       color: 'white'
    },
    '.app-form-styling': {
      'input, textarea': {
        'background-color': '#4d4d4d',
        // color: white;
        '&::placeholder, .placeholder': {
          color: 'rgba(255, 255, 255, 0.6)'
        }
      },
      '.select': {
        'background-color': '#4d4d4d !important',
        color: 'white',
        '.drop-down': {
          color: '#0084D4'
        } 
      }
    },


    '.logged-user-preview': {
      '.avatar': {
        'background-color': 'var(--clr-4)'
      }
    },
    '.table-action-btns': {
     ' .delete-mini-btn': {
       ' background-color': '#fff',
        'border-radius': '50%',
        'padding': em(1)
      }
    },

    '.sidebar-container': {
      color: '#cecece',
      '.main-sidebar': {
        // .organization-preview {
        //   .nav-list-item {
        //     &:hover {
        //       background-color: lighten($color: #2090D4, $amount: 20%) !important;
        //     }
        //   }
  
        //   &.selected {
        //     .org-header {
        //       background-color: var(--clr-4);
        //       // color: var(--clr-4)
        //       color: white
        //     }
        //     .router-link-active {
        //       background-color: rgba(147, 214, 254, 0.3);
        //       color: var(--clr-4);
        //     }
        //   }
        // }
        '.nav-list-item': {
          'border-bottom': `${em(0.5)} solid #003d5e`
        },
  
        // @media (max-width: $small-screen-breake) {
        //   // .main-sidebar {
        //     background-color: var(--clr-2);
        //   // }
        // }
      }
      // .toggle-btn {
      //   color: var(--clr-0);
      // }
    },
    '.release-distribute': {
      '.add-all-btn-img': {
        '&.reg': { display: 'none' },
        '&.dark': { display: 'unset' }
      }
    }
  })
}

// $dark-theme-header-clr: white;
// $dark-theme-body-clr: #cbcbcb;
// $dark-theme-header-bg: #505050;
// $dark-theme-body-bg: #000000;
// $dark-theme-headings-clr: #2090D4;