const API_URL = "http://localhost:5001/api";

export async function getTest() {
  const res = await fetch(`${API_URL}/test`);
  return res.json();
}
