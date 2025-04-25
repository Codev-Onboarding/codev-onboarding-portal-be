
/**
 * @swagger
 * /api/new-hires:
 *   get:
 *     summary: Get all new hires
 *     tags: [NewHire]
 *     responses:
 *       200:
 *         description: List of all new hires
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/new-hires/{id}:
 *   get:
 *     summary: Get a new hire by ID
 *     tags: [NewHire]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the new hire
 *     responses:
 *       200:
 *         description: New hire retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: New hire not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/new-hires/{id}:
 *   put:
 *     summary: Update a new hire by ID
 *     tags: [NewHire]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the new hire
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     completed:
 *                       type: boolean
 *               e201Link:
 *                 type: string
 *     responses:
 *       200:
 *         description: New hire updated successfully
 *       404:
 *         description: New hire not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/new-hires/{id}:
 *   delete:
 *     summary: Delete a new hire by ID
 *     tags: [NewHire]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the new hire
 *     responses:
 *       200:
 *         description: New hire deleted successfully
 *       404:
 *         description: New hire not found
 *       500:
 *         description: Server error
 */