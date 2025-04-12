# StockFlow Inventory Manager

StockFlow is a modern, responsive inventory management system built with React, Material‑UI, and Firebase. It supports barcode scanning (both hardware and camera modes), real‑time inventory updates, audit logging, usage reports, and role‑based user management—all wrapped in a modern dark/frosted theme.

---

## Features

- **Authentication & User Management:**
  - Secure login, registration (with an admin key for role selection), and password reset.
  - Role‑based permissions with admins able to manage users and update roles.
  
- **Inventory Management:**
  - Add, edit, and delete inventory items.
  - Barcode scanning (hardware & camera) for quick item lookup and editing.
  - Barcode printing for labels (designed for Zebra 2.25" x 1.25" labels).
  
- **Audit Logging & Reports:**
  - Detailed audit logs that capture every update (with before/after values and diff highlighting).
  - Usage reports and analytics with dynamic charts (bar, line, stacked bar) to visualize quantity changes.
  
- **Modern UI:**
  - A dark theme with frosted glass effects, retro typography (e.g., "Press Start 2P"), and a consistent layout using Material‑UI.
  - Responsive navigation with a fixed-top NavBar and a collapsible Sidebar.

---

## Getting Started

### Prerequisites

- **Node.js** (v14+ is recommended)
- **npm** (v6+)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MarcEs1999/Smart-Inventory-App.git
   cd Smart-Inventory-App/client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   - Set up your Firebase project and update your `src/firebase.js` file with your API keys and configuration settings.
   - Ensure that Firestore and Authentication are properly configured and that your Firestore security rules reflect your role‑based permissions.

4. **Run the development server:**
   ```bash
   npm start
   ```
   The app will run at [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
client/
├── public/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── PasswordReset.js
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.js
│   │   │   ├── AuditLog.js
│   │   │   ├── Logout.js
│   │   │   └── Sidebar.js
│   │   ├── Inventory/
│   │   │   ├── AddItem.js
│   │   │   ├── ListItem.js
│   │   │   ├── EditItem.js
│   │   │   ├── BarcodeScanning.js
│   │   │   ├── ZXingBarcodeScanning.js
│   │   │   ├── BarcodePrint.js
│   │   │   └── BarcodePrintModal.js
│   │   ├── Reports/
│   │   │   ├── UsageReports.js
│   │   │   └── UsageHelper.js
│   │   ├── UI/
│   │   │   ├── NavBar.js
│   │   │   └── Modal.js
│   │   └── User/
│   │       ├── UserSettings.js
│   │       └── AdminUserManagement.js
│   ├── firebase.js
│   ├── App.js
│   ├── App.css
│   └── index.js
└── package.json
```

---

## Customization & Styling

- **Theme & Colors:**  
  StockFlow uses a dark, frosted theme achieved with CSS backdrop filters and semi‑transparent backgrounds. The retro font ("Press Start 2P") is used for headings to create a distinctive style.

- **Responsive UI:**  
  The fixed-top NavBar and collapsible Sidebar (using Material‑UI components) provide a consistent experience across all pages.

- **Barcode & Audit Modules:**  
  Components for barcode scanning, printing, audit logs, and usage reports follow the same modern styling for a unified look.

---

## Deployment

To create a production build:
```bash
npm run build
```
Then follow your preferred deployment process for React apps (e.g., Firebase Hosting, Vercel, or Netlify).

---

## Troubleshooting

- **Firebase:**  
  Ensure your Firebase API keys and configuration are correct in `src/firebase.js` and that your Firestore security rules are set up for role‑based access.
- **Dependencies:**  
  If you encounter dependency issues, try running:
  ```bash
  npm audit fix
  ```
  or
  ```bash
  npm install --legacy-peer-deps
  ```

---

## Future Enhancements

- Further polish UI animations and transitions.
- Implement push notifications for low stock alerts.
- Expand user role management with more granular permissions.
- Refine and extend reports/analytics based on user feedback.

---

This project is designed for clarity, consistency, and ease of use—suitable for class projects and can serve as a foundation for more advanced enterprise solutions.

Feel free to modify this README to fit any future updates or additional functionality.
