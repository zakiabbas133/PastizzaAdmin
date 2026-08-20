// Application constants

export const APP_NAME = 'Pastizza Admin';
export const APP_DESCRIPTION = 'Premium Admin Dashboard';

// User roles
export const USER_ROLES = {
	ADMIN: 'admin',
	EDITOR: 'editor',
	VIEWER: 'viewer',
};

// User statuses
export const USER_STATUS = {
	ACTIVE: 'Active',
	INACTIVE: 'Inactive',
	SUSPENDED: 'Suspended',
	PENDING: 'Pending',
};

// Order statuses
export const ORDER_STATUS = {
	COMPLETED: 'Completed',
	PENDING: 'Pending',
	PROCESSING: 'Processing',
	CANCELLED: 'Cancelled',
};

// Product categories
export const PRODUCT_CATEGORIES = [
	'Electronics',
	'Accessories',
	'Software',
	'Clothing',
	'Home & Garden',
	'Sports',
	'Books',
];

// Time periods
export const TIME_PERIODS = [
	{ value: '7d', label: '7 Days' },
	{ value: '30d', label: '30 Days' },
	{ value: '90d', label: '90 Days' },
	{ value: '1y', label: '1 Year' },
];

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

// API endpoints (for future use with real API)
export const API_ENDPOINTS = {
	USERS: '/api/users',
	ORDERS: '/api/orders',
	PRODUCTS: '/api/products',
	ANALYTICS: '/api/analytics',
};

export default {
	APP_NAME,
	APP_DESCRIPTION,
	USER_ROLES,
	USER_STATUS,
	ORDER_STATUS,
	PRODUCT_CATEGORIES,
	TIME_PERIODS,
	DEFAULT_PAGE_SIZE,
	PAGE_SIZE_OPTIONS,
	API_ENDPOINTS,
};
