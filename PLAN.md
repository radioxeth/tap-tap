Plan: Refactor Tap Tap for Level-Based Progression
Refactor the game to support multi-level gameplay where each level requires 200 balls to progress. Level completion advances to the next level; failure restarts the current level. Track per-level high scores and overall game scores. Implement level-specific ball motion: Level 1 (jiggle), Level 2 (elliptical paths), Level 3 (linear directional movement).

Steps
1. Create configuration constants and level system in app.js by defining GAME_CONFIG with timing/animation/scoring constants, and LEVEL_CONFIGS array with per-level settings including requiredBalls: 200, startTTL: 3000, checkpointTTL: 1000, ballMotion: {type, params}, backgroundColor, ballColor, and soundtrack.

2. Add level state and score tracking by extending the score object with currentLevel and totalBallsGathered, creating separate localStorage tracking for bestScorePerLevel (array) and bestOverallScore, and modifying game logic to distinguish between level score and cumulative score.

3. Extract reusable utility functions including getCurrentTTL(level, ballsGathered), getLevelConfig(levelId), checkLevelCompletion() (200 balls check), transitionToNextLevel(), restartCurrentLevel(), and separate ball creation from addBall() into createBallElement() and applyBallMotion(ball, motionConfig).

4. Implement motion system architecture by creating MOTION_TYPES configuration object, applyJiggleMotion(ball) (existing Level 1), applyEllipticalMotion(ball, params) (Level 2 - CSS animation or RAF-based with random ellipse dimensions/orientation), and applyLinearMotion(ball, params) (Level 3 - RAF-based with random direction/speed vectors within safe bounds).

5. Update game flow logic in handleBallClick() to check level completion at 200 balls (show level complete modal, transition to next level), modify gameOver() to check if 200 balls reached (advance level) vs not reached (restart level), and update restartGame() to handle both full game restart and current level restart scenarios.

6. Update UI and persistence in index.html by adding level indicator to score display, modifying game over modal to show "Level Complete!" or "Level Failed" with level-specific stats, updating updateStatsDisplay() to show current level and per-level best scores, and enhancing shareResults() to include level reached and overall score.

Further Considerations
1. Motion implementation approach - Level 2/3 ball motion: Use CSS animations with dynamic keyframe injection for ellipses, or requestAnimationFrame for smoother physics-based movement? RAF provides more control but requires refactoring ball position updates.

2. Level completion UX flow - Should there be a celebration animation/screen between levels, or immediate transition? Consider brief pause with "Level X Complete! Starting Level Y..." message before continuing.

3. Score display complexity - With per-level and overall scores, the score display becomes crowded. Consider showing current level score primarily, with modal showing detailed per-level breakdown and overall total.

4. Ball motion collision boundaries - For Level 3 linear motion, balls need boundary detection to bounce/wrap/reverse direction. Define behavior when balls reach viewport edges to prevent them from going off-screen permanently.