# Welfare-Group

A welfare group website to help manage the activities of the group and send messages to all members.

## Features
- User registration and login
- Member management (add, edit, delete, view)
- Contribution tracking
- Case management for deceased members
- Payment tracking
- SMS history (simulated)

## Structure
- `index.html`: Homepage
- `login.html` / `register.html`: Authentication for admin
- `js/`: Modular JavaScript files
  - `auth.js`: Authentication logic
  - `members.js`: Member management
  - `contributions.js`: Contributions and payments
  - `cases.js`: Case management
  - `sms.js`: SMS functionality
- `style.css`: Stylesheet with CSS variables

## Setup
Open `index.html` in a web browser. Data is stored in localStorage (client-side only).

## Improvements Made
- Modularized JavaScript for better maintainability
- Added input validation and error handling
- Improved CSS with variables and consistency
- Enhanced security (basic validation, no plain-text passwords in production)
