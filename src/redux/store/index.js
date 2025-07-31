import { configureStore } from '@reduxjs/toolkit'
import themeReducer from 'redux/features/theme'
import authReducer from 'redux/features/auth'
import userReducer from 'redux/features/user'
import wajibReducer from 'redux/features/wajib_pajak'
import vendorReducer from 'redux/features/vendor'
import contentReducer from 'redux/features/content'
import categoryReducer from 'redux/features/category'
import projectsReducer from 'redux/features/projects'
import categorizationReducer from 'redux/features/categorization'

const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    content:contentReducer,
    category:categoryReducer,
    projects:projectsReducer,
    wajib:wajibReducer,
    vendor:vendorReducer,
    categorization:categorizationReducer,
    user: userReducer
  }
});

export default store;

