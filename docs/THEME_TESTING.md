# Quick Theme Testing Guide

## 🚀 Getting Started

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Server should start on**: `http://localhost:3002`

## 🌐 Testing URLs

### App Subdomain (Dashboard)
- **URL**: `http://localhost:3002/?subdomain=app`
- **What to test**: 
  - Theme toggle in top-right navbar
  - Sidebar theming
  - Dashboard components
  - Form builder (if accessible)

### Forms Subdomain (Public Forms)
- **URL**: `http://localhost:3002/?subdomain=forms`
- **What to test**:
  - Public form interface
  - Minimal layout theming
  - Form completion flow

### Marketing Site (Default)
- **URL**: `http://localhost:3002`
- **What to test**:
  - Landing page theming
  - Header theme toggle
  - Marketing components

### Theme Demo Page
- **URL**: `http://localhost:3002/theme-demo?subdomain=app`
- **What to test**:
  - Complete theme showcase
  - All component variations
  - Color palette display
  - Interactive elements

## 🧪 Testing Checklist

### Theme Toggle Functionality
- [ ] Click theme toggle (sun/moon icon)
- [ ] Try Light mode
- [ ] Try Dark mode  
- [ ] Try System mode (should follow OS preference)
- [ ] Verify theme persists on page refresh
- [ ] Check smooth transitions between themes

### Component Coverage
- [ ] Navigation (sidebar, navbar)
- [ ] Cards and surfaces
- [ ] Buttons (all variants)
- [ ] Form inputs and controls
- [ ] Status indicators and badges
- [ ] Empty states and icons
- [ ] Interactive hover/focus states

### Cross-Page Consistency
- [ ] Navigate between different pages
- [ ] Verify theme is maintained
- [ ] Check subdomain routing works
- [ ] Test authentication flows (if not signed in)

### Visual Quality
- [ ] No flashing or incorrect colors
- [ ] Proper contrast in both themes
- [ ] Consistent spacing and typography
- [ ] Responsive design in both themes
- [ ] Icons and graphics display correctly

## 🐛 Common Issues & Solutions

### "404 Not Found" on subdomain URLs
- **Issue**: Middleware not handling subdomain routing
- **Solution**: Ensure you're using the query parameter format: `?subdomain=app`

### Theme not switching
- **Issue**: JavaScript not loaded or localStorage blocked
- **Solution**: Check browser console for errors, try incognito mode

### Components not themed
- **Issue**: Components using hardcoded colors
- **Solution**: Check if component was updated to use semantic color classes

### Flash of wrong theme
- **Issue**: Hydration mismatch
- **Solution**: Verify `suppressHydrationWarning` is set in root layout

## 📱 Mobile Testing

Test theme functionality on mobile:
- [ ] Theme toggle accessibility
- [ ] Touch interactions work
- [ ] Responsive layout in both themes
- [ ] Mobile navigation theming

## 🎯 Success Criteria

✅ **Complete Success**: All components seamlessly switch between light and dark themes
✅ **Theme Persistence**: Selected theme is remembered across sessions  
✅ **No Visual Glitches**: Smooth transitions with no flashing or incorrect colors
✅ **Universal Coverage**: Every page and component supports both themes
✅ **Performance**: No noticeable impact on app performance

## 📞 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Verify you're using the correct URL format with subdomain parameter
3. Try clearing localStorage and cookies
4. Test in incognito/private browsing mode
5. Refer to the main Dark Theme Guide for detailed implementation info