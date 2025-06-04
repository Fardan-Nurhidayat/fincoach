const BASE_URL = "http://localhost:3000/api";

export const api = {
  token: localStorage.getItem("fincoach_token"),

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("fincoach_token", token);
    } else {
      localStorage.removeItem("fincoach_token");
    }
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      console.error("Error deleting data:", error);
      throw error;
    }
  },
};
