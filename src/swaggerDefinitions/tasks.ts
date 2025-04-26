/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks with filters, pagination, and sorting
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by task status (e.g., INCOMPLETE, PENDING, COMPLETED, VERIFIED)
 *       - in: query
 *         name: checklistType
 *         schema:
 *           type: string
 *         description: Filter by checklist type (e.g., Talent Readiness Program, IT Provisioning, Pre-employment)
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: Filter tasks by user ID
 *       - in: query
 *         name: approvedBy
 *         schema:
 *           type: string
 *         description: Filter by approver user_id ID
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Search in task title and description
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of tasks per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Comma-separated sorting fields (e.g., title:asc,createdAt:desc)
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                 limit:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 total:
 *                   type: integer
 *                 length:
 *                   type: integer
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the task
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 status:
 *                   type: string
 *                 user_id:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/tasks/{task_id}/status:
 *   patch:
 *     summary: Update task status (complete or incomplete)
 *     description: >
 *       Updates the status of a task based on the user's role and required fields.
 *
 *       - If `status` is `COMPLETED`, the `referenceLink` field is **required**. Only users with the `Employee` role can mark tasks as completed.
 *       - If `status` is `INCOMPLETE`, the `approvalNote` field is **required**. Only users with the `HR` or `SystemAdmin` role can mark tasks as incomplete.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: task_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [COMPLETED, INCOMPLETE]
 *                 description: New status of the task
 *                 example: COMPLETED
 *               referenceLink:
 *                 type: string
 *                 description: Required if status is COMPLETED
 *                 example: "https://drive.google.com/reference"
 *               approvalNote:
 *                 type: string
 *                 description: Required if status is INCOMPLETE
 *                 example: "Missing required documents"
 *     responses:
 *       200:
 *         description: Task successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request - missing required fields for the given status
 *       403:
 *         description: Forbidden - user does not have permission
 *       404:
 *         description: Task not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/tasks/{id}/new-hire:
 *   post:
 *     summary: Add tasks to a user by ID
 *     description: Adds one or more tasks to a specific user and updates their NewHire record.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to assign tasks to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tasks
 *             properties:
 *               tasks:
 *                 type: array
 *                 description: Array of tasks to assign
 *                 items:
 *                   type: object
 *                   required:
 *                     - title
 *                     - description
 *                     - checklistType
 *                     - dueDate
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Submit onboarding documents"
 *                     description:
 *                       type: string
 *                       example: "Employee must upload all necessary onboarding documents."
 *                     checklistType:
 *                       type: string
 *                       example: "Pre-employment"
 *                     dueDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-01T00:00:00.000Z"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-12T00:00:00.000Z"
 *     responses:
 *       200:
 *         description: Tasks successfully created and assigned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NewHire'
 *       404:
 *         description: New hire not found
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /api/tasks/{id}:
 *   patch:
 *     summary: Update task information
 *     description: Allows updating the title, description, and due date of an existing task.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - dueDate
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the task
 *                 example: "Submit onboarding documents"
 *               description:
 *                 type: string
 *                 description: Description of the task
 *                 example: "Employee must upload all necessary onboarding documents."
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: Due date of the task
 *                 example: "2025-05-01T00:00:00.000Z"
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request, invalid input
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     description: Deletes a task by its ID and removes it from any associated NewHire records.
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the task to be deleted
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Task deleted successfully"
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */


