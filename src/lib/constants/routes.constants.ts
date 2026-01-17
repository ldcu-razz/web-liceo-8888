export const BASE_URL = '/';
export const LOGIN = '/login';
export const CREATE_ACCOUNT = '/create-account';
export const CREATE_ACCOUNT_SUCCESS = '/create-account-success';
export const VERIFY_EMAIL = '/verify/email';
export const MAIN = '/main';
export const DASHBOARD = '/main/dashboard';
export const TICKETS_BOARD = '/main/tickets/board';
export const TICKETS_CATEGORIES = '/main/tickets/categories';
export const TICKETS_DETAILS = '/main/tickets/{id}';
export const DEPARTMENTS = '/main/departments';
export const USERS = '/main/users';
export const CREATE_USER = '/main/users/create';
export const USER_DETAILS = '/main/users/{id}';
export const PROFILE = '/main/profile';
export const PROFILE_ACCOUNT = '/main/profile/account';
export const PROFILE_NOTIFICATIONS = '/main/profile/notifications';
export const PROFILE_SESSIONS = '/main/profile/sessions';
export const MEMBER_MAIN = '/member';
export const MEMBER_TICKETS = '/member/tickets';
export const MEMBER_TICKETS_ID = '/member/tickets/{id}';
export const MEMBER_PROFILE = '/member/profile';
export const MEMBER_NOTIFICATIONS = '/member/notifications';
export const MEMBER_PROFILE_EDIT = '/member/profile/edit';
export const MEMBER_PROFILE_CHANGE_PASSWORD = '/member/profile/change-password';
export const SYSTEM_SETTINGS = '/main/system/settings';
export const MAINTENANCE = '/maintenance';
export const EMAIL_TEMPLATE = '/template/email';
export const PUBLIC_ROUTES = [LOGIN, CREATE_ACCOUNT, CREATE_ACCOUNT_SUCCESS, VERIFY_EMAIL, MAINTENANCE, EMAIL_TEMPLATE];

/** REGION: API URLS */
export const API_BASE_URL = '/api';

// Auth
export const API_AUTH_SESSION = '/api/auth/session';
export const API_AUTH_LOGIN = '/api/auth/login';
export const API_AUTH_LOGOUT = '/api/auth/logout';
export const API_AUTH_VERIFY_EMAIL = '/api/auth/verify/email';

// Dashboard
export const API_DASHBOARD = '/api/dashboard';
export const API_DASHBOARD_STATS = '/api/dashboard/stats';
export const API_DASHBOARD_TICKETS_GRAPH = '/api/dashboard/graph/total-tickets';

// Departments
export const API_DEPARTMENTS = '/api/departments';
export const API_DEPARTMENTS_ID = '/api/departments/{id}';

// Users
export const API_USERS = '/api/users';
export const API_USERS_ID = '/api/users/{id}';
export const API_USERS_ME = '/api/users/me';
export const API_USERS_CHECK_USERNAME = '/api/users/check-username';
export const API_USERS_CHANGE_PASSWORD = '/api/users/change-password';
export const API_USERS_CHANGE_USERNAME = '/api/users/change-username';
export const API_USERS_CHECK_EMAIL = '/api/users/check-email';
export const API_USERS_CREATE_ACCOUNT = '/api/users/create-account';
export const API_USERS_PROPERTIES = '/api/users/{id}/properties';
export const API_USERS_PROPERTIES_RESET = '/api/users/properties/reset';
export const API_USERS_TOTAL_USERS = '/api/users/total-users';

// Tickets
export const API_TICKETS = '/api/tickets';
export const API_TICKETS_ID = '/api/tickets/{id}';
export const API_TICKET_CATEGORIES = '/api/tickets/categories';
export const API_TICKETS_UPDATES = '/api/tickets/updates';
export const API_TICKETS_ID_COMMENT = '/api/tickets/{id}/comment';

// Files
export const API_FILES = '/api/files';
export const API_FILES_UPLOAD = '/api/files/upload';
export const API_FILES_SIGNED_URL = '/api/files/signed-url';

// Notifications
export const API_NOTIFICATIONS = '/api/notifications';

// System
export const API_SYSTEM_SETTINGS = '/api/system/settings';

export const PUBLIC_API_ROUTES = [
	API_AUTH_SESSION,
	API_AUTH_LOGIN,
	API_AUTH_LOGOUT,
	API_DEPARTMENTS,
	API_USERS_CHECK_USERNAME,
	API_USERS_CHECK_EMAIL,
	API_USERS_CREATE_ACCOUNT,
	API_USERS_TOTAL_USERS,
	API_SYSTEM_SETTINGS,
	API_AUTH_VERIFY_EMAIL
];
