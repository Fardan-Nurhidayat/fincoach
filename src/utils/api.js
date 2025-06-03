const BASE_URL = "http://localhost:3000/api";
const REGISTER_URL = `${BASE_URL}/auth/register`;
const GET_ALL_USERS_URL = `${BASE_URL}/users`;

const registerUser = async ({ email, password, displayName }) => {
  console.log(REGISTER_URL);
  try {
    const response = await fetch(REGISTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        displayName,
      }),
    });
    console.log("Response status:", response.status);
    if (!response.ok) {
      alert("Failed to register user");
      throw new Error("Failed to register user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export { registerUser };
