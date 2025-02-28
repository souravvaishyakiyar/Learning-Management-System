import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { getCourseProgress, markAsCompleted, markAsInCompleted, updateLectureprogress} from '../controllers/courseProgress.controller.js';

const router = express.Router();

router.route('/:courseId').get(isAuthenticated,getCourseProgress)
router.route('/:courseId/lecture/:lectureId/view').post(isAuthenticated,updateLectureprogress);
router.route('/:courseId/complete').post(isAuthenticated,markAsCompleted)
router.route('/:courseId/incomplete').post(isAuthenticated,markAsInCompleted);

export default router;
