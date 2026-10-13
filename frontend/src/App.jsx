
import { useEffect, useState } from "react";
import {
  checkBackend,
  getActivities,
  addActivity,
  completeActivity,
  deleteActivity,
} from "./api";

function getLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function App() {
  // Backend connection
  const [backendStatus, setBackendStatus] = useState(
    "Connecting to backend..."
  );

  useEffect(() => {
    checkBackend()
      .then(setBackendStatus)
      .catch((error) => {
        console.error("Backend connection error:", error);
        setBackendStatus("Backend connection failed. Check Spring Boot.");
      });
  }, []);

  // Login state: demo login only
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Dashboard state
  const [date, setDate] = useState(getLocalDate());
  const [diet, setDiet] = useState("Balanced");
  const [water, setWater] = useState(0);

  // Food, fruit and medicine state
  const [food, setFood] = useState("");
  const [fruit, setFruit] = useState("");
  const [medicine, setMedicine] = useState("");

  const [foods, setFoods] = useState([]);
  const [fruits, setFruits] = useState([]);
  const [medicines, setMedicines] = useState([]);

  // Activities loaded from Spring Boot / MySQL
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState("");
  const [activityCategory, setActivityCategory] = useState("Habit");
  const [activityLoading, setActivityLoading] = useState(false);
  const [activitySaving, setActivitySaving] = useState(false);
  const [activityError, setActivityError] = useState("");
  const [activityMessage, setActivityMessage] = useState("");

  // Load activities whenever the selected date changes
  useEffect(() => {
    let cancelled = false;

    async function loadActivities() {
      setActivityLoading(true);
      setActivityError("");
      setActivityMessage("");

      try {
        const data = await getActivities(date);

        if (!cancelled) {
          setActivities(
            data.map((activity) => ({
              ...activity,
              name: activity.activityName,
              done: activity.completed,
            }))
          );
        }
      } catch (error) {
        console.error("Loading activities failed:", error);

        if (!cancelled) {
          setActivityError(
            "Could not load activities. Check that the backend is running."
          );
        }
      } finally {
        if (!cancelled) {
          setActivityLoading(false);
        }
      }
    }

    loadActivities();

    return () => {
      cancelled = true;
    };
  }, [date]);

  // Demo login; actual account authentication is not implemented
  function handleLogin(event) {
    event.preventDefault();

    if (email.trim() && password.length >= 6) {
      setLoggedIn(true);
    } else {
      alert(
        "Enter a valid email and a password with at least 6 characters."
      );
    }
  }

  // Add an item to the food, fruit or medicine lists
  function addItem(value, setter, list, setList) {
    if (!value.trim()) return;

    setList((previous) => [
      ...previous,
      {
        id: `${Date.now()}-${previous.length}`,
        name: value.trim(),
      },
    ]);

    setter("");
  }

  // Add a new activity to MySQL
  async function handleAddActivity(event) {
    event.preventDefault();

    if (!newActivity.trim()) return;

    setActivitySaving(true);
    setActivityError("");
    setActivityMessage("");

    try {
      await addActivity({
        activityName: newActivity.trim(),
        category: activityCategory,
        activityDate: date,
        completed: false,
      });

      setNewActivity("");
      setActivityMessage("Activity saved successfully.");

      const data = await getActivities(date);

      setActivities(
        data.map((activity) => ({
          ...activity,
          name: activity.activityName,
          done: activity.completed,
        }))
      );
    } catch (error) {
      console.error("Adding activity failed:", error);
      setActivityError("Could not save the activity. Please try again.");
    } finally {
      setActivitySaving(false);
    }
  }

  // Mark an activity as completed in MySQL
  async function handleCompleteActivity(id) {
    setActivityError("");
    setActivityMessage("");

    try {
      await completeActivity(id);

      const data = await getActivities(date);

      setActivities(
        data.map((activity) => ({
          ...activity,
          name: activity.activityName,
          done: activity.completed,
        }))
      );

      setActivityMessage("Activity marked as completed.");
    } catch (error) {
      console.error("Completing activity failed:", error);
      setActivityError("Could not update the activity.");
    }
  }

  // Delete an activity from MySQL
  async function handleDeleteActivity(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this activity?"
    );

    if (!confirmed) return;

    setActivityError("");
    setActivityMessage("");

    try {
      await deleteActivity(id);

      setActivities((previous) =>
        previous.filter((activity) => activity.id !== id)
      );

      setActivityMessage("Activity deleted successfully.");
    } catch (error) {
      console.error("Deleting activity failed:", error);
      setActivityError("Could not delete the activity.");
    }
  }

  const completed = activities.filter(
    (activity) => activity.completed
  ).length;

  // Login page
  if (!loggedIn) {
    return (
      <main className="login-page">
        <section className="login-card">
          <div className="brand-icon">♥</div>

          <h1>Health Tracker</h1>

          <p className="muted">
            Your daily companion for a healthier routine.
          </p>

          <p className="backend-status" role="status">
            {backendStatus}
          </p>

          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email address</label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />

            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter at least 6 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              minLength={6}
              required
            />

            <button className="primary-button" type="submit">
              Login to Health Tracker
            </button>
          </form>

          <p className="login-note">
            Demo version: real account verification will be added
            with the backend.
          </p>
        </section>
      </main>
    );
  }

  // Dashboard
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2>♥ Health Tracker</h2>

        <p className="sidebar-caption">YOUR DAILY WELLNESS</p>

        <a href="#overview">Overview</a>
        <a href="#diet">Diet plan</a>
        <a href="#water">Water tracker</a>
        <a href="#food">Food tracker</a>
        <a href="#fruits">Fruit tracker</a>
        <a href="#medicines">Medicines</a>
        <a href="#activities">Daily activities</a>

        <button
          className="logout-button"
          onClick={() => setLoggedIn(false)}
        >
          Log out
        </button>
      </aside>

      <main className="dashboard">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">YOUR PERSONAL WELLNESS SPACE</p>

            <h1>Health Dashboard</h1>

            <p className="muted">
              Small healthy habits, one day at a time.
            </p>

            <p className="backend-status" role="status">
              {backendStatus}
            </p>
          </div>

          <div className="date-control">
            <label htmlFor="date">Select date</label>

            <input
              id="date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
        </header>

        {/* Overview */}
        <section id="overview" className="stats-grid">
          <article className="stat-card">
            <span>✓</span>
            <p>Activities completed</p>
            <h2>
              {completed}/{activities.length}
            </h2>
          </article>

          <article className="stat-card">
            <span>💧</span>
            <p>Water glasses</p>
            <h2>{water}</h2>
          </article>

          <article className="stat-card">
            <span>🥗</span>
            <p>Diet preference</p>
            <h2 className="stat-value">{diet}</h2>
          </article>
        </section>

        {/* Diet plan */}
        <section id="diet" className="panel">
          <h2>🥗 Your Diet Plan</h2>

          <p className="muted">
            Choose your preferred eating pattern.
          </p>

          <label htmlFor="diet">Diet preference</label>

          <select
            id="diet"
            value={diet}
            onChange={(event) => setDiet(event.target.value)}
          >
            <option>Balanced</option>
            <option>Vegetarian</option>
            <option>Vegan</option>
            <option>High-protein</option>
            <option>Clinician-advised</option>
          </select>

          <p className="helper-text">
            Follow dietary advice suited to your individual needs.
          </p>
        </section>

        {/* Water tracker */}
        <section id="water" className="panel">
          <h2>💧 Water Tracker</h2>

          <p className="muted">Record each glass you drink.</p>

          <div className="water-row">
            <div>
              <strong>{water} glasses</strong>
              <p className="helper-text">Today's recorded intake</p>
            </div>

            <div className="button-row">
              <button
                className="secondary-button"
                onClick={() =>
                  setWater((previous) => Math.max(0, previous - 1))
                }
                aria-label="Remove one glass"
              >
                −
              </button>

              <button
                className="primary-button compact"
                onClick={() => setWater((previous) => previous + 1)}
              >
                + Add glass
              </button>
            </div>
          </div>
        </section>

        {/* Food tracker */}
        <section id="food" className="panel">
          <h2>🍽️ Food Tracker</h2>

          <form
            className="add-form"
            onSubmit={(event) => {
              event.preventDefault();
              addItem(food, setFood, foods, setFoods);
            }}
          >
            <input
              aria-label="Food item"
              placeholder="Enter a meal or food item"
              value={food}
              onChange={(event) => setFood(event.target.value)}
            />

            <button className="primary-button compact" type="submit">
              Add food
            </button>
          </form>

          <ItemList items={foods} empty="No food items added yet." />
        </section>

        {/* Fruit tracker */}
        <section id="fruits" className="panel">
          <h2>🍎 Fruit Tracker</h2>

          <form
            className="add-form"
            onSubmit={(event) => {
              event.preventDefault();
              addItem(fruit, setFruit, fruits, setFruits);
            }}
          >
            <input
              aria-label="Fruit"
              placeholder="Enter a fruit"
              value={fruit}
              onChange={(event) => setFruit(event.target.value)}
            />

            <button className="primary-button compact" type="submit">
              Add fruit
            </button>
          </form>

          <ItemList items={fruits} empty="No fruits recorded yet." />
        </section>

        {/* Medicine reminders */}
        <section id="medicines" className="panel">
          <h2>💊 Medicine Reminders</h2>

          <p className="helper-text">
            Record medicines according to the schedule provided by
            your qualified healthcare professional.
          </p>

          <form
            className="add-form"
            onSubmit={(event) => {
              event.preventDefault();
              addItem(
                medicine,
                setMedicine,
                medicines,
                setMedicines
              );
            }}
          >
            <input
              aria-label="Medicine reminder"
              placeholder="Enter reminder name"
              value={medicine}
              onChange={(event) => setMedicine(event.target.value)}
            />

            <button className="primary-button compact" type="submit">
              Add reminder
            </button>
          </form>

          <ItemList
            items={medicines}
            empty="No medicine reminders added yet."
          />
        </section>

        {/* Daily activities connected to MySQL */}
        <section id="activities" className="panel">
          <h2>📋 Daily Activities</h2>

          <p className="muted">
            Activities for {date}. Tick an activity when you finish it.
          </p>

          <form className="add-form" onSubmit={handleAddActivity}>
            <input
              aria-label="New activity"
              placeholder="Enter an activity, e.g. Morning walk"
              value={newActivity}
              onChange={(event) => setNewActivity(event.target.value)}
              required
            />

            <select
              aria-label="Activity category"
              value={activityCategory}
              onChange={(event) =>
                setActivityCategory(event.target.value)
              }
            >
              <option value="Habit">Habit</option>
              <option value="Food">Food</option>
              <option value="Exercise">Exercise</option>
              <option value="Medicine">Medicine</option>
              <option value="Other">Other</option>
            </select>

            <button
              className="primary-button compact"
              type="submit"
              disabled={activitySaving}
            >
              {activitySaving ? "Saving..." : "Add activity"}
            </button>
          </form>

          {activityLoading && (
            <p className="helper-text" role="status">
              Loading activities...
            </p>
          )}

          {activityError && (
            <p role="alert" className="helper-text">
              {activityError}
            </p>
          )}

          {activityMessage && (
            <p role="status" className="helper-text">
              {activityMessage}
            </p>
          )}

          {!activityLoading && !activityError && activities.length === 0 && (
            <p className="helper-text">
              No activities for this date yet. Add your first activity above.
            </p>
          )}

          {activities.map((activity) => (
            <div className="activity-row" key={activity.id}>
              <input
                type="checkbox"
                id={`activity-${activity.id}`}
                checked={activity.completed}
                disabled={activity.completed}
                onChange={() => handleCompleteActivity(activity.id)}
              />

              <label
                htmlFor={`activity-${activity.id}`}
                className={activity.completed ? "activity-done" : ""}
              >
                {activity.name}
                <span className="helper-text">
                  {" "}({activity.category})
                </span>
              </label>

              <button
                className="secondary-button"
                type="button"
                onClick={() => handleDeleteActivity(activity.id)}
                aria-label={`Delete ${activity.name}`}
              >
                Delete
              </button>
            </div>
          ))}
        </section>

        <footer>
          Health Tracker · Selected date: {date} · Your wellness, your routine.
        </footer>
      </main>
    </div>
  );
}

// Reusable list for food, fruit and medicine
function ItemList({ items, empty }) {
  if (items.length === 0) {
    return <p className="helper-text">{empty}</p>;
  }

  return (
    <ul className="item-list">
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
