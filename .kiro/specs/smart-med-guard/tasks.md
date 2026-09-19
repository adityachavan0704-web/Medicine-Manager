# Implementation Plan: SmartMedGuard - Medicine Management System

## Overview

This implementation plan builds a full-fledged, production-ready medicine management web application demonstrating practical implementations of core data structures (MinHeap, HashMap, AlertQueue, HistoryLinkedList) in a real-world healthcare inventory context. The system will feature a React frontend with premium healthcare UI, Node.js/Express backend with custom data structure implementations, MySQL database, authentication, analytics dashboards, and a dedicated data structure visualization page for competitive programming demonstration.

## Tasks

- [~] 1. Project Setup and Structure
  - Create complete project directory structure (frontend/, backend/, database/)
  - Initialize backend Node.js project with Express, MySQL2, bcrypt, jsonwebtoken dependencies
  - Initialize frontend React project with Vite, React Router, Axios, Recharts, TailwindCSS
  - Configure environment variables for database connection, JWT secret, CORS settings
  - Set up ESLint and Prettier for code quality
  - _Requirements: 13.1, 19.4, 19.5_

- [x] 2. Database Schema and Migrations
  - [x] 2.1 Create MySQL database schema
    - Write SQL migration script for medicines table with all fields and indexes
    - Write SQL migration script for alerts table with foreign key constraints
    - Write SQL migration script for history table with indexes on medicine_id and timestamp
    - Write SQL migration script for users table with unique constraints
    - _Requirements: 1.1, 11.1, 12.1, 13.1_
  
  - [x] 2.2 Create database connection module
    - Implement connection pool configuration with retry logic
    - Add connection health check and error handling
    - _Requirements: 15.4, 17.6_

- [ ] 3. Implement Custom Data Structures
  - [x] 3.1 Implement MinHeap class for expiry priority
    - Write MinHeap class with heap array, insert, extractMin, peekMin methods
    - Implement heapifyUp and heapifyDown for maintaining heap property
    - Add getMedicinesExpiringWithin, getTopNExpiring methods
    - Implement remove and update methods with reheapification
    - Include complexity annotations in JSDoc comments
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 16.2_
  
  - [ ]* 3.2 Write unit tests for MinHeap
    - Test heap property maintenance after insert operations
    - Test extractMin returns correct minimum and maintains heap structure
    - Test edge cases (empty heap, single element, duplicate expiry dates)
    - _Requirements: 3.1, 3.8_
  
  - [x] 3.3 Implement MedicineHashMap class for O(1) lookups
    - Write HashMap class with bucket array, hash function, set/get/delete methods
    - Implement collision handling via chaining
    - Add automatic resizing when load factor exceeds 0.75
    - Implement searchByName, searchByBatch, searchByCategory methods
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 16.1_
  
  - [ ]* 3.4 Write unit tests for HashMap
    - Test O(1) set, get, delete operations
    - Test automatic resizing and rehashing
    - Test collision handling with multiple entries per bucket
    - _Requirements: 4.1, 4.2, 4.9_
  
  - [-] 3.5 Implement AlertQueue class for FIFO alert management
    - Write Queue class with array, front/rear pointers, enqueue/dequeue methods
    - Implement getUnreadAlerts, getAlertsByType, getAlertsBySeverity methods
    - Add generateAlertsForMedicine method with multi-tier logic (30/7/1 day warnings)
    - Handle queue full condition and circular array wrapping
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 5.11, 5.12, 5.13_
  
  - [ ]* 3.6 Write unit tests for AlertQueue
    - Test FIFO order maintenance through enqueue/dequeue cycles
    - Test alert generation logic for all severity levels
    - Test queue full behavior and capacity management
    - _Requirements: 5.2, 5.4, 5.5, 5.6, 5.7_
  
  - [-] 3.7 Implement HistoryLinkedList class for activity tracking
    - Write HistoryNode class with data, next, prev pointers
    - Implement LinkedList class with head/tail pointers, addToFront/addToBack methods
    - Add removeFromFront, removeFromBack, getRecentHistory methods
    - Implement filter methods (by medicine ID, action type, date range)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 16.4_
  
  - [ ]* 3.8 Write unit tests for HistoryLinkedList
    - Test bidirectional traversal and insertion at both ends
    - Test chronological order maintenance
    - Test filtering operations return correct subsets
    - _Requirements: 6.1, 6.2, 6.9_

- [ ] 4. Implement StatusCalculator Utility
  - [ ] 4.1 Create StatusCalculator class
    - Implement calculateStatus method with 4-tier logic (Safe >30d, Expiring Soon 8-30d, Critical 1-7d, Expired <0d)
    - Implement getDaysUntilExpiry calculating date difference
    - Implement needsAlert checking if days until expiry ≤ 30
    - Implement getAlertSeverity mapping days to severity levels
    - Add batchCalculateStatus for multiple medicines
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_
  
  - [ ]* 4.2 Write unit tests for StatusCalculator
    - Test all status thresholds with boundary values
    - Test date calculations across month boundaries
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [~] 5. Checkpoint - Core Data Structures Complete
  - Ensure all data structure tests pass, verify complexity targets met, ask the user if questions arise.

- [ ] 6. Implement Medicine Service Layer
  - [~] 6.1 Create MedicineService class
    - Initialize MinHeap and HashMap on service creation
    - Implement loadFromDatabase method to rebuild data structures on startup
    - Implement addMedicine method inserting into DB, MinHeap, HashMap, and creating history entry
    - Implement getMedicineById using HashMap for O(1) retrieval
    - Implement updateMedicine modifying DB, MinHeap, and HashMap
    - Implement deleteMedicine removing from all data structures
    - Implement getAllMedicines with status calculation
    - _Requirements: 1.1, 1.5, 1.6, 1.7, 1.8, 1.9, 17.1, 17.2, 17.3, 17.6_
  
  - [~] 6.2 Implement search and FEFO methods
    - Implement searchMedicines by name, batch, category using HashMap methods
    - Implement getFEFORecommendations using MinHeap getTopNExpiring
    - Implement getMedicinesExpiringWithin using MinHeap filtering
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [~] 6.3 Implement dispenseMedicine method
    - Validate requested quantity against available stock
    - Reduce medicine quantity in DB and data structures
    - Create DISPENSE history entry with before/after quantities
    - Check low stock threshold and generate alert if needed
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ]* 6.4 Write integration tests for MedicineService
    - Test end-to-end medicine CRUD with DB and data structure synchronization
    - Test FEFO recommendations return correctly ordered results
    - Test dispensing updates all layers correctly
    - _Requirements: 17.1, 17.2, 17.3_

- [ ] 7. Implement Alert Service Layer
  - [~] 7.1 Create AlertService class
    - Initialize AlertQueue and load existing alerts from database
    - Implement addAlert inserting into queue and database
    - Implement getAlerts with filtering options (unread, by type, by severity)
    - Implement markAsRead updating queue and database
    - Implement acknowledgeAlert updating acknowledgment fields
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 17.4_
  
  - [~] 7.2 Implement generateAlertsForAllMedicines method
    - Iterate through all medicines and call AlertQueue.generateAlertsForMedicine
    - Batch insert generated alerts into database
    - Handle queue capacity limits by removing old read alerts
    - _Requirements: 5.5, 5.6, 5.7, 5.8, 5.9, 11.6, 15.6_
  
  - [ ]* 7.3 Write integration tests for AlertService
    - Test alert generation creates correct alert types for various expiry scenarios
    - Test marking as read updates both queue and database
    - _Requirements: 17.4_

- [ ] 8. Implement History Service Layer
  - [~] 8.1 Create HistoryService class
    - Initialize HistoryLinkedList and load existing history from database
    - Implement addHistoryEntry inserting to list front and database
    - Implement getRecentHistory retrieving N most recent entries
    - Implement filtering methods (by medicine, by action, by date range)
    - _Requirements: 6.1, 6.5, 6.6, 6.7, 6.8, 17.5_
  
  - [ ]* 8.2 Write integration tests for HistoryService
    - Test history entries maintain chronological order
    - Test filtering returns correct subsets
    - _Requirements: 6.9, 17.5_

- [ ] 9. Implement User Authentication Service
  - [~] 9.1 Create AuthService class
    - Implement registerUser with bcrypt password hashing (10 rounds)
    - Implement loginUser with bcrypt verification and JWT generation (24h expiration)
    - Implement verifyToken middleware for protected routes
    - Add role-based authorization middleware (admin, pharmacist, viewer)
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6, 13.7, 13.8, 19.1_
  
  - [ ]* 9.2 Write security tests for AuthService
    - Test password hashing produces different hashes for same password
    - Test JWT expiration and invalid token rejection
    - Test role-based access control enforcement
    - _Requirements: 13.1, 13.8, 19.1_

- [~] 10. Checkpoint - Service Layer Complete
  - Ensure all service tests pass, verify data synchronization works, ask the user if questions arise.

- [ ] 11. Implement Input Validation Middleware
  - [~] 11.1 Create validation schemas
    - Define medicine validation schema (name 1-200 chars, batch alphanumeric, quantity non-negative, etc.)
    - Define user validation schema (username 3-30 alphanumeric, email format, password strength)
    - Define dispense validation schema (quantity positive and within stock)
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, 14.9_
  
  - [~] 11.2 Create validation middleware functions
    - Implement validateMedicine middleware with all field checks
    - Implement validateUser middleware for registration/login
    - Implement sanitization for SQL injection prevention
    - Return 400 Bad Request with descriptive errors on validation failure
    - _Requirements: 14.10, 19.2_

- [ ] 12. Implement API Controllers and Routes
  - [~] 12.1 Create Medicine Controller
    - Implement GET /api/medicines endpoint returning all medicines with stats
    - Implement GET /api/medicines/:id endpoint with related alerts and history
    - Implement POST /api/medicines endpoint with validation and authorization
    - Implement PUT /api/medicines/:id endpoint with partial updates
    - Implement DELETE /api/medicines/:id endpoint (admin only)
    - Implement GET /api/medicines/expiring endpoint with FEFO recommendations
    - Implement GET /api/medicines/search endpoint with query parameter
    - Implement POST /api/medicines/:id/dispense endpoint
    - _Requirements: 1.1, 1.6, 1.7, 1.8, 7.1, 8.1, 9.1_
  
  - [~] 12.2 Create Alert Controller
    - Implement GET /api/alerts endpoint with filtering
    - Implement GET /api/alerts/unread endpoint
    - Implement PUT /api/alerts/:id/read endpoint
    - Implement PUT /api/alerts/:id/acknowledge endpoint
    - Implement DELETE /api/alerts/:id endpoint
    - Implement POST /api/alerts/generate endpoint (admin/pharmacist only)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_
  
  - [~] 12.3 Create Analytics Controller
    - Implement GET /api/analytics/dashboard endpoint aggregating all dashboard stats
    - Calculate total medicines, total value, status breakdown, category breakdown
    - Include unread/critical alert counts, recent history (10 entries), top 10 FEFO, low stock list
    - Implement GET /api/analytics/trends endpoint with monthly trends
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9_
  
  - [~] 12.4 Create Data Structure Visualization Controller
    - Implement GET /api/ds/minheap endpoint returning heap structure with levels/positions
    - Implement GET /api/ds/hashmap endpoint returning bucket structure and load factor
    - Implement GET /api/ds/queue endpoint returning queue items with front/rear pointers
    - Implement GET /api/ds/linkedlist endpoint returning node structure with bidirectional links
    - Include complexity annotations in all responses
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8_
  
  - [~] 12.5 Create Auth Controller
    - Implement POST /api/auth/register endpoint
    - Implement POST /api/auth/login endpoint returning JWT token
    - Implement GET /api/auth/me endpoint for current user info
    - _Requirements: 13.1, 13.2_

- [ ] 13. Implement Error Handling and Response Formatting
  - [~] 13.1 Create error handling middleware
    - Implement global error handler catching all unhandled errors
    - Map error types to appropriate HTTP status codes
    - Return consistent JSON error responses with message field
    - Log errors without exposing sensitive details to client
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 19.6, 19.7_
  
  - [~] 13.2 Implement response formatter utility
    - Create consistent success response format with data field
    - Include metadata (total, stats) for list endpoints
    - Ensure all responses follow documented API format
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7, 18.8_

- [ ] 14. Implement Security Middleware
  - [~] 14.1 Add security headers and CORS
    - Configure helmet for security headers
    - Set up CORS with whitelisted frontend domain
    - Enforce HTTPS in production environment
    - _Requirements: 19.3, 19.5_
  
  - [~] 14.2 Add rate limiting
    - Implement rate limiter middleware (100 requests/minute per user)
    - Apply to all API routes
    - _Requirements: 19.4_

- [~] 15. Checkpoint - Backend API Complete
  - Ensure all endpoints return correct responses, security measures in place, ask the user if questions arise.

- [ ] 16. Frontend Project Setup
  - [~] 16.1 Initialize React app with Vite
    - Create React app with Vite template
    - Install dependencies (react-router-dom, axios, recharts, tailwindcss, lucide-react)
    - Configure TailwindCSS with medical green theme colors
    - Set up dark mode support with class-based strategy
    - _Requirements: 20.6, 20.8_
  
  - [~] 16.2 Create project structure and routing
    - Create folder structure (pages/, components/, services/, hooks/, utils/)
    - Set up React Router with routes for all pages
    - Create layout component with navigation and theme toggle
    - _Requirements: 20.1, 20.8_

- [ ] 17. Implement API Service Layer (Frontend)
  - [~] 17.1 Create API client configuration
    - Set up Axios instance with base URL and interceptors
    - Add request interceptor to attach JWT token to headers
    - Add response interceptor for error handling and token refresh
    - _Requirements: 13.1, 13.8_
  
  - [~] 17.2 Create API service methods
    - Create medicineService with all CRUD methods
    - Create alertService with filtering and acknowledgment methods
    - Create analyticsService for dashboard and trends
    - Create authService for login/register/logout
    - Create dsVisualizationService for data structure endpoints
    - _Requirements: 1.1, 7.1, 10.1, 12.1, 13.1_

- [ ] 18. Implement Authentication Pages
  - [~] 18.1 Create Login page
    - Build login form with username/email and password fields
    - Handle login submission and JWT storage in localStorage
    - Redirect to dashboard on successful login
    - Display error messages for invalid credentials
    - _Requirements: 13.1, 15.1_
  
  - [~] 18.2 Create Register page
    - Build registration form with username, email, password fields
    - Validate password strength client-side
    - Handle registration submission and auto-login
    - _Requirements: 13.2, 14.8, 14.9_
  
  - [~] 18.3 Implement protected route wrapper
    - Create ProtectedRoute component checking JWT token
    - Redirect to login if not authenticated
    - _Requirements: 13.8_

- [ ] 19. Implement Dashboard Page
  - [~] 19.1 Create dashboard stat cards
    - Display 4 stat cards at top (Total Medicines, Total Value, Critical Alerts, Low Stock)
    - Fetch analytics data on mount
    - Update cards with real-time data
    - _Requirements: 10.1, 10.2, 10.3, 10.5, 20.1_
  
  - [~] 19.2 Create status breakdown chart
    - Use Recharts to create donut/pie chart showing Safe/Expiring/Critical/Expired counts
    - Apply color coding (green, amber, red, gray)
    - _Requirements: 10.3, 20.2, 20.5_
  
  - [~] 19.3 Create expiry timeline chart
    - Use Recharts bar chart showing medicine counts by date ranges
    - Display next 30 days with daily buckets
    - _Requirements: 10.9, 20.5_
  
  - [~] 19.4 Create FEFO recommendations table
    - Display top 10 expiring medicines
    - Show name, batch, expiry date, days remaining, status badge
    - Add quick dispense action button
    - _Requirements: 7.1, 7.2, 10.7, 20.3_
  
  - [~] 19.5 Create recent activity feed
    - Display last 10 history entries
    - Show action type, medicine name, timestamp
    - Format with icons for different action types
    - _Requirements: 10.6_

- [ ] 20. Implement Medicine Inventory Page
  - [~] 20.1 Create medicine table component
    - Display medicines in sortable table with columns (name, batch, category, quantity, expiry, status)
    - Implement client-side sorting by clicking column headers
    - Add pagination with 50 items per page
    - Apply status badge color coding
    - _Requirements: 1.9, 20.2, 20.3_
  
  - [~] 20.2 Add search and filter controls
    - Add search input for filtering by name
    - Add dropdown filters for category and status
    - Update table in real-time as filters change
    - _Requirements: 8.1, 8.3, 8.4_
  
  - [~] 20.3 Create Add Medicine modal
    - Build form with all medicine fields (name, batch, category, manufacturer, quantity, price, dates)
    - Validate required fields and date constraints client-side
    - Submit to POST /api/medicines endpoint
    - Refresh table on successful addition
    - _Requirements: 1.1, 14.1, 14.2, 14.3, 14.4, 14.5, 14.6_
  
  - [~] 20.4 Create Edit Medicine modal
    - Pre-populate form with existing medicine data
    - Allow partial updates to fields
    - Submit to PUT /api/medicines/:id endpoint
    - _Requirements: 1.7_
  
  - [~] 20.5 Add Delete and Dispense actions
    - Add delete button with confirmation dialog (admin only)
    - Create dispense modal with quantity input and validation
    - Update table after operations
    - _Requirements: 1.8, 9.1, 9.2, 13.4, 13.5_

- [ ] 21. Implement Alert Center Page
  - [~] 21.1 Create alert tabs and filtering
    - Display tabs for All, Critical, Warnings, Info alerts
    - Show unread badge counts on each tab
    - Filter alerts by selected tab
    - _Requirements: 11.1, 11.2, 20.4_
  
  - [~] 21.2 Create alert list component
    - Display alerts with severity icon, medicine name, message, timestamp
    - Highlight unread alerts with bold or background color
    - Sort by timestamp descending (newest first)
    - _Requirements: 11.1, 11.2_
  
  - [~] 21.3 Add alert action buttons
    - Add "Mark as Read" button changing alert status
    - Add "Acknowledge" button with user confirmation
    - Add "Delete" button with confirmation
    - Update alert counts after actions
    - _Requirements: 11.3, 11.4, 11.5_
  
  - [~] 21.4 Add manual alert generation button
    - Add "Generate Alerts" button (admin/pharmacist only)
    - Trigger POST /api/alerts/generate endpoint
    - Show success message with count of new alerts
    - _Requirements: 11.6_

- [ ] 22. Implement Analytics Page
  - [~] 22.1 Create category breakdown chart
    - Use Recharts bar chart showing medicine count per category
    - Display horizontal bars for better label visibility
    - _Requirements: 10.4, 20.5_
  
  - [~] 22.2 Create expiry trend chart
    - Use Recharts line chart showing expired vs expiring medicines over time
    - Display monthly trend for last 6 months
    - _Requirements: 10.9_
  
  - [~] 22.3 Create stock trend chart
    - Use Recharts area chart showing medicines added vs dispensed
    - Display monthly trend for last 6 months
    - _Requirements: 10.9_
  
  - [~] 22.4 Add low stock alert section
    - Display medicines at or below low stock threshold
    - Show quantity remaining and threshold value
    - Highlight with warning color
    - _Requirements: 10.8_

- [ ] 23. Implement Data Structure Visualization Page
  - [~] 23.1 Create visualization selector
    - Add tabs or dropdown to select MinHeap, HashMap, Queue, LinkedList
    - Fetch visualization data on selection change
    - _Requirements: 12.1, 12.3, 12.5, 12.7_
  
  - [~] 23.2 Create MinHeap visualizer component
    - Display heap as tree structure with levels
    - Show medicine name and expiry date in each node
    - Highlight parent-child relationships
    - Display complexity annotations (Insert: O(log n), Extract: O(log n), Peek: O(1))
    - _Requirements: 12.1, 12.2_
  
  - [~] 23.3 Create HashMap visualizer component
    - Display buckets as rows with bucket index
    - Show entries within each bucket (handle collision chains)
    - Display load factor and collision count
    - Display complexity annotations (Insert/Search/Delete: O(1) avg)
    - _Requirements: 12.3, 12.4_
  
  - [~] 23.4 Create Queue visualizer component
    - Display queue as horizontal array with front/rear markers
    - Show alert items with type and severity
    - Display complexity annotations (Enqueue: O(1), Dequeue: O(1))
    - _Requirements: 12.5, 12.6_
  
  - [~] 23.5 Create LinkedList visualizer component
    - Display nodes in horizontal layout with arrows showing next/prev links
    - Show history entry data (action, medicine name, timestamp)
    - Highlight head and tail nodes
    - Display complexity annotations (Insert Front/Back: O(1), Search: O(n))
    - _Requirements: 12.7, 12.8_

- [ ] 24. Implement Theme and Responsive Design
  - [~] 24.1 Create theme toggle component
    - Add moon/sun icon button in navigation
    - Toggle dark mode class on root element
    - Persist theme preference in localStorage
    - _Requirements: 20.6_
  
  - [~] 24.2 Apply medical green theme colors
    - Define primary color palette (medical green shades)
    - Apply to buttons, links, accents throughout UI
    - Ensure sufficient contrast for accessibility
    - _Requirements: 20.1_
  
  - [~] 24.3 Implement responsive breakpoints
    - Apply mobile styles (single column, stacked cards) for screens < 640px
    - Apply tablet styles (2 column) for screens 640px-1024px
    - Apply desktop styles (3 column) for screens > 1024px
    - Test all pages at different breakpoints
    - _Requirements: 20.7, 20.8_

- [~] 25. Checkpoint - Frontend Complete
  - Ensure all pages render correctly, data flows from API, responsive at all breakpoints, ask the user if questions arise.

- [ ] 26. Create Sample Data Seeding Script
  - [~] 26.1 Write seed script for database
    - Create 50-100 sample medicines with varied categories and expiry dates
    - Distribute expiry dates across Safe/Expiring Soon/Critical/Expired statuses
    - Create sample users (admin, pharmacist, viewer)
    - Generate initial alerts for medicines
    - Create sample history entries
    - _Requirements: 1.1, 5.5, 6.1, 13.1_
  
  - [~] 26.2 Add seed command to package.json
    - Add npm script to run seed script
    - Document seeding process in README
    - _Requirements: 1.1_

- [ ] 27. Integration and End-to-End Testing
  - [ ]* 27.1 Write API integration tests
    - Test full medicine CRUD flow (add, retrieve, update, delete)
    - Test authentication and authorization flows
    - Test alert generation and management
    - Test analytics endpoints return correct calculations
    - _Requirements: 1.1, 11.1, 13.1, 17.1_
  
  - [ ]* 27.2 Write frontend integration tests
    - Test login flow and protected route access
    - Test medicine table sorting, filtering, pagination
    - Test add/edit/delete/dispense operations
    - Test theme toggle persistence
    - _Requirements: 13.1, 20.1, 20.3, 20.6_
  
  - [ ]* 27.3 Manual end-to-end testing
    - Test complete user journey from login to dashboard to medicine management
    - Verify FEFO recommendations display correctly ordered medicines
    - Verify alerts display correct severity and messages
    - Test data structure visualization page displays accurate representations
    - _Requirements: 7.1, 11.1, 12.1_

- [ ] 28. Performance Optimization and Verification
  - [~] 28.1 Verify data structure complexity targets
    - Measure and log MinHeap insert/extract times with 10,000 medicines
    - Measure and log HashMap lookup times with 10,000 medicines
    - Verify dashboard load time under 2 seconds with full dataset
    - Verify API response 95th percentile under 1 second
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 16.8_
  
  - [~] 28.2 Add performance monitoring
    - Log slow queries and operations
    - Add database query optimization (indexes verified)
    - Implement frontend lazy loading for large tables
    - _Requirements: 16.6, 16.7_

- [ ] 29. Documentation and Deployment Preparation
  - [~] 29.1 Write comprehensive README
    - Document project overview and features
    - Document data structure implementations and complexity analysis
    - Provide setup instructions (database, backend, frontend)
    - Document API endpoints with request/response examples
    - Include architecture diagram and screenshots
    - _Requirements: 3.1, 4.1, 5.1, 6.1_
  
  - [~] 29.2 Create deployment configuration
    - Write Dockerfile for backend
    - Write Dockerfile for frontend
    - Create docker-compose.yml for full stack
    - Document environment variable requirements
    - _Requirements: 19.3_
  
  - [~] 29.3 Create demo script
    - Write demo walkthrough script highlighting data structure features
    - Prepare sample scenarios for competitive programming demonstration
    - Document how to showcase O(1) lookups, O(log n) heap operations
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [~] 30. Final Checkpoint and Demo Preparation
  - Ensure all features work end-to-end, run full test suite, verify demo scenarios, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- The system implements 4 custom data structures: MinHeap (expiry priority), HashMap (O(1) search), AlertQueue (FIFO alerts), HistoryLinkedList (chronological tracking)
- JavaScript is used for all implementation (Node.js backend, React frontend)
- Focus on demonstrating data structure efficiency through the visualization page
- Checkpoints ensure incremental validation and user feedback opportunities
- Sample data seeding is critical for realistic demonstration
- Performance verification ensures complexity targets are met for competitive programming demonstration

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "2.1"] },
    { "id": 1, "tasks": ["2.2", "3.1", "3.3", "3.5", "3.7", "4.1"] },
    { "id": 2, "tasks": ["3.2", "3.4", "3.6", "3.8", "4.2", "6.1"] },
    { "id": 3, "tasks": ["6.2", "6.3", "7.1", "8.1", "9.1"] },
    { "id": 4, "tasks": ["6.4", "7.2", "7.3", "8.2", "9.2", "11.1"] },
    { "id": 5, "tasks": ["11.2", "12.1", "12.2", "12.3", "12.4", "12.5"] },
    { "id": 6, "tasks": ["13.1", "13.2", "14.1", "14.2"] },
    { "id": 7, "tasks": ["16.1", "16.2"] },
    { "id": 8, "tasks": ["17.1", "17.2"] },
    { "id": 9, "tasks": ["18.1", "18.2", "18.3"] },
    { "id": 10, "tasks": ["19.1", "19.2", "19.3", "19.4", "19.5"] },
    { "id": 11, "tasks": ["20.1", "20.2"] },
    { "id": 12, "tasks": ["20.3", "20.4", "20.5"] },
    { "id": 13, "tasks": ["21.1", "21.2"] },
    { "id": 14, "tasks": ["21.3", "21.4", "22.1", "22.2", "22.3", "22.4"] },
    { "id": 15, "tasks": ["23.1", "23.2", "23.3", "23.4", "23.5"] },
    { "id": 16, "tasks": ["24.1", "24.2", "24.3"] },
    { "id": 17, "tasks": ["26.1"] },
    { "id": 18, "tasks": ["26.2", "27.1", "27.2", "27.3"] },
    { "id": 19, "tasks": ["28.1", "28.2"] },
    { "id": 20, "tasks": ["29.1", "29.2", "29.3"] }
  ]
}
```
