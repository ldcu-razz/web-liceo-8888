export const BASE_URL = '/';
export const LOGIN = '/login';
export const CREATE_ACCOUNT = '/create-account';
export const CREATE_ACCOUNT_SUCCESS = '/create-account-success';
export const MAIN = '/main';
export const DASHBOARD = '/main/dashboard';
export const TICKETS_BOARD = '/main/tickets/board';
export const TICKETS_CATEGORIES = '/main/tickets/categories';
export const DEPARTMENTS = '/main/departments';
export const USERS = '/main/users';
export const CREATE_USER = '/main/users/create';
export const USER_DETAILS = '/main/users/{id}';
export const PROFILE = '/main/profile';

export const API_BASE_URL = '/api';

// Auth
export const API_AUTH_SESSION = '/api/auth/session';
export const API_AUTH_LOGIN = '/api/auth/login';
export const API_AUTH_LOGOUT = '/api/auth/logout';

// Departments
export const API_DEPARTMENTS = '/api/departments';
export const API_DEPARTMENTS_ID = '/api/departments/{id}';
export const API_USERS = '/api/users';
export const API_USERS_ID = '/api/users/{id}';
export const API_USERS_ME = '/api/users/me';
export const API_USERS_CHECK_USERNAME = '/api/users/check-username';

// Tickets
export const API_TICKETS = '/api/tickets';
export const API_TICKETS_ID = '/api/tickets/{id}';
export const API_TICKET_CATEGORIES = '/api/tickets/categories';
export const API_TICKETS_UPDATES = '/api/tickets/updates';
export const API_TICKETS_DEPARTMENT_ASSIGNS = '/api/tickets/assign/department';
export const API_TICKETS_USER_ASSIGNS = '/api/tickets/assign/user';