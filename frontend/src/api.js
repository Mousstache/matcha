const API_URL = "http://localhost:5000/api";

export async function getTest() {
  const res = await fetch(`${API_URL}/test`);
  return res.json();
}
