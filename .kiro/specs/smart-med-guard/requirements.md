    # Requirements Document: SmartMedGuard

## Introduction

SmartMedGuard is a full-stack medicine inventory management system designed as a Data Structures & Algorithms college project. The system demonstrates practical implementations of core data structures (MinHeap, HashMap, Queue, LinkedList) while solving real-world problems in healthcare inventory management. It provides intelligent medicine expiry tracking, FEFO (First Expire First Out) recommendations, multi-tier alert systems, and comprehensive analytics through a premium healthcare SaaS interface.

## Glossary

- **System**: The complete SmartMedGuard application including frontend, backend, and database
- **Medicine**: A pharmaceutical product with identification, stock, and expiry information
- **MinHeap**: Custom min-heap data structure for expiry-based prioritization
- **HashMap**: Custom hash table implementation for O(1) medicine lookups
- **AlertQueue**: Custom queue data structure for FIFO alert management
- **HistoryList**: Custom doubly-linked list for chronological activity tracking
- **FEFO**: First Expire First Out - inventory management strategy prioritizing earliest expiry dates
- **Status**: Auto-calculated medicine state: Safe (>30 days), Expiring Soon (8-30 days), Critical (1-7 days), or Expired (<0 days)
- **Alert**: System notification for expiry warnings or low stock conditions
- **User**: Authenticated person with role-based permissions (Admin, Pharmacist, Viewer)
- **Dashboard**: Primary analytics interface showing statistics and visualizations
- **Batch_Number**: Unique identifier for a specific medicine production batch
- **API**: REST API endpoints for client-server communication
- **Visualization_Page**: Dedicated interface for demonstrating data structure operations

## Requirements

### Requirement 1: Medicine Management

**User Story:** As a pharmacist, I want to manage medicine inventory with comprehensive details, so that I can track stock, expiry dates, and medicine information accurately.

#### Acceptance Criteria

1. WHEN a user submits a new medicine with valid details (name, batch number, category, manufacturer, quantity, unit, price, low stock threshold, expiry date, manufacture date), THE System SHALL create a medicine record with a unique UUID identifier and auto-calculated status
2. WHEN creating a medicine, THE System SHALL validate that the batch number is unique across all existing medicines
3. WHEN creating a medicine, THE System SHALL validate that the expiry date is after the manufacture date
4. WHEN creating a medicine, THE System SHALL validate that all required fields (name, batch number, category, manufacturer, quantity, price, expiry date, manufacture date) are provided and meet format requirements
5. WHEN a medicine is created successfully, THE System SHALL insert it into the MinHeap, add it to the HashMap, and create a history entry
6. WHEN a user requests medicine details by ID, THE System SHALL retrieve the medicine from the HashMap in O(1) average time
7. WHEN a user updates medicine information, THE System SHALL modify the medicine record, update both MinHeap and HashMap data structures, and create a history entry
8. WHEN a user deletes a medicine, THE System SHALL remove it from MinHeap, HashMap, and database, and create a deletion history entry
9. WHEN retrieving all medicines, THE System SHALL return the complete list with auto-calculated status for each medicine

### Requirement 2: Medicine Status Calculation

**User Story:** As a system user, I want medicines to have automatically calculated status based on expiry dates, so that I can quickly identify which medicines need attention.

#### Acceptance Criteria

1. WHEN calculating status for a medicine with expiry date more than 30 days in the future, THE Status_Calculator SHALL return "Safe" status
2. WHEN calculating status for a medicine with expiry date between 8 and 30 days in the future, THE Status_Calculator SHALL return "Expiring Soon" status
3. WHEN calculating status for a medicine with expiry date between 1 and 7 days in the future, THE Status_Calculator SHALL return "Critical" status
4. WHEN calculating status for a medicine with expiry date in the past, THE Status_Calculator SHALL return "Expired" status
5. WHEN calculating days until expiry, THE Status_Calculator SHALL return an integer representing the difference between expiry date and current date in days
6. WHEN checking if a medicine needs an alert, THE Status_Calculator SHALL return true if days until expiry is 30 or fewer
7. FOR ALL medicines in a batch status calculation, THE Status_Calculator SHALL calculate and return status for each medicine in O(n) time where n is the number of medicines

### Requirement 3: MinHeap Data Structure for Expiry Priority

**User Story:** As a developer, I want medicines stored in a MinHeap ordered by expiry date, so that the system can efficiently identify and retrieve medicines by expiry priority for FEFO recommendations.

#### Acceptance Criteria

1. WHEN a medicine is inserted into the MinHeap, THE MinHeap SHALL maintain the heap property where every parent node's expiry date is less than or equal to its children's expiry dates
2. WHEN extracting the minimum from MinHeap, THE MinHeap SHALL return and remove the medicine with the earliest expiry date in O(log n) time
3. WHEN peeking at the minimum in MinHeap, THE MinHeap SHALL return the medicine with the earliest expiry date without removal in O(1) time
4. WHEN requesting medicines expiring within N days, THE MinHeap SHALL filter and return all medicines with expiry dates within the specified timeframe
5. WHEN requesting top N expiring medicines, THE MinHeap SHALL return exactly N medicines ordered by earliest expiry date in O(n log n) time
6. WHEN removing a specific medicine by ID from MinHeap, THE MinHeap SHALL locate the medicine, remove it, and restore the heap property in O(n) time
7. WHEN updating a medicine in MinHeap, THE MinHeap SHALL modify the medicine data and restore the heap property in O(n) time
8. FOR ALL operations that modify the MinHeap, THE MinHeap SHALL maintain the min-heap invariant where parent expiry dates are less than or equal to children expiry dates

### Requirement 4: HashMap Data Structure for Fast Lookups

**User Story:** As a developer, I want medicines indexed in a HashMap by ID, so that the system can retrieve medicines in constant time for efficient search and access operations.

#### Acceptance Criteria

1. WHEN inserting a medicine into HashMap, THE HashMap SHALL store the key-value pair and complete the operation in O(1) average time
2. WHEN the HashMap load factor exceeds 0.75, THE HashMap SHALL automatically resize by doubling capacity and rehashing all entries
3. WHEN retrieving a medicine by ID from HashMap, THE HashMap SHALL return the medicine in O(1) average time
4. WHEN checking if a medicine ID exists in HashMap, THE HashMap SHALL return true or false in O(1) average time
5. WHEN deleting a medicine by ID from HashMap, THE HashMap SHALL remove the entry and return true in O(1) average time
6. WHEN searching medicines by name, THE HashMap SHALL return all medicines with names containing the search term in O(n) time
7. WHEN searching by batch number, THE HashMap SHALL return the matching medicine in O(1) average time
8. WHEN searching by category, THE HashMap SHALL return all medicines in the specified category in O(n) time
9. FOR ALL keys in the HashMap, THE HashMap SHALL ensure each key maps to at most one medicine with no duplicate IDs

### Requirement 5: Alert Queue Data Structure

**User Story:** As a pharmacist, I want to receive prioritized alerts for expiring medicines and low stock, so that I can take timely action to prevent medicine waste and stockouts.

#### Acceptance Criteria

1. WHEN enqueueing an alert, THE AlertQueue SHALL add it to the rear of the queue in O(1) time
2. WHEN dequeueing an alert, THE AlertQueue SHALL remove and return the alert from the front of the queue in O(1) time and maintain FIFO order
3. WHEN peeking at the front alert, THE AlertQueue SHALL return the front alert without removal in O(1) time
4. WHEN the AlertQueue is full, THE AlertQueue SHALL reject new enqueue operations and return false
5. WHEN generating alerts for a medicine with expiry date in the past, THE AlertQueue SHALL create an "EXPIRED" alert with critical severity
6. WHEN generating alerts for a medicine expiring within 1 day, THE AlertQueue SHALL create an "EXPIRING_1" alert with critical severity
7. WHEN generating alerts for a medicine expiring within 2-7 days, THE AlertQueue SHALL create an "EXPIRING_7" alert with warning severity
8. WHEN generating alerts for a medicine expiring within 8-30 days, THE AlertQueue SHALL create an "EXPIRING_30" alert with info severity
9. WHEN generating alerts for a medicine with quantity at or below the low stock threshold, THE AlertQueue SHALL create a "LOW_STOCK" alert with warning severity
10. WHEN filtering alerts by type, THE AlertQueue SHALL return all alerts matching the specified type
11. WHEN filtering alerts by severity, THE AlertQueue SHALL return all alerts matching the specified severity
12. WHEN retrieving unread alerts, THE AlertQueue SHALL return only alerts where isRead is false
13. WHEN marking an alert as read by ID, THE AlertQueue SHALL update the isRead flag to true and return true if found

### Requirement 6: History Linked List Data Structure

**User Story:** As an administrator, I want to track all medicine operations chronologically, so that I can audit changes, monitor user actions, and maintain compliance records.

#### Acceptance Criteria

1. WHEN adding a history entry to the front, THE HistoryList SHALL insert the entry at the head position in O(1) time
2. WHEN adding a history entry to the back, THE HistoryList SHALL insert the entry at the tail position in O(1) time
3. WHEN removing a history entry from the front, THE HistoryList SHALL remove and return the head entry in O(1) time
4. WHEN removing a history entry from the back, THE HistoryList SHALL remove and return the tail entry in O(1) time
5. WHEN retrieving N recent history entries, THE HistoryList SHALL return up to N entries starting from the head in O(n) time
6. WHEN filtering history by medicine ID, THE HistoryList SHALL return all entries matching the specified medicine ID in O(n) time
7. WHEN filtering history by action type (ADD, UPDATE, DELETE, DISPENSE), THE HistoryList SHALL return all entries matching the specified action
8. WHEN filtering history by date range, THE HistoryList SHALL return all entries with timestamps between start and end dates
9. FOR ALL entries in the HistoryList, THE HistoryList SHALL maintain chronological order with newest entries at the head

### Requirement 7: FEFO Recommendations

**User Story:** As a pharmacist, I want to see medicines prioritized by expiry date, so that I can dispense medicines following the First Expire First Out principle and minimize waste.

#### Acceptance Criteria

1. WHEN requesting FEFO recommendations, THE System SHALL use MinHeap to return medicines ordered by earliest expiry date first
2. WHEN requesting top N FEFO recommendations, THE System SHALL return exactly N medicines with the earliest expiry dates in ascending order
3. WHEN retrieving FEFO recommendations, THE System SHALL include only medicines with positive stock quantities
4. FOR ALL FEFO recommendations, THE System SHALL ensure medicines are ordered in strictly ascending order by expiry date

### Requirement 8: Medicine Search and Filtering

**User Story:** As a user, I want to search for medicines by various criteria, so that I can quickly find specific medicines or groups of medicines.

#### Acceptance Criteria

1. WHEN searching medicines by name with a partial string, THE System SHALL return all medicines where the name contains the search term (case-insensitive)
2. WHEN searching medicines by exact batch number, THE System SHALL return the single medicine matching that batch number in O(1) average time
3. WHEN searching medicines by category, THE System SHALL return all medicines in the specified category
4. WHEN filtering medicines by status, THE System SHALL return all medicines with the specified status (Safe, Expiring Soon, Critical, Expired)
5. WHEN retrieving medicines expiring within N days, THE System SHALL return all medicines with expiry dates within the specified timeframe

### Requirement 9: Medicine Dispensing

**User Story:** As a pharmacist, I want to dispense medicines by reducing stock quantities, so that I can track inventory usage and maintain accurate stock levels.

#### Acceptance Criteria

1. WHEN dispensing a medicine with a requested quantity, THE System SHALL validate that the requested quantity does not exceed available stock
2. WHEN dispensing succeeds, THE System SHALL reduce the medicine quantity by the dispensed amount
3. WHEN dispensing succeeds, THE System SHALL create a history entry with action "DISPENSE" recording quantity before and after
4. WHEN dispensing succeeds, THE System SHALL check if the new quantity is at or below the low stock threshold and generate a low stock alert if needed
5. WHEN dispensing would result in negative stock, THE System SHALL reject the operation and return an error message

### Requirement 10: Dashboard Analytics

**User Story:** As a user, I want to view comprehensive analytics and statistics on the dashboard, so that I can understand the current state of medicine inventory at a glance.

#### Acceptance Criteria

1. WHEN loading the dashboard, THE System SHALL calculate and display the total number of medicines
2. WHEN loading the dashboard, THE System SHALL calculate and display the total inventory value by summing (price × quantity) for all medicines
3. WHEN loading the dashboard, THE System SHALL calculate and display status breakdown counts (Safe, Expiring Soon, Critical, Expired)
4. WHEN loading the dashboard, THE System SHALL calculate and display category breakdown showing medicine count per category
5. WHEN loading the dashboard, THE System SHALL display the count of unread alerts and critical alerts
6. WHEN loading the dashboard, THE System SHALL display recent history entries (last 10 activities)
7. WHEN loading the dashboard, THE System SHALL display top 10 expiring medicines using FEFO recommendations
8. WHEN loading the dashboard, THE System SHALL display medicines with stock at or below low stock threshold
9. WHEN loading the dashboard, THE System SHALL display an expiry timeline showing medicine counts by expiry date ranges

### Requirement 11: Alert Management

**User Story:** As a user, I want to manage alerts through viewing, filtering, marking as read, and acknowledging, so that I can track and respond to important medicine notifications.

#### Acceptance Criteria

1. WHEN retrieving all alerts, THE System SHALL return alerts with unread count and critical count
2. WHEN retrieving unread alerts, THE System SHALL return only alerts where isRead is false
3. WHEN marking an alert as read, THE System SHALL update the isRead flag to true and return success
4. WHEN acknowledging an alert, THE System SHALL update isAcknowledged to true, record the acknowledging user ID, and set the acknowledgedAt timestamp
5. WHEN deleting an alert, THE System SHALL remove it from the AlertQueue and database
6. WHEN manually triggering alert generation, THE System SHALL scan all medicines, generate appropriate alerts based on expiry dates and stock levels, and add them to the AlertQueue

### Requirement 12: Data Structure Visualization

**User Story:** As a college student, I want to visualize how data structures work with medicine data, so that I can demonstrate algorithm concepts and complexity for my competitive programming project.

#### Acceptance Criteria

1. WHEN requesting MinHeap visualization, THE System SHALL return the heap structure with nodes showing medicine data, level, and position information
2. WHEN requesting MinHeap visualization, THE System SHALL include complexity annotations for insert (O(log n)), extractMin (O(log n)), and peekMin (O(1))
3. WHEN requesting HashMap visualization, THE System SHALL return bucket structure showing hash table state, entries per bucket, and collision information
4. WHEN requesting HashMap visualization, THE System SHALL include load factor calculation and complexity annotations for insert, search, and delete operations (O(1) average)
5. WHEN requesting Queue visualization, THE System SHALL return queue items with front and rear pointers
6. WHEN requesting Queue visualization, THE System SHALL include complexity annotations for enqueue (O(1)) and dequeue (O(1))
7. WHEN requesting LinkedList visualization, THE System SHALL return node structure showing data and bidirectional links (next/prev)
8. WHEN requesting LinkedList visualization, THE System SHALL include complexity annotations for insertFront (O(1)), insertBack (O(1)), and search (O(n))

### Requirement 13: User Authentication and Authorization

**User Story:** As a system administrator, I want role-based access control, so that users have appropriate permissions based on their roles.

#### Acceptance Criteria

1. WHEN a user logs in with valid credentials, THE System SHALL authenticate the user using bcrypt password verification and generate a JWT token with 24-hour expiration
2. WHEN a user registers, THE System SHALL hash the password using bcrypt with 10 rounds before storage
3. WHEN an admin user performs any operation, THE System SHALL allow full CRUD access to all resources
4. WHEN a pharmacist user attempts to delete a medicine, THE System SHALL reject the operation with authorization error
5. WHEN a pharmacist user performs add, update, or dispense operations, THE System SHALL allow the operations
6. WHEN a viewer user attempts any write operation, THE System SHALL reject the operation with authorization error
7. WHEN a viewer user requests read operations, THE System SHALL allow access to all read endpoints
8. WHEN a request includes an expired or invalid JWT token, THE System SHALL reject the request with 401 Unauthorized status

### Requirement 14: Input Validation

**User Story:** As a developer, I want comprehensive input validation, so that the system prevents invalid data from entering the database and maintains data integrity.

#### Acceptance Criteria

1. WHEN validating medicine name, THE System SHALL ensure it is 1-200 characters and non-empty
2. WHEN validating batch number, THE System SHALL ensure it is 1-50 alphanumeric characters and unique across all medicines
3. WHEN validating quantity, THE System SHALL ensure it is a non-negative integer
4. WHEN validating price, THE System SHALL ensure it is a positive number
5. WHEN validating expiry date for new medicines, THE System SHALL ensure it is a future date
6. WHEN validating manufacture date and expiry date, THE System SHALL ensure manufacture date is before expiry date
7. WHEN validating low stock threshold, THE System SHALL ensure it is a non-negative integer
8. WHEN validating username, THE System SHALL ensure it is 3-30 alphanumeric characters and unique
9. WHEN validating email, THE System SHALL ensure it matches valid email format and is unique
10. IF validation fails for any field, THEN THE System SHALL return a 400 Bad Request with descriptive error messages

### Requirement 15: Error Handling

**User Story:** As a user, I want clear error messages and graceful error handling, so that I understand what went wrong and can take corrective action.

#### Acceptance Criteria

1. IF a user attempts to add a medicine with an expiry date in the past, THEN THE System SHALL reject the request with error message "Cannot add medicine with past expiry date"
2. IF a user attempts to add a medicine with an existing batch number, THEN THE System SHALL reject the request with error message "Batch number already exists in system"
3. IF a user attempts to dispense more quantity than available, THEN THE System SHALL reject the request with error message "Cannot dispense {requested} {unit}. Only {available} available."
4. IF the database connection fails during an operation, THEN THE System SHALL return 503 Service Unavailable and log the error
5. IF the MinHeap property is violated after an update, THEN THE System SHALL detect the violation, log an error, and rebuild the heap from database
6. IF the AlertQueue reaches maximum capacity, THEN THE System SHALL dequeue oldest read alerts to make space and log a warning
7. IF a user submits an invalid search query, THEN THE System SHALL sanitize the input and return an empty result set

### Requirement 16: Performance Requirements

**User Story:** As a system architect, I want the system to meet specific performance targets, so that users experience fast response times even with large datasets.

#### Acceptance Criteria

1. WHEN retrieving a medicine by ID, THE System SHALL complete the operation in O(1) average time using HashMap
2. WHEN retrieving top N FEFO recommendations, THE System SHALL complete the operation in O(n log n) time using MinHeap
3. WHEN generating alerts for a single medicine, THE System SHALL complete the operation in O(1) time
4. WHEN retrieving N recent history entries, THE System SHALL complete the operation in O(n) time using LinkedList
5. WHEN calculating dashboard analytics for all medicines, THE System SHALL complete the operation in O(n) time where n is the total number of medicines
6. WHEN the system contains 10,000 medicines, THE System SHALL maintain dashboard load time under 2 seconds
7. WHEN the system receives a search query, THE System SHALL return results within 500 milliseconds
8. WHEN the system handles concurrent requests, THE System SHALL maintain API response time 95th percentile under 1 second

### Requirement 17: Data Persistence and Synchronization

**User Story:** As a developer, I want data structures synchronized with the database, so that in-memory data structures and persistent storage remain consistent.

#### Acceptance Criteria

1. WHEN a medicine is added, THE System SHALL insert it into the database, MinHeap, and HashMap atomically
2. WHEN a medicine is updated, THE System SHALL update the database record and both MinHeap and HashMap entries
3. WHEN a medicine is deleted, THE System SHALL remove it from the database, MinHeap, and HashMap
4. WHEN an alert is generated, THE System SHALL add it to both the AlertQueue and database alerts table
5. WHEN a history entry is created, THE System SHALL add it to both the HistoryList and database history table
6. WHEN the system starts up, THE System SHALL load all medicines from the database and rebuild the MinHeap and HashMap data structures
7. IF a database operation fails, THEN THE System SHALL rollback any in-memory data structure changes and return an error

### Requirement 18: API Response Format

**User Story:** As a frontend developer, I want consistent API response formats, so that I can reliably parse and display data in the user interface.

#### Acceptance Criteria

1. WHEN an API request succeeds, THE API SHALL return a JSON response with appropriate data and HTTP 200 status
2. WHEN an API request fails due to validation errors, THE API SHALL return HTTP 400 with an error message describing the validation failure
3. WHEN an API request fails due to authentication, THE API SHALL return HTTP 401 with error message "Unauthorized"
4. WHEN an API request fails due to authorization, THE API SHALL return HTTP 403 with error message "Forbidden"
5. WHEN an API request targets a non-existent resource, THE API SHALL return HTTP 404 with error message "Resource not found"
6. WHEN an API request causes a server error, THE API SHALL return HTTP 500 with a generic error message without exposing sensitive details
7. WHEN retrieving medicines, THE API SHALL include total count and status breakdown statistics in the response
8. WHEN retrieving a single medicine by ID, THE API SHALL include related alerts and history entries in the response

### Requirement 19: Security Requirements

**User Story:** As a security officer, I want the system to implement security best practices, so that sensitive data is protected and vulnerabilities are minimized.

#### Acceptance Criteria

1. WHEN storing passwords, THE System SHALL hash them using bcrypt with 10 rounds
2. WHEN accepting user input, THE System SHALL sanitize all inputs to prevent SQL injection attacks
3. WHEN serving the application, THE System SHALL enforce HTTPS in production environments
4. WHEN receiving API requests, THE System SHALL implement rate limiting of 100 requests per minute per user
5. WHEN handling CORS requests, THE System SHALL whitelist only the frontend domain and reject wildcard origins in production
6. WHEN logging errors, THE System SHALL exclude sensitive data such as passwords, tokens, and personal information
7. WHEN returning error responses, THE System SHALL provide generic error messages without exposing system internals

### Requirement 20: UI/UX Requirements

**User Story:** As a user, I want an intuitive and visually appealing interface, so that I can efficiently manage medicine inventory with minimal training.

#### Acceptance Criteria

1. WHEN displaying the dashboard, THE System SHALL show 4 stat cards (total medicines, total value, alerts, low stock) prominently at the top
2. WHEN displaying medicine status, THE System SHALL use color-coded badges (green for Safe, amber for Expiring Soon, red for Critical, gray for Expired)
3. WHEN displaying the medicine table, THE System SHALL support sortable columns, pagination with 50 items per page, and quick action buttons
4. WHEN displaying alerts, THE System SHALL organize them in tabs (All, Critical, Warnings, Info) with unread badge counts
5. WHEN displaying the dashboard, THE System SHALL include visual charts (status breakdown donut chart, expiry timeline bar chart)
6. WHEN the user selects dark mode, THE System SHALL apply the dark theme color scheme across all interface elements
7. WHEN the interface is viewed on mobile devices (< 640px), THE System SHALL display a stacked single-column layout
8. WHEN the interface is viewed on desktop (> 1024px), THE System SHALL display a 3-column layout with optimal space utilization
