// src/api.js
export const getFeed = async (token) => {
  try {
    const res = await fetch("http://localhost:8080/api/feed", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // JWT token
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch feed");
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
};