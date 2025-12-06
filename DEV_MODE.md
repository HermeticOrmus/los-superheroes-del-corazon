# 🛠️ Dev Mode - Testing Guide

**Dev Mode** allows you to test the complete user experience without requiring backend connectivity. All API calls are intercepted and return realistic mock data.

---

## 🎯 What is Dev Mode?

Dev Mode is a development feature that:
- **Bypasses real API calls** - No backend server needed
- **Returns realistic mock data** - Pre-populated with test users, children, and notifications
- **Simulates API delays** - Realistic loading states (200-800ms)
- **Enables instant testing** - Test all flows without database setup

---

## ⚙️ Enabling Dev Mode

Dev mode is controlled by the `NEXT_PUBLIC_DEV_MODE` environment variable in `.env.local`:

```bash
# Dev Mode - Set to 'true' to enable mock authentication
NEXT_PUBLIC_DEV_MODE=true
```

**Current Status:** ✅ Dev Mode is **ENABLED**

To disable dev mode and use the real backend:
```bash
NEXT_PUBLIC_DEV_MODE=false
```

---

## 🔑 Test Credentials

### Parent Login

Use **any email and password** to log in as a parent in dev mode:

```
Email: amoryvida@gmail.com (or any email)
Password: anything
```

The system will return the mock parent account:
- **Name:** María González
- **Email:** amoryvida@gmail.com
- **Role:** PARENT

### Child Login (Secret Codes)

Use these secret codes to log in as different children:

| Secret Code | Child Name | Superhero Name | Age | Rank | Initiation Status |
|-------------|-----------|----------------|-----|------|------------------|
| `AMAR333` | Amor | Corazón de Luz | 8 | Valiente | ✅ Completed |
| `DIEGO456` | Diego | Guardián de Luz | 11 | Sabio | ✅ Completed |
| `BELLA789` | Isabella | Estrella del Alma | 5 | Iniciado | ❌ Pending |

---

## 📊 Mock Data Overview

### Mock Children (3)
1. **Amor** - Age 8, Valiente rank, 350 Luz points, requires parent assistance, code: AMAR333
2. **Diego** - Age 11, Sabio rank, 580 Luz points, independent, code: DIEGO456
3. **Isabella** - Age 5, Iniciado rank, 150 Luz points, initiation pending, code: BELLA789

### Mock Notifications (4)
- New mission released (unread)
- Challenge completed by Sofía (unread)
- Diego rank promotion (read)
- Badge earned by Sofía (read)

### Mock Archangels (7)
- Arcángel Miguel (Protección y Valentía) - Red
- Arcángel Gabriel (Comunicación y Verdad) - Blue
- Arcángel Rafael (Sanación y Amor) - Green
- Arcángel Uriel (Sabiduría y Luz) - Amber
- Arcángel Chamuel (Amor Incondicional) - Pink
- Arcángel Jophiel (Belleza y Alegría) - Purple
- Arcángel Zadkiel (Perdón y Memoria) - Indigo

### Mock Safety Settings
- Community access: ✅ Enabled
- Posting in community: ❌ Disabled
- Comment permissions: ✅ Enabled
- View other profiles: ✅ Enabled
- Content filter: Moderate

---

## 🧪 Testing Workflows

### 1. Parent Dashboard Flow

```bash
1. Navigate to http://localhost:3000/login
2. Enter any email and password
3. Click "Iniciar Sesión"
4. Explore parent dashboard:
   - View 3 children on dashboard
   - Check notifications (2 unread)
   - View individual child profiles
   - Manage safety settings
```

### 2. Child Login Flow

```bash
1. Navigate to http://localhost:3000/login
2. Click "Soy un Niño - Entrar con Código Secreto"
3. Enter: AMAR333
4. Click "Entrar"
5. (Child dashboard will be available when implemented)
```

### 3. Onboarding Ceremony Flow

```bash
1. Log in as parent
2. Navigate to a child who hasn't completed initiation
3. Copy their secret code (e.g., BELLA789)
4. Navigate to: /onboarding/BELLA789
5. Complete the 4-step ceremony:
   - Welcome screen
   - Choose archangel
   - Choose superhero name
   - Completion & rewards
```

### 4. Children Management

```bash
1. Log in as parent
2. Navigate to /dashboard/children
3. Test adding a new child:
   - Click "Agregar Niño"
   - Enter name and age
   - View generated secret code
4. Test editing child:
   - Click on a child card
   - Click "Editar Información"
   - Modify details
5. Test safety settings:
   - Click "Configurar Seguridad"
   - Toggle various settings
   - Save changes
```

### 5. Notifications

```bash
1. Log in as parent
2. Navigate to /dashboard/notifications
3. Test filtering:
   - View all notifications
   - Filter by unread
4. Test actions:
   - Mark individual as read
   - Mark all as read
   - Delete notification
```

---

## 🔧 Technical Implementation

### API Layer Structure

All API methods in `/src/lib/api.ts` follow this pattern:

```typescript
async someMethod(params): Promise<ReturnType> {
  if (DEV_MODE) {
    await mockDelay(300); // Simulate network latency
    return MOCK_DATA;     // Return mock data
  }
  return apiRequest('/real/endpoint', options); // Real API call
}
```

### Mock Data Source

All mock data is centralized in `/src/lib/mock-data.ts`:

```typescript
export const MOCK_PARENT = { ... };
export const MOCK_CHILDREN = [ ... ];
export const MOCK_NOTIFICATIONS = [ ... ];
export const MOCK_ARCHANGELS = [ ... ];
export const MOCK_SAFETY_SETTINGS = { ... };
export const mockDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
```

### Supported API Methods

**✅ Fully Mocked:**
- `authApi.register()`
- `authApi.login()`
- `authApi.loginChild()`
- `authApi.getProfile()`
- `authApi.verifyToken()`
- `childrenApi.getAll()`
- `childrenApi.getById()`
- `childrenApi.create()`
- `childrenApi.update()`
- `childrenApi.delete()`
- `notificationsApi.getUnread()`
- `notificationsApi.getAll()`
- `notificationsApi.markAsRead()`
- `notificationsApi.markAllAsRead()`
- `safetyApi.getSettings()`
- `safetyApi.updateSettings()`
- `safetyApi.resetToDefaults()`
- `archangelsApi.getAll()`
- `archangelsApi.getById()`
- `onboardingApi.generateSuperheroName()`
- `onboardingApi.completeOnboarding()`
- `dashboardApi.getStats()` (uses children + notifications)

**⏳ Not Yet Implemented:**
- Missions API
- Challenges API
- Rewards API

---

## 🎨 Features to Test

### Core Features (Available Now)

✅ **Authentication**
- Parent login with any credentials
- Child login with secret codes
- Token management
- Auto-redirect based on role

✅ **Parent Dashboard**
- Dashboard overview with stats
- Children grid view
- Individual child profiles
- Add/edit children
- Safety settings management
- Notifications center

✅ **Onboarding Ceremony**
- 4-step wizard
- Archangel selection
- Superhero name generation
- Initiation rewards

✅ **Data Persistence (Mock)**
- Login state preserved in localStorage
- Navigation works correctly
- All CRUD operations return success

### UI/UX Elements to Verify

- Loading states (spinner animations)
- Error handling
- Form validation
- Empty states
- Mobile responsiveness
- Color theming (LibreUIUX palette)
- Icon usage (Lucide icons)

---

## 🚀 Quick Start

```bash
# 1. Ensure dev mode is enabled in .env.local
echo "NEXT_PUBLIC_DEV_MODE=true" >> .env.local

# 2. Start development server
npm run dev

# 3. Open browser
open http://localhost:3000

# 4. Log in as parent
# Email: any@test.com
# Password: anything

# 5. Explore the dashboard!
```

---

## 💡 Tips for Testing

1. **Use Browser DevTools**
   - Check Network tab - all API calls should return instantly
   - Check Console for any errors
   - Test responsive design with device emulator

2. **Test Different Children**
   - Use BELLA789 to test incomplete onboarding
   - Use AMAR333 to test a child requiring assistance
   - Use DIEGO456 to test an independent older child

3. **Test Edge Cases**
   - Try logging in with invalid secret code
   - Try accessing pages without authentication
   - Try modifying child ages (affects safety defaults)

4. **Test All Pages**
   - Landing page: `/`
   - Login: `/login`
   - Register: `/register`
   - Dashboard: `/dashboard`
   - Children list: `/dashboard/children`
   - Child detail: `/dashboard/children/[id]`
   - Add child: `/dashboard/children/new`
   - Edit child: `/dashboard/children/[id]/edit`
   - Safety settings: `/dashboard/children/[id]/safety`
   - Notifications: `/dashboard/notifications`
   - Onboarding: `/onboarding/[secretCode]`

---

## 🐛 Debugging Dev Mode

### Check if Dev Mode is Active

Open browser console and run:
```javascript
console.log('Dev Mode:', process.env.NEXT_PUBLIC_DEV_MODE);
```

### Force Disable Dev Mode

If you need to test with real backend:
1. Edit `.env.local` and set `NEXT_PUBLIC_DEV_MODE=false`
2. Restart the dev server: `npm run dev`
3. Ensure backend is running on `http://localhost:4000`

### Common Issues

**Issue:** Login doesn't work
- **Solution:** Check that `.env.local` has `NEXT_PUBLIC_DEV_MODE=true`
- **Solution:** Restart dev server after changing env vars

**Issue:** Getting real API errors
- **Solution:** Dev mode is disabled - check `.env.local`

**Issue:** Data not updating
- **Solution:** In dev mode, data changes are simulated but not persisted
- **Solution:** Refresh page to reset to original mock data

---

## 📝 Adding New Mock Data

To add more test data:

1. **Edit** `/src/lib/mock-data.ts`
2. **Add** new items to existing arrays:
   ```typescript
   export const MOCK_CHILDREN = [
     // ... existing children
     {
       id: 'child-mock-004',
       name: 'New Child',
       // ... other fields
     },
   ];
   ```
3. **Save** and test - changes are instant (no restart needed)

---

## ✨ Next Steps

Once you've tested the core flows in dev mode:

1. **Disable Dev Mode** - Set `NEXT_PUBLIC_DEV_MODE=false`
2. **Start Backend** - Run the Node.js backend server
3. **Test Real Integration** - Verify all features work with real database
4. **Report Issues** - Document any discrepancies between mock and real data

---

**Happy Testing! 🎉**

For questions or issues, check:
- `/FRONTEND_BUILD_STATUS.md` - Feature completion status
- `/server/BUILD_STATUS.md` - Backend API documentation
