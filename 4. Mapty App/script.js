"use strict";

const form = document.querySelector(".form");
const type = document.querySelector(".form__input--type");
const distance = document.querySelector(".form__input--distance");
const duration = document.querySelector(".form__input--duration");
const cadence = document.querySelector(".form__input--cadence");
const elevation = document.querySelector(".form__input--elevation");
const workoutsContainer = document.querySelector(".workouts");

class Workout {
  id;
  constructor(type, distance, duration, coords) {
    this.id = Math.trunc(Math.random() * 10000000 + 1);
    this.type = type;
    this.distance = distance;
    this.duration = duration;
    this.coords = coords;
  }
}

class Running extends Workout {
  constructor(type, distance, duration, cadence, coords) {
    super(type, distance, duration, coords);
    this.cadence = cadence;
    this.pace = Math.trunc(this._calcSpeed());
  }

  _calcSpeed() {
    return this.duration / this.distance;
  }
}

class Cycling extends Workout {
  constructor(type, distance, duration, elevation, coords) {
    super(type, distance, duration, coords);
    this.elevation = elevation;
    this.pace = Math.trunc(this._calcSpeed());
  }

  _calcSpeed() {
    return this.distance / this.duration;
  }
}

class App {
  #map;
  #mapEvent;
  #workouts = [];
  #workout;
  constructor() {
    this._loadMap();
    this._toggleElevationField();
    this._restoreFromLocalStorage();
    workoutsContainer.addEventListener("click", this._moveToLoc.bind(this));
    form.addEventListener("submit", this._newWorkout.bind(this));
  }

  _loadMap() {
    navigator.geolocation.getCurrentPosition(
      this._getCurrentPosition.bind(this),
      function () {
        alert("COULD NOT GET YOUR LOCATION!");
      }
    );
  }

  _getCurrentPosition(e) {
    const { latitude, longitude } = e.coords;

    this.#map = L.map("map").setView([latitude, longitude], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on("click", this._showForm.bind(this));
    this.#workouts.forEach((workout) => {
      this._renderWorkoutTile(workout);
      this._renderWorkoutMarker(workout);
    });
  }

  _showForm(mapE) {
    form.classList.remove("hidden");
    this.#mapEvent = mapE;
    distance.focus();
  }

  _hideForm() {
    distance.value = duration.value = cadence.value = elevation.value = "";
    cadence.blur();
    elevation.blur();
    form.classList.add("hidden");
  }

  _toggleElevationField() {
    type.addEventListener("change", function () {
      cadence.closest(".form__row").classList.toggle("form__row--hidden");
      elevation.closest(".form__row").classList.toggle("form__row--hidden");
    });
  }

  _renderWorkoutMarker(workout) {
    const emoji = workout.type === "running" ? "🏃🏼‍♂️" : "🚴🏼‍♂️";

    if (this.#mapEvent) {
      const { lat, lng } = this.#mapEvent.latlng;
      workout.coords = [lat, lng];
    }

    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxHeight: 100,
          maxWidth: 250,
          autoClose: false,
          closeOnClick: false,
          className: `${workout?.type}-popup`,
        }).setContent(
          `${emoji} ${
            workout?.type[0].toUpperCase() + workout?.type.slice(1)
          } on ${this._formatDate()}`
        )
      )
      .openPopup();
  }

  _renderWorkoutTile(workout) {
    const workoutTypeMetric =
      workout.type === "running"
        ? `<div class="workout__details">
  <span class="workout__icon">🦶🏼</span>
  <span class="workout__value">${workout.cadence}</span>
  <span class="workout__unit">spm</span>
</div>`
        : `<div class="workout__details">
      <span class="workout__icon">⛰</span>
      <span class="workout__value">${workout.elevation}</span>
      <span class="workout__unit">m</span>
    </div>`;

    const markup =
      `<li class="workout workout--${workout.type}" data-id=${workout.id}>
    <h2 class="workout__title">Running on ${this._formatDate()}</h2>
    <div class="workout__details">
      <span class="workout__icon">${
        workout.type === "running" ? "🏃🏼‍♂️" : "🚴🏼‍♂️"
      }</span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">min</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⚡️</span>
      <span class="workout__value">${workout.pace}</span>
      <span class="workout__unit">min/km</span>
    </div>` + workoutTypeMetric;

    form.insertAdjacentHTML("afterend", markup);
  }

  _verifyInputs(...inputs) {
    return inputs.every((inp) => inp > 0);
  }

  _formatDate() {
    return new Date().toLocaleDateString("en-us", {
      month: "long",
      day: "numeric",
    });
  }

  _newWorkout(e) {
    e.preventDefault();

    if (type.value === "running") {
      if (
        this._verifyInputs(+distance.value, +duration.value, +cadence.value)
      ) {
        this.#workout = new Running(
          type.value,
          distance.value,
          duration.value,
          cadence.value
        );
      } else {
        this._hideForm();
        return alert("All inputs must be positive numbers!");
      }
    }

    if (type.value === "cycling") {
      if (
        this._verifyInputs(+distance.value, +duration.value, +elevation.value)
      ) {
        this.#workout = new Cycling(
          type.value,
          distance.value,
          duration.value,
          elevation.value
        );
      } else {
        this._hideForm();
        return alert("All inputs must be positive numbers!");
      }
    }

    this.#workouts.push(this.#workout);

    this._renderWorkoutTile(this.#workout);

    this._renderWorkoutMarker(this.#workout);

    this._saveInLocalStorage(this.#workouts);

    this._hideForm();
  }

  _moveToLoc(e) {
    if (!this.#map) return;

    const workoutEl = e.target.closest(".workout");

    if (!workoutEl) return;

    const selectedWorkout = this.#workouts.find(
      (workout) => workout.id == workoutEl.dataset.id
    );

    this.#map.flyTo(selectedWorkout.coords, 13);
  }

  _saveInLocalStorage(workouts) {
    localStorage.setItem("workout", JSON.stringify(workouts));
  }

  _restoreFromLocalStorage() {
    const workouts = JSON.parse(localStorage.getItem("workout"));
    if (workouts) {
      workouts.forEach((workout) => {
        this.#workouts.push(workout);
      });
    } else return;
  }

  _clearLocalStorage() {
    window.localStorage.clear();
  }
}

const app = new App();
