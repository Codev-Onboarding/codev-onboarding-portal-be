/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: systemadmin@email.com
 *               password:
 *                 example: P@ssword123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user (System Admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []  # 🔐 Requires Bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: hr1@example.com
 *               password:
 *                 type: string
 *                 example: P@ssword123
 *               role:
 *                 type: string
 *                 enum: [HR, IT, MANAGER, ADMIN]
 *                 example: HR
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists or invalid input
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       403:
 *         description: Forbidden (not a System Admin)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/register-new-hire:
 *   post:
 *     summary: Create a new hire
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []  # 🔐 Requires Bearer token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - e201Link
 *               - tasks
 *             properties:
 *               email:
 *                 type: string
 *                 example: newhire@email.com
 *               name:
 *                 type: string
 *                 example: New Hire
 *               e201Link:
 *                 type: string
 *                 example: some link
 *               tasks:
 *                 type: array
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
 *                       example: Submit onboarding documents
 *                     description:
 *                       type: string
 *                       example: Employee must upload all necessary onboarding documents.
 *                     checklistType:
 *                       type: string
 *                       example: Pre-employment
 *                     dueDate:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-05-01T00:00:00.000Z
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-04-12T00:00:00.000Z
 *     responses:
 *       201:
 *         description: New hire created successfully
 *       400:
 *         description: Bad request (missing or invalid fields)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset a user's password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid input or password mismatch
 *       500:
 *         description: Server error
 */
