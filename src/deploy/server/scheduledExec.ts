const schedule = require('node-schedule');
const Docker = require('dockerode');
const fs = require('fs');
const docker = new Docker();

// Simulate a database of user schedules
const userSchedules = [
  { userId: 'user1', script: 'print("Hello from user1")', schedule: '0 16 * * *' }, // Daily at 4 PM
  { userId: 'user2', script: 'print("Hello from user2")', schedule: '0 14 * * MON,FRI' }, // Mondays and Fridays at 2 PM
  { userId: 'user3', script: 'print("Hello from user3")', schedule: '0 */2 * * *' }, // Every 2 hours
];

// Save user Python scripts
const saveUserScript = (userId, script) => {
  const filePath = `./user_scripts/${userId}_script.py`;
  fs.writeFileSync(filePath, script);
  return filePath;
};

// Execute the Python script in a Docker container
const executePythonScript = async (userId, scriptPath) => {
  try {
    const container = await docker.createContainer({
      Image: 'python:3.9',
      Cmd: ['python', `/scripts/${scriptPath}`],
      HostConfig: {
        Binds: [`${__dirname}/user_scripts:/scripts`],
      },
    });

    console.log(`[Task] Starting container for user: ${userId}`);
    await container.start();

    // Stream logs
    const stream = await container.logs({
      follow: true,
      stdout: true,
      stderr: true,
    });
    stream.pipe(process.stdout);

    await container.wait();
    console.log(`[Task] Execution completed for user: ${userId}`);
    await container.remove();
  } catch (error) {
    console.error(`[Error] Execution failed for user ${userId}: ${error.message}`);
  }
};

// Schedule tasks
const scheduleTasks = (schedules) => {
  schedules.forEach(({ userId, script, schedule }) => {
    // Save script to file
    const scriptPath = saveUserScript(userId, script);

    // Schedule the execution
    schedule.scheduleJob(schedule, async () => {
      console.log(`[Schedule] Executing script for user: ${userId} at ${new Date()}`);
      await executePythonScript(userId, scriptPath);
    });

    console.log(`[System] Scheduled task for user: ${userId} with schedule: ${schedule}`);
  });
};

// Start scheduling
console.log('[System] Initializing scheduling...');
scheduleTasks(userSchedules);
