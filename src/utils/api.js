const BASE_URL = "http://localhost:3000/api";
const REGISTER_URL = `${BASE_URL}/auth/register`;
const GET_ALL_USERS_URL = `${BASE_URL}/users`;

// const registerUser = async ({ email, password, displayName }) => {
//   console.log(REGISTER_URL);
//   try {
//     const response = await fetch(REGISTER_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email,
//         password,
//         displayName,
//       }),
//     });
//     console.log("Response status:", response.status);
//     if (!response.ok) {
//       alert("Failed to register user");
//       throw new Error("Failed to register user");
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error registering user:", error);
//     throw error;
//   }
// };

// export { registerUser };

// const headersOptions = {
//   "Content-Type": "application/json",
// };

// const get = async (path, token) => {
//   try {
//     const response = await fetch(BASE_URL + path, {
//       method: "GET",
//       headers: {
//         ...headersOptions,
//         ...(token && { Authorization: `Bearer ${token}` }),
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch data");
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error;
//   }
// }

// const post = async (path, body, headers = {}, token) => {
//   try {
//     const response = await fetch(BASE_URL + path, {
//       method: "POST",
//       headers: {
//         ...headersOptions,
//         ...headers,
//         ...(token && { Authorization: `Bearer ${token}` }),
//       },
//       body: JSON.stringify(body),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to post data");
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error posting data:", error);
//     throw error;
//   }
// }

// const put = async (path, body, headers = {}, token) => {
//   try {
//     const response = await fetch(BASE_URL + path, {
//       method: "PUT",
//       headers: {
//         ...headersOptions,
//         ...headers,
//         ...(token && { Authorization: `Bearer ${token}` }),
//       },
//       body: JSON.stringify(body),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to update data");
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error updating data:", error);
//     throw error;
//   }
// }

// const del = async (path, token) => {
//   try {
//     const response = await fetch(BASE_URL + path, {
//       method: "DELETE",
//       headers: {
//         ...headersOptions,
//         ...(token && { Authorization: `Bearer ${token}` }),
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Failed to delete data");
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error deleting data:", error);
//     throw error;
//   }
// }

// export {
//   get,
//   post,
//   put,
//   del,
// };

export const api = {
  token: localStorage.getItem("fincoach_token"),

  setToken(token) {
    this.token = token;
  },

  getHeaders() {
    return {
      "Content-Type": "application/json",
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
    };
  },

  async get(path) {
    try {
      const response = await fetch(BASE_URL + path, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      return await response.json();
    }
    catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  },

  async post(path, body, headers = {}) {
    try {
      const response = await fetch(BASE_URL + path, {
        method: "POST",
        headers: { ...this.getHeaders(), ...headers },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to post data");
      }

      return await response.json();
    }
    catch (error) {
      console.error("Error posting data:", error);
      throw error;
    }
  },

  async put(path, body, headers = {}) {
    try {
      const response = await fetch(BASE_URL + path, {
        method: "PUT",
        headers: { ...this.getHeaders(), ...headers },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error("Failed to update data");
      }

      return await response.json();
    }
    catch (error) {
      console.error("Error updating data:", error);
      throw error;
    }
  },

  async delete(path) {
    try {
      const response = await fetch(BASE_URL + path, {
        method: "DELETE",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete data");
      }

      return await response.json();
    }
    catch (error) {
      console.error("Error deleting data:", error);
      throw error;
    }
  }
}