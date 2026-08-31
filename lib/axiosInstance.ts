export const axiosInstance = {
  async get(url: string, config?: { params?: Record<string, any>; responseType?: string }) {
    let fullUrl = url;
    if (config?.params) {
      const searchParams = new URLSearchParams();
      Object.entries(config.params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== "") {
          searchParams.append(key, String(val));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        fullUrl += (fullUrl.includes("?") ? "&" : "?") + queryString;
      }
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("taskManagerToken") : null;
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(fullUrl, { method: "GET", headers });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${res.status}`);
    }

    if (config?.responseType === "blob") {
      const blob = await res.blob();
      return { data: blob, status: res.status };
    }

    const data = await res.json();
    return { data, status: res.status };
  },

  async post(url: string, body?: any) {
    const token = typeof window !== "undefined" ? localStorage.getItem("taskManagerToken") : null;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body || {}),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return { data, status: res.status };
  },

  async put(url: string, body?: any) {
    const token = typeof window !== "undefined" ? localStorage.getItem("taskManagerToken") : null;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      method: "PUT",
      headers,
      body: JSON.stringify(body || {}),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return { data, status: res.status };
  },

  async delete(url: string) {
    const token = typeof window !== "undefined" ? localStorage.getItem("taskManagerToken") : null;
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, { method: "DELETE", headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return { data, status: res.status };
  },
};

export default axiosInstance;
