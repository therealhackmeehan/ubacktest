const Docker = require('dockerode');
const fs = require('fs');
const path = require('path');

const docker = new Docker();

const launchPythonScheduler = async (userId, scheduleConfig) => {
  try {
    // Directory for logs
    const logDir = path.join(__dirname, `logs/${userId}`);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    // Generate user-specific Python script
    const scriptContent = `
import schedule
import time
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(filename='/app/logs/scheduler.log', level=logging.INFO,
                    format='%(asctime)s - %(message)s')

# User task
def user_task():
    logging.info("Executing task for user ${userId}.")
    print("Task executed at:", datetime.now())

# Schedule the task
schedule.every().day.at("${scheduleConfig.time}").do(user_task)

# Keep the scheduler running
logging.info("Scheduler started for user ${userId}.")
try:
    while True:
        schedule.run_pending()
        time.sleep(1)
except Exception as e:
    logging.error(f"Scheduler encountered an error: {e}")
    raise
`;

    const scriptPath = path.join(logDir, 'scheduler.py');
    fs.writeFileSync(scriptPath, scriptContent);

    // Run Docker container
    const container = await docker.createContainer({
      Image: 'python:3.9',
      Cmd: ['python', `/scripts/scheduler.py`],
      HostConfig: {
        Binds: [`${logDir}:/app/logs`],
      },
    });

    await container.start();
    console.log(`Scheduler container started for user: ${userId}`);
  } catch (error) {
    console.error(`Failed to launch scheduler for user ${userId}:`, error.message);
  }
};

// Example usage
const userId = 'user1';
const scheduleConfig = { time: '16:00' }; // Daily at 4 PM
launchPythonScheduler(userId, scheduleConfig);
