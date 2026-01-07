module.exports = {
  // Your Chromatic project token (get from https://www.chromatic.com)
  projectToken: process.env.CHROMATIC_PROJECT_TOKEN || 'chpt_691df257eb5c2b2',
  
  // Build script name
  buildScriptName: 'build-storybook',
  
  // Exit with code 0 even if there are visual changes
  exitZeroOnChanges: true,
  
  // Exit once upload is complete (don't wait for results)
  exitOnceUploaded: true,
  
  // Only run Chromatic on main branch or PRs
  onlyChanged: true,
  
  // Storybook build directory
  buildDir: 'storybook-static',
}

