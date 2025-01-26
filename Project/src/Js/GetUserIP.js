/* 
Pros: Simple and fast. No server setup is required.
Cons: Relies on a third-party service and internet access.
*/

// Fetch the user's IP address
async function getUserIpAddress() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Failed to fetch IP address:', error);
  }
}

// Export the getUserIpAddress function to be used in other modules
export { getUserIpAddress };

