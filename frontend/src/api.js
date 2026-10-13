const API_BASE_URL = "http://localhost:8081/api";

// Common function for handling API requests
async function apiRequest(endpoint, options = {}) {
const response = await fetch(`${API_BASE_URL}${endpoint}`, {
...options,
headers: {
"Content-Type": "application/json",
...options.headers,
},
});

if (!response.ok) {
const errorMessage = await response.text();
throw new Error(
errorMessage || `Request failed with status ${response.status}`
);
}

// DELETE requests may return an empty response
if (response.status === 204) {
return null;
}

const contentType = response.headers.get("content-type");

if (contentType && contentType.includes("application/json")) {
return response.json();
}

return null;
}
export async function checkBackend() {
const data = await apiRequest("/home");
return data.message;
}
export async function getActivities(date) {
const query = date
? `?date=${encodeURIComponent(date)}`
: "";

return apiRequest(`/activities${query}`);
}
export async function addActivity(activity) {
return apiRequest("/activities", {
method: "POST",
body: JSON.stringify(activity),
});
}
export async function completeActivity(id) {
return apiRequest(`/activities/${id}/complete`, {
method: "PUT",
});
}
export async function deleteActivity(id) {
return apiRequest(`/activities/${id}`, {
method: "DELETE",
});
}
export async function getWaterRecords(date) {
const query = date
? `?date=${encodeURIComponent(date)}`
: "";

return apiRequest(`/water${query}`);
}
export async function addWaterRecord(waterRecord) {
return apiRequest("/water", {
method: "POST",
body: JSON.stringify(waterRecord),
});
}
export async function updateWaterRecord(id, waterRecord) {
return apiRequest(`/water/${id}`, {
method: "PUT",
body: JSON.stringify(waterRecord),
});
}
export async function deleteWaterRecord(id) {
return apiRequest(`/water/${id}`, {
method: "DELETE",
});
}
export async function getDailyWaterTotal(date) {
const records = await getWaterRecords(date);

return records.reduce(
(total, record) => total + Number(record.amountMl || 0),
0
);
}
