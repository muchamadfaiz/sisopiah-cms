import { createSlice } from "@reduxjs/toolkit";
import { THEME_CONFIG } from "configs/AppConfig";

const {
  REACT_APP_COMPANY_LOGO,
  REACT_APP_SIDEBAR_LOGO,
  REACT_APP_COLLAPSED_SIDEBAR_LOGO,
  REACT_APP_AUTH_BACKGROUND,
} = process.env;

const initialState = {
  ...THEME_CONFIG,
  authBackground: REACT_APP_AUTH_BACKGROUND || "/img/background.png",
  companyLogo: REACT_APP_COMPANY_LOGO || "/img/logo-colored.png",
  sidebarLogo: REACT_APP_SIDEBAR_LOGO || "/img/logo-white.png",
  collapsedSidebarLogo:
    REACT_APP_COLLAPSED_SIDEBAR_LOGO || "/img/logo-white.png",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleCollapsedNav: (state, action) => {
      state.navCollapsed = action.payload;
    },
    onNavStyleChange: (state, action) => {
      state.sideNavTheme = action.payload;
    },
    onLocaleChange: (state, action) => {
      state.locale = action.payload;
    },
    onNavTypeChange: (state, action) => {
      state.navType = action.payload;
    },
    onTopNavColorChange: (state, action) => {
      state.topNavColor = action.payload;
    },
    onHeaderNavColorChange: (state, action) => {
      state.headerNavColor = action.payload;
    },
    onMobileNavToggle: (state, action) => {
      state.mobileNav = action.payload;
    },
  },
});

export const {
  toggleCollapsedNav,
  onNavStyleChange,
  onLocaleChange,
  onNavTypeChange,
  onTopNavColorChange,
  onHeaderNavColorChange,
  onMobileNavToggle,
} = themeSlice.actions;

export default themeSlice.reducer;
